# FarmPlug AI Security Checklist

## Verified in the September 5, 2026 audit

- [x] Server-only Supabase secret is read from server environment variables.
- [x] Farmer listing API validates the Supabase bearer token before database access.
- [x] Order API validates the bearer token and checks buyer/farmer ownership.
- [x] Order status transitions are allow-listed and role-restricted.
- [x] Quote acceptance verifies listing ownership and open requirement state.
- [x] Decision API rejects missing crop and non-positive/non-finite quantity.
- [x] `.env.example` contains placeholders only.
- [x] No Flutter GitHub Actions workflow was found by repository code search.

## External database advisory findings

The connected Supabase project reports security advisories for mutable function search paths and publicly executable `SECURITY DEFINER` functions, plus leaked-password protection being disabled. These findings were not changed in this pass because the connected Supabase project contains unrelated robot/smart-garden tables as well as FarmPlug tables. Changing those shared database functions without isolating their ownership could break another project.

Before production use, isolate FarmPlug into its own Supabase project or explicitly review and remediate the shared database functions and grants.

## Remaining checks

- Run authenticated API tests with real test users.
- Verify all FarmPlug RLS policies against the intended role model.
- Verify storage policies if FarmPlug image uploads are enabled.
- Enable leaked-password protection before production authentication.
