# FarmPlug AI Security Checklist

## Verified in the September 6, 2026 audit

- [x] Server-only Supabase secret is read from server environment variables.
- [x] Farmer listing API validates the Supabase bearer token before database access.
- [x] Order API validates the bearer token and checks buyer/farmer ownership.
- [x] Order status transitions are allow-listed and role-restricted.
- [x] Quote acceptance verifies listing ownership and open requirement state.
- [x] Decision API rejects missing crop and non-positive/non-finite quantity.
- [x] `.env.example` uses placeholders only; no real Supabase project URL remains.
- [x] FarmPlug buyer requirements, orders, quote requests, supply listings, market demand and notifications have RLS enabled in the connected Supabase project.
- [x] FarmPlug order and notification owner policies use authenticated user ownership predicates.
- [x] No Flutter GitHub Actions workflow was found by repository code search.

## Database findings

The connected Supabase project is shared with other robot/smart-garden tables. FarmPlug RLS is enabled on the audited FarmPlug tables, but the project still reports broader database advisories for mutable function search paths and publicly executable `SECURITY DEFINER` functions, plus leaked-password protection being disabled. Those shared-project findings were not changed automatically because unrelated tables/functions may depend on them.

## Remaining production checks

- [ ] Run authenticated API tests with real test users for farmer, buyer and admin flows.
- [ ] Complete a full FarmPlug RLS policy review including every exposed table, view, function and storage bucket used by production flows.
- [ ] Verify Storage policies before enabling production crop-image persistence.
- [ ] Enable leaked-password protection before production authentication.
- [ ] Isolate FarmPlug into its own Supabase project or explicitly review/remediate shared database functions and grants.
