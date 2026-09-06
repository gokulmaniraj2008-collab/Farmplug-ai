-- File: migrations/xxxx_admin_payments_read.sql
--
-- Gap found while building the admin payments monitoring page
-- (/admin/payments, master prompt section 24): the previous migration
-- (migration_logistics_payments_disputes_functions.sql) added
-- INSERT/UPDATE functions for payments and escrow_transactions, and
-- added admin/FPO read policies for logistics_routes and disputes —
-- but did NOT add an admin read policy for payments or
-- escrow_transactions themselves. Existing SELECT policies on those
-- two tables are order-participant only (buyer/farmer), so an admin
-- account cannot see payments/escrow rows it isn't a party to.
--
-- This has NOT been verified against the live "Gkfxl" project (no
-- Supabase MCP access in this session) — confirm the existing
-- policies actually look like this (participant-only SELECT) before
-- applying, and check for a naming collision with the policy names
-- below.

drop policy if exists "payments_admin_read" on public.payments;
create policy "payments_admin_read" on public.payments
  for select using (public.is_admin());

drop policy if exists "escrow_admin_read" on public.escrow_transactions;
create policy "escrow_admin_read" on public.escrow_transactions
  for select using (public.is_admin());
