-- Only run against your ACTUAL profiles table after confirming column names.
-- This assumes a `profiles` table keyed by auth.users.id already exists
-- (typical for existing Supabase email/password auth).

alter table public.profiles
  add column if not exists auth_provider text default 'email',
  add column if not exists avatar_url text,
  add column if not exists profile_complete boolean not null default false,
  add column if not exists phone text,
  add column if not exists location_text text;

-- Admin must never be selectable via public self-service role assignment.
-- Enforce this in RLS, not just in the UI:
alter table public.profiles enable row level security;

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role in ('farmer', 'buyer', 'fpo')  -- 'admin' excluded intentionally
  );

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Admin role must only be grantable via a service-role/server-side path
-- (e.g. a separate admin console or manual DB action), never this policy.
