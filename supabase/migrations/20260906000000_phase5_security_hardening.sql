-- FarmPlug AI Phase 5 security hardening
-- Applied to the connected Supabase project on 2026-09-06.

-- Remove implicit PUBLIC EXECUTE from internal SECURITY DEFINER routines.
revoke execute on function public.get_db_stats() from public;
revoke execute on function public.get_user_stats(text) from public;
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.prevent_role_self_escalation() from public;
revoke execute on function public.reset_missions_seq_if_empty() from public;
revoke execute on function public.track_ai_usage(text, integer, numeric) from public;
revoke execute on function public.transition_farmplug_order(uuid, text) from public;

-- is_admin() is referenced by authenticated RLS policies, so it remains callable
-- by signed-in users but is no longer exposed to anonymous RPC callers.
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Prevent non-admin users from changing either role field in their own profile.
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    if new.role is distinct from old.role then
      new.role := old.role;
    end if;
    if new.farm_role is distinct from old.farm_role then
      new.farm_role := old.farm_role;
    end if;
  end if;
  return new;
end;
$$;

revoke execute on function public.prevent_role_self_escalation() from public;

comment on function public.prevent_role_self_escalation() is
  'Internal profile trigger: prevents non-admin users from changing role or farm_role.';
