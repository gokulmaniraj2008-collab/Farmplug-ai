-- File: migrations/xxxx_farms_crops.sql
--
-- REVIEW BEFORE RUNNING: no prior batch touched `farms` or `crops` — if
-- either table already exists in your project, do NOT run this. Diff
-- column names instead and send them over so this can become a proper
-- ALTER migration rather than a guessed CREATE.
--
-- Assumes existing table: profiles(id)
-- NOTE: `produce_listings` is referenced by app code in this batch but
-- was never confirmed against the live schema in any prior batch either
-- (it was a guess in the earlier "google-auth" batch, not verified via
-- Supabase MCP like farmplug_orders/farmplug_quote_requests were). If
-- `produce_listings` already exists with different columns, the Add
-- Produce form in this batch will need adjusting to match.

create table if not exists public.farms (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references public.profiles(id) unique,
  farm_name text,
  location_text text,
  farm_area_acres numeric,
  storage_available boolean not null default false,
  storage_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crops (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  farmer_id uuid not null references public.profiles(id),
  crop_name text not null,
  variety text,
  expected_harvest_date date,
  crop_calendar_notes text,
  health_status text default 'unknown', -- unknown | healthy | attention | at_risk
  health_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_crops_farm on public.crops(farm_id);
create index if not exists idx_crops_farmer on public.crops(farmer_id);

alter table public.farms enable row level security;
alter table public.crops enable row level security;

drop policy if exists "farms_owner_all" on public.farms;
create policy "farms_owner_all" on public.farms
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

drop policy if exists "crops_owner_all" on public.crops;
create policy "crops_owner_all" on public.crops
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- Admin read access (matches the is_admin() pattern from migration_admin_read_access.sql,
-- if that migration was applied — remove this block if it wasn't).
drop policy if exists "farms_admin_read" on public.farms;
create policy "farms_admin_read" on public.farms
  for select using (public.is_admin());

drop policy if exists "crops_admin_read" on public.crops;
create policy "crops_admin_read" on public.crops
  for select using (public.is_admin());
