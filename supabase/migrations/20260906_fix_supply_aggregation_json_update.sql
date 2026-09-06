create or replace function public.contribute_to_supply_aggregation(p_aggregation_id uuid,p_listing_id uuid,p_contribution_kg numeric)
returns public.supply_aggregations
language plpgsql
security definer
set search_path=public,auth
as $$
declare
  a public.supply_aggregations;
  l public.farmplug_supply_listings;
  target numeric;
  original_items jsonb;
  rebuilt_items jsonb := '[]'::jsonb;
  current_item jsonb;
  found boolean := false;
  new_total numeric;
begin
  if auth.uid() is null or p_contribution_kg <= 0 then raise exception 'Invalid contribution'; end if;
  select * into a from public.supply_aggregations where id=p_aggregation_id for update;
  if not found then raise exception 'Aggregation not found'; end if;
  if lower(coalesce(a.status,'')) in ('completed','cancelled') then raise exception 'Aggregation is closed'; end if;
  select * into l from public.farmplug_supply_listings where id=p_listing_id and created_by=auth.uid() for update;
  if not found then raise exception 'Supply listing not found or not owned by user'; end if;
  if lower(coalesce(l.status,'')) <> 'available' then raise exception 'Supply listing is not available'; end if;
  if p_contribution_kg > l.quantity_kg then raise exception 'Contribution exceeds listing quantity'; end if;
  select quantity_kg into target from public.farmplug_buyer_requirements where id=a.requirement_id;
  new_total := coalesce(a.total_quantity_kg,0) + p_contribution_kg;
  original_items := case when jsonb_typeof(coalesce(a.selected_listings,'[]'::jsonb))='array' then coalesce(a.selected_listings,'[]'::jsonb) else '[]'::jsonb end;
  for current_item in select value from jsonb_array_elements(original_items)
  loop
    if jsonb_typeof(current_item)='object' and current_item->>'listing_id'=p_listing_id::text then
      current_item := jsonb_set(current_item,'{contribution_kg}',to_jsonb(coalesce((current_item->>'contribution_kg')::numeric,0)+p_contribution_kg),true);
      found := true;
    end if;
    rebuilt_items := rebuilt_items || jsonb_build_array(current_item);
  end loop;
  if not found then rebuilt_items := rebuilt_items || jsonb_build_array(jsonb_build_object('listing_id',p_listing_id,'farmer_id',auth.uid(),'contribution_kg',p_contribution_kg)); end if;
  update public.supply_aggregations set total_quantity_kg=new_total,selected_listings=rebuilt_items,status=case when target is not null and new_total >= target then 'ready' else 'forming' end,updated_at=now() where id=p_aggregation_id returning * into a;
  return a;
end;
$$;
revoke all on function public.contribute_to_supply_aggregation(uuid,uuid,numeric) from public;
revoke execute on function public.contribute_to_supply_aggregation(uuid,uuid,numeric) from anon;
grant execute on function public.contribute_to_supply_aggregation(uuid,uuid,numeric) to authenticated;
