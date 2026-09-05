alter table public.farmplug_orders drop constraint if exists farmplug_orders_status_check;
alter table public.farmplug_orders add constraint farmplug_orders_status_check check (status in ('quote_pending','quote_accepted','order_confirmed','collecting','in_transit','delivered','completed','cancelled'));

create or replace function public.transition_farmplug_order(p_order_id uuid,p_next_status text)
returns public.farmplug_orders
language plpgsql
security definer
set search_path=public,auth
as $$
declare o public.farmplug_orders; old_status text;
begin
 select * into o from public.farmplug_orders where id=p_order_id for update;
 if not found then raise exception 'Order not found'; end if;
 if auth.uid() is null or (o.farmer_id is distinct from auth.uid() and o.buyer_id is distinct from auth.uid()) then raise exception 'Not authorized'; end if;
 old_status:=o.status;
 if not ((old_status='quote_pending' and p_next_status in ('quote_accepted','cancelled')) or (old_status='quote_accepted' and p_next_status in ('order_confirmed','cancelled')) or (old_status='order_confirmed' and p_next_status in ('collecting','cancelled')) or (old_status='collecting' and p_next_status in ('in_transit','cancelled')) or (old_status='in_transit' and p_next_status in ('delivered','cancelled')) or (old_status='delivered' and p_next_status='completed')) then raise exception 'Invalid order transition: % -> %',old_status,p_next_status; end if;
 update public.farmplug_orders set status=p_next_status,updated_at=now() where id=p_order_id returning * into o;
 insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata) values(auth.uid(),'order_status_changed','order',p_order_id::text,jsonb_build_object('from',old_status,'to',p_next_status));
 return o;
end; $$;
revoke all on function public.transition_farmplug_order(uuid,text) from public;
revoke execute on function public.transition_farmplug_order(uuid,text) from anon;
grant execute on function public.transition_farmplug_order(uuid,text) to authenticated;
