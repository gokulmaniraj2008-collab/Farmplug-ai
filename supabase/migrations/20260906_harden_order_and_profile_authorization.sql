begin;

drop policy if exists "buyers can update their farmplug orders" on public.farmplug_orders;
drop policy if exists "farmers can update their farmplug orders" on public.farmplug_orders;

create or replace function public.protect_profile_role_fields()
returns trigger
language plpgsql
security definer
set search_path=public,auth
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.role is distinct from old.role or new.farm_role is distinct from old.farm_role then
      raise exception 'Only an administrator can change profile role fields';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role_fields on public.profiles;
create trigger protect_profile_role_fields
before update on public.profiles
for each row execute function public.protect_profile_role_fields();

commit;
