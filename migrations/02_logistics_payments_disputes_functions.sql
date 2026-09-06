-- File: migrations/xxxx_logistics_payments_disputes_functions.sql
--
-- Verified directly against the live "Gkfxl" Supabase project via
-- Supabase MCP (list_tables + pg_policies + pg_proc), not guessed.
--
-- FINDING: logistics_routes, payments, escrow_transactions, and
-- disputes already exist as tables with RLS enabled, but only have
-- SELECT policies for order participants. There is no INSERT/UPDATE
-- path for any of them — not via RLS policy, not via a function. This
-- migration adds exactly that, following the same SECURITY DEFINER +
-- role-check pattern already used by transition_farmplug_order()
-- and accept_quote_request().
--
-- Order status lifecycle is untouched — transition_farmplug_order()
-- already implements it correctly and is NOT modified here.
--
-- Master prompt rules #12/#13/#14 (never invent real payments/GPS):
-- every row this creates carries is_simulation / is_prototype = true,
-- which already exist as columns on these tables with that exact
-- default. The functions below never set them to false.

-- =========================================================
-- LOGISTICS (logistics_routes)
-- =========================================================

create or replace function public.create_logistics_route(
  p_order_id uuid,
  p_collection_hub text,
  p_buyer_location text,
  p_vehicle_capacity_kg numeric default null
)
returns public.logistics_routes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order record;
  v_actor uuid := auth.uid();
  v_role text;
  v_farm_role text;
  v_route public.logistics_routes;
begin
  if v_actor is null then
    raise exception 'Not authorized';
  end if;

  select role, farm_role into v_role, v_farm_role from public.profiles where id = v_actor;

  if lower(coalesce(v_role, '')) <> 'admin' and lower(coalesce(v_farm_role, '')) <> 'fpo' then
    raise exception 'Only FPO or admin accounts can create a logistics route';
  end if;

  select * into v_order from public.farmplug_orders where id = p_order_id;
  if v_order is null then
    raise exception 'Order not found';
  end if;

  if exists (select 1 from public.logistics_routes where order_id = p_order_id) then
    raise exception 'A logistics route already exists for this order';
  end if;

  insert into public.logistics_routes (
    order_id, collection_hub, buyer_location, pickup_sequence,
    vehicle_capacity_kg, status, routing_provider, optimization_method,
    is_prototype
  ) values (
    p_order_id, p_collection_hub, p_buyer_location,
    jsonb_build_array(
      jsonb_build_object('label', p_collection_hub, 'stage', 'collection'),
      jsonb_build_object('label', 'In transit', 'stage', 'transit'),
      jsonb_build_object('label', p_buyer_location, 'stage', 'delivery')
    ),
    p_vehicle_capacity_kg, 'planned', 'none (simulated straight-line sequence)',
    'static_sequence', true
  )
  returning * into v_route;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id)
  values (v_actor, 'logistics_route_created', 'logistics_route', v_route.id::text);

  return v_route;
end;
$$;

create or replace function public.advance_logistics_route(
  p_route_id uuid,
  p_new_status text
)
returns public.logistics_routes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_role text;
  v_farm_role text;
  v_route public.logistics_routes;
begin
  if v_actor is null then
    raise exception 'Not authorized';
  end if;

  if p_new_status not in ('planned', 'active', 'completed', 'cancelled') then
    raise exception 'Invalid logistics route status: %', p_new_status;
  end if;

  select role, farm_role into v_role, v_farm_role from public.profiles where id = v_actor;
  if lower(coalesce(v_role, '')) <> 'admin' and lower(coalesce(v_farm_role, '')) <> 'fpo' then
    raise exception 'Only FPO or admin accounts can update a logistics route';
  end if;

  update public.logistics_routes
    set status = p_new_status, updated_at = now()
    where id = p_route_id
    returning * into v_route;

  if v_route is null then
    raise exception 'Logistics route not found';
  end if;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (v_actor, 'logistics_route_status_changed', 'logistics_route', p_route_id::text,
    jsonb_build_object('to', p_new_status));

  insert into public.notifications (user_id, title, body)
  select unnest(array[o.buyer_id, o.farmer_id]),
    'Logistics update',
    'Route status: ' || p_new_status || ' (simulated tracking, no live GPS)'
  from public.farmplug_orders o where o.id = v_route.order_id;

  return v_route;
end;
$$;

grant execute on function public.create_logistics_route(uuid, text, text, numeric) to authenticated;
grant execute on function public.advance_logistics_route(uuid, text) to authenticated;

drop policy if exists "logistics_fpo_admin_read" on public.logistics_routes;
create policy "logistics_fpo_admin_read" on public.logistics_routes
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and lower(coalesce(p.farm_role, '')) = 'fpo'
    )
  );

-- =========================================================
-- SIMULATED PAYMENTS + ESCROW
-- =========================================================

create or replace function public.simulate_authorize_payment(p_order_id uuid)
returns public.payments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order record;
  v_payment public.payments;
