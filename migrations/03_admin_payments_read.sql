drop policy if exists "payments_admin_read" on public.payments;
create policy "payments_admin_read" on public.payments for select using (public.is_admin());

drop policy if exists "escrow_admin_read" on public.escrow_transactions;
create policy "escrow_admin_read" on public.escrow_transactions for select using (public.is_admin());
