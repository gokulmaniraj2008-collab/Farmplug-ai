-- FarmPlug AI: make negotiation a first-class, audited order state.
alter table public.farmplug_orders drop constraint if exists farmplug_orders_status_check;
alter table public.farmplug_orders add constraint farmplug_orders_status_check check (status = any (array['quote_pending','negotiating','quote_accepted','order_confirmed','collecting','in_transit','delivered','completed','cancelled']));

create or replace function public.transition_farmplug_order(p_order_id uuid, p_next_status text)
returns public.farmplug_orders
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  o public.farmplug_orders;
  old_status text;
  actor uuid := auth.uid();
  actor_role text;
  actor_farm_role text;
  is_admin_actor boolean := false;
  is_fpo_actor boolean := false;
  is_buyer_actor boolean := false;
  is_farmer_actor boolean := false;
begin
  if actor is null then raise exception 'Not authorized'; end if;
  select role, farm_role into actor_role, actor_farm_role from public.profiles where id=actor;
  is_admin_actor := lower(coalesce(actor_role,'')) in ('admin','super_admin');
  is_fpo_actor := lower(coalesce(actor_role,'')) in ('fpo','aggregator') or lower(coalesce(actor_farm_role,'')) in ('fpo','aggregator');
  select * into o from public.farmplug_orders where id=p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  is_buyer_actor := o.buyer_id=actor;
  is_farmer_actor := o.farmer_id=actor;
  if not (is_admin_actor or is_fpo_actor or is_buyer_actor or is_farmer_actor) then raise exception 'Not authorized'; end if;
  old_status := lower(coalesce(o.status,''));
  p_next_status := lower(p_next_status);
  if not ((old_status='quote_pending' and p_next_status in ('negotiating','quote_accepted','cancelled')) or
          (old_status='negotiating' and p_next_status in ('quote_pending','quote_accepted','cancelled')) or
          (old_status='quote_accepted' and p_next_status in ('order_confirmed','cancelled')) or
          (old_status='order_confirmed' and p_next_status in ('collecting','cancelled')) or
          (old_status='collecting' and p_next_status in ('in_transit','cancelled')) or
          (old_status='in_transit' and p_next_status in ('delivered','cancelled')) or
          (old_status='delivered' and p_next_status='completed')) then
    raise exception 'Invalid order transition: % -> %',old_status,p_next_status;
  end if;
  if not is_admin_actor then
    if p_next_status='quote_accepted' and not is_buyer_actor then raise exception 'Not authorized'; end if;
    if p_next_status='order_confirmed' and not is_buyer_actor then raise exception 'Not authorized'; end if;
    if p_next_status in ('collecting','in_transit','delivered') and not (is_farmer_actor or is_fpo_actor) then raise exception 'Not authorized'; end if;
    if p_next_status='completed' and not is_buyer_actor then raise exception 'Not authorized'; end if;
    if p_next_status in ('negotiating','quote_pending','cancelled') and not (is_buyer_actor or is_farmer_actor or is_fpo_actor) then raise exception 'Not authorized'; end if;
  end if;
  update public.farmplug_orders set status=p_next_status,updated_at=now() where id=p_order_id returning * into o;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata)
  values(actor,'order_status_changed','order',p_order_id::text,jsonb_build_object('from',old_status,'to',p_next_status));
  return o;
end;
$$;

revoke execute on function public.transition_farmplug_order(uuid,text) from public, anon;
grant execute on function public.transition_farmplug_order(uuid,text) to authenticated;