begin
  select * into v_order from public.farmplug_orders where id = p_order_id;
  if v_order is null then raise exception 'Order not found'; end if;

  if auth.uid() <> v_order.buyer_id and not public.is_admin() then
    raise exception 'Only the buyer can authorize payment for this order';
  end if;

  if v_order.status not in ('order_confirmed', 'collecting', 'in_transit', 'delivered') then
    raise exception 'Order is not far enough along to authorize payment';
  end if;

  if v_order.total_amount is null then raise exception 'Order has no total_amount set'; end if;
  if exists (select 1 from public.payments where order_id = p_order_id) then
    raise exception 'A payment record already exists for this order';
  end if;

  insert into public.payments (order_id, amount, currency, status, provider, is_simulation)
  values (p_order_id, v_order.total_amount, v_order.currency, 'authorized', 'simulated', true)
  returning * into v_payment;

  insert into public.escrow_transactions (order_id, amount, status, is_simulation)
  values (p_order_id, v_order.total_amount, 'funded', true);

  insert into public.audit_logs (actor_id, action, entity_type, entity_id)
  values (auth.uid(), 'payment_simulated_authorized', 'order', p_order_id::text);

  insert into public.notifications (user_id, title, body)
  values (v_order.farmer_id, 'Payment authorized (simulated)',
    'The buyer has authorized a simulated payment. No real funds have moved.');

  return v_payment;
end;
$$;

create or replace function public.simulate_release_payment(p_order_id uuid)
returns public.payments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order record;
  v_payment public.payments;
begin
  select * into v_order from public.farmplug_orders where id = p_order_id;
  if v_order is null then raise exception 'Order not found'; end if;

  if auth.uid() not in (v_order.buyer_id) and not public.is_admin() then
    raise exception 'Only the buyer or an admin can release this payment';
  end if;

  if v_order.status not in ('delivered', 'completed') then
    raise exception 'Order must be delivered before payment can be released';
  end if;

  update public.payments
    set status = 'released', updated_at = now()
    where order_id = p_order_id and status in ('authorized', 'paid')
    returning * into v_payment;

  if v_payment is null then raise exception 'No authorized payment found for this order'; end if;

  update public.escrow_transactions
    set status = 'released', released_at = now()
    where order_id = p_order_id and status in ('funded', 'held');

  insert into public.audit_logs (actor_id, action, entity_type, entity_id)
  values (auth.uid(), 'payment_simulated_released', 'order', p_order_id::text);

  insert into public.notifications (user_id, title, body)
  values (v_order.farmer_id, 'Payment released (simulated)',
    'Simulated payment has been released to you. No real funds have moved.');

  return v_payment;
end;
$$;

create or replace function public.simulate_refund_payment(p_order_id uuid)
returns public.payments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order record;
  v_payment public.payments;
begin
  select * into v_order from public.farmplug_orders where id = p_order_id;
  if v_order is null then raise exception 'Order not found'; end if;
  if not public.is_admin() then raise exception 'Only an admin can issue a simulated refund'; end if;

  update public.payments set status = 'refunded', updated_at = now()
    where order_id = p_order_id returning * into v_payment;
  if v_payment is null then raise exception 'No payment found for this order'; end if;

  update public.escrow_transactions set status = 'refunded', released_at = now()
    where order_id = p_order_id;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id)
  values (auth.uid(), 'payment_simulated_refunded', 'order', p_order_id::text);

  insert into public.notifications (user_id, title, body)
  values (v_order.buyer_id, 'Payment refunded (simulated)',
    'A simulated refund was issued for this order.');

  return v_payment;
end;
$$;

grant execute on function public.simulate_authorize_payment(uuid) to authenticated;
grant execute on function public.simulate_release_payment(uuid) to authenticated;
grant execute on function public.simulate_refund_payment(uuid) to authenticated;

-- =========================================================
-- DISPUTES
-- =========================================================

create or replace function public.open_dispute(p_order_id uuid, p_reason text)
returns public.disputes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order record;
  v_dispute public.disputes;
begin
  select * into v_order from public.farmplug_orders where id = p_order_id;
  if v_order is null then raise exception 'Order not found'; end if;

  if auth.uid() not in (v_order.buyer_id, v_order.farmer_id) then
    raise exception 'Only the buyer or farmer on this order can open a dispute';
  end if;

  if p_reason is null or length(trim(p_reason)) = 0 then
    raise exception 'A reason is required to open a dispute';
  end if;

  insert into public.disputes (order_id, opened_by, reason, status)
  values (p_order_id, auth.uid(), p_reason, 'open')
  returning * into v_dispute;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id)
  values (auth.uid(), 'dispute_opened', 'dispute', v_dispute.id::text);

  insert into public.notifications (user_id, title, body)
  select case when auth.uid() = o.buyer_id then o.farmer_id else o.buyer_id end,
    'Dispute opened', 'A dispute was opened on order #' || left(o.id::text, 8)
  from public.farmplug_orders o where o.id = p_order_id;

  return v_dispute;
end;
$$;

create or replace function public.resolve_dispute(
  p_dispute_id uuid,
  p_new_status text,
  p_resolution text default null
)
returns public.disputes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dispute public.disputes;
begin
  if not public.is_admin() then raise exception 'Only an admin can resolve a dispute'; end if;
  if p_new_status not in ('investigating', 'resolved', 'rejected') then
    raise exception 'Invalid dispute status: %', p_new_status;
  end if;

  update public.disputes
    set status = p_new_status,
        resolution = coalesce(p_resolution, resolution),
        resolved_at = case when p_new_status in ('resolved', 'rejected') then now() else resolved_at end
    where id = p_dispute_id
    returning * into v_dispute;

  if v_dispute is null then raise exception 'Dispute not found'; end if;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'dispute_status_changed', 'dispute', p_dispute_id::text,
    jsonb_build_object('to', p_new_status));

  return v_dispute;
end;
$$;

grant execute on function public.open_dispute(uuid, text) to authenticated;
grant execute on function public.resolve_dispute(uuid, text, text) to authenticated;

drop policy if exists "disputes_admin_read" on public.disputes;
create policy "disputes_admin_read" on public.disputes
  for select using (public.is_admin());
