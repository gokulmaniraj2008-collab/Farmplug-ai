drop policy if exists "farmplug requirements owner update" on public.farmplug_buyer_requirements;
create policy "farmplug requirements owner update" on public.farmplug_buyer_requirements for update to authenticated
using (created_by = auth.uid() or public.is_admin())
with check (created_by = auth.uid() or public.is_admin());

drop policy if exists "supply aggregations operator insert" on public.supply_aggregations;
create policy "supply aggregations operator insert" on public.supply_aggregations for insert to authenticated
with check (exists (select 1 from public.profiles p where p.id=auth.uid() and (lower(coalesce(p.role,'')) in ('admin','super_admin','fpo','aggregator') or lower(coalesce(p.farm_role,'')) in ('fpo','aggregator'))));

drop policy if exists "supply aggregations operator update" on public.supply_aggregations;
create policy "supply aggregations operator update" on public.supply_aggregations for update to authenticated
using (exists (select 1 from public.profiles p where p.id=auth.uid() and (lower(coalesce(p.role,'')) in ('admin','super_admin','fpo','aggregator') or lower(coalesce(p.farm_role,'')) in ('fpo','aggregator'))))
with check (exists (select 1 from public.profiles p where p.id=auth.uid() and (lower(coalesce(p.role,'')) in ('admin','super_admin','fpo','aggregator') or lower(coalesce(p.farm_role,'')) in ('fpo','aggregator'))));

drop policy if exists "delivery events operator insert" on public.delivery_events;
create policy "delivery events operator insert" on public.delivery_events for insert to authenticated
with check (exists (select 1 from public.profiles p where p.id=auth.uid() and (lower(coalesce(p.role,'')) in ('admin','super_admin','fpo','aggregator') or lower(coalesce(p.farm_role,'')) in ('fpo','aggregator'))));
