-- File: migrations/xxxx_buyer_requirements.sql
--
-- REVIEW BEFORE RUNNING: no prior batch touched `buyer_requirements` —
-- if it already exists (possibly as `farmplug_requirements` to match
-- the `farmplug_orders`/`farmplug_quote_requests` naming convention
-- confirmed elsewhere), do NOT run this. Send the real column list
-- instead and this becomes an ALTER, not a guessed CREATE.
--
-- Assumes existing table: profiles(id)

create table if not exists public.buyer_requirements (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id),
  crop_name text not null,
  quantity_kg numeric not null check (quantity_kg > 0),
  quality_grade text,
  delivery_location text,
  delivery_date date,
  packaging text,
  target_price_per_kg numeric,
  storage_requirements text,
  status text not null default 'open', -- open | matched | fulfilled | cancelled
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_buyer_requirements_buyer on public.buyer_requirements(buyer_id);

alter table public.buyer_requirements enable row level security;

drop policy if exists "buyer_requirements_owner_all" on public.buyer_requirements;
create policy "buyer_requirements_owner_all" on public.buyer_requirements
  for all using (auth.uid() = buyer_id) with check (auth.uid() = buyer_id);

-- Farmers/FPOs need to see open requirements to be matched against —
-- adjust if your role check differs from a bare "any authenticated user".
drop policy if exists "buyer_requirements_public_read_open" on public.buyer_requirements;
create policy "buyer_requirements_public_read_open" on public.buyer_requirements
  for select using (status = 'open' or auth.uid() = buyer_id);

drop policy if exists "buyer_requirements_admin_read" on public.buyer_requirements;
create policy "buyer_requirements_admin_read" on public.buyer_requirements
  for select using (public.is_admin());
