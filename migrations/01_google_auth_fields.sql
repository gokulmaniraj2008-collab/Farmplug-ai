alter table public.profiles
  add column if not exists auth_provider text default 'email',
  add column if not exists avatar_url text,
  add column if not exists profile_complete boolean not null default false,
  add column if not exists phone text,
  add column if not exists location_text text;

alter table public.profiles enable row level security;
drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id and role in ('farmer','buyer','fpo'));
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles for select using (auth.uid() = id);
