# FarmPlug AI — Consolidated Build (single source of truth)

This replaces juggling six separate zips. Every superseded/duplicate
file has been dropped; what's left is one clean tree, laid out at the
exact paths to drop into your repo. Nothing here has been run against
your real project — no repo/live-DB access existed in this chat
session — so this is still "verify before merge," not "verified,"
per master prompt §22/§50.

## How confident to be, by file

**Schema-verified (built or fixed against the live "Gkfxl" project via
Supabase MCP in an earlier session) — safe to trust the table/column
names:**
- `app/dashboard/orders/[id]/page.tsx`, `components/orders/OrderStatusBadge.tsx`,
  `components/orders/PaymentPanel.tsx`, `components/orders/DisputeButton.tsx`,
  `components/logistics/LogisticsTracker.tsx`, `components/logistics/CreateLogisticsRouteForm.tsx`,
  `app/dashboard/admin/disputes/page.tsx`, `app/dashboard/admin/logistics/page.tsx`,
  `app/dashboard/admin/payments/page.tsx`, `app/dashboard/fpo/logistics/page.tsx`,
  `app/dashboard/buyer/orders/page.tsx`, `app/dashboard/buyer/logistics/page.tsx`
- Confirmed tables in play: `farmplug_orders`, `logistics_routes`, `payments`,
  `escrow_transactions`, `disputes`, `notifications`

**Built blind, not yet reconciled — treat column/table names as
best-guesses to check against your real schema:**
- Everything under `app/onboarding/`, `app/auth/callback/`,
  `app/dashboard/admin/page.tsx` / `users/` / `audit-log/`,
  `app/dashboard/fpo/aggregate/`, `app/dashboard/farmer/offers/`,
  all of `components/marketplace/`, `components/ai/`, `components/demo/`
- Notable exception: `components/notifications/NotificationBell.tsx` was
  built blind but its `notifications` table shape was independently
  confirmed correct in a later session — trust this one.

**New this session, unconfirmed against your schema (same "verify"
status as the batch above):**
- `app/dashboard/farmer/farm/`, `crops/`, `listings/new/`,
  `intelligence/`, `decision-center/` (needs `farms`, `crops` tables —
  migration included)
- `app/dashboard/buyer/requirements/`, `matches/` (needs
  `buyer_requirements` table — migration included; `matches/` also
  reads `produce_listings`, which is itself unconfirmed)

## Migrations — run in this numeric order, nothing else

| # | File | What it does | Confidence |
|---|---|---|---|
| 1 | `01_google_auth_fields.sql` | Adds Google-auth columns to existing `profiles` | Unverified — review columns first |
| 2 | `02_logistics_payments_disputes_functions.sql` | Adds the route/payment/dispute action functions + 3 read policies | Schema-verified |
| 3 | `03_admin_payments_read.sql` | Admin read policy for payments | Unverified — check for policy-name collisions |
| 4 | `04_farms_crops.sql` | New `farms`/`crops` tables + RLS | New — confirm these tables don't already exist first |
| 5 | `05_buyer_requirements.sql` | New `buyer_requirements` table + RLS | New — same caveat |

## Migrations deliberately EXCLUDED from this zip — do not run them

An earlier batch's own audit (via Supabase MCP `list_tables`) found your
live database **already has** full schema for orders, offers, aggregation,
market data, AI predictions, logistics, payments, disputes, notifications,
and audit logging. That means most of the original blind `google-auth`
migrations aren't just wrong-named — they're likely **redundant with
what already exists live**, and running them risks creating conflicting
duplicate tables. Excluded: `migration_offers_orders.sql`,
`migration_accept_offer_function.sql`, `migration_advance_order_status.sql`
(wrong table names — `orders`/`offers` instead of `farmplug_orders`/
`farmplug_quote_requests`), `migration_notifications.sql` (the real
`notifications` table already exists), `migration_admin_read_access.sql`
and `migration_fpo_aggregation.sql` (admin authorization and aggregation
both already exist live, per the same audit). If you find you do need
any piece of these, diff against the live schema first rather than
running them as-is.

## Two components that were previously broken, now fixed

- `components/orders/OrderStatusBadge.tsx` — used a guessed status enum
  that didn't match the real one; the order page was hiding this with an
  `as any` cast. Now uses the confirmed real statuses
  (`quote_pending → negotiating → quote_accepted → order_confirmed →
  collecting → in_transit → delivered → completed`, terminal `cancelled`/
  `disputed`).
- `app/dashboard/orders/[id]/page.tsx` — now actually mounts
  `LogisticsTracker`, `PaymentPanel`, and `DisputeButton` (they existed
  as components but an earlier version of this page never rendered them).

## middleware.ts — do not overwrite blindly

If your repo already has a `middleware.ts`, merge this one in — don't
replace it. It was written without seeing your existing file.

## What's still missing (per the full comparison against the master prompt)

- All public marketing pages (landing, platform overview, public marketplace, about)
- Demo Mode flow beyond the banner component (role-select, seeded data, reset/exit)
- Buyer settings, aggregated-lots visibility, "reserve supply" action
- FPO farmers list, collection centers
- 11 of 17 admin routes (farmers/fpos/buyers/listings/requirements/matches/ai/reports/settings)
- Real Android app (only `reference/android-webview/` scaffold exists)
- Full design-system, accessibility, performance, and security passes (§38, §39, §45, §47, §48)
- Any actual build/typecheck/test run — no live project was available in this session

## Setup still required outside code

See `docs/SETUP.md` for Google Cloud + Supabase OAuth provider configuration —
Google Login will not function until that's done manually.
