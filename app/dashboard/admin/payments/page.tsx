// File location: app/dashboard/admin/payments/page.tsx
// Route (per master prompt section 24): /admin/payments
//
// Read-only monitoring view across all payments + escrow_transactions.
// REQUIRES migration_admin_payments_read.sql (new — not part of the
// prior batch) since the existing SELECT policies on `payments` and
// `escrow_transactions` are order-participant only. Refunds go
// through simulate_refund_payment() via the button below, which is
// already admin-gated server-side.
//
// Every figure on this page is a simulation per master prompt rule
// #12 — no real payment gateway is connected anywhere in this app.

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

type PaymentStatus = "pending" | "authorized" | "paid" | "released" | "refunded" | "failed";

interface PaymentRow {
  order_id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  is_simulation: boolean;
  created_at: string;
}

const STATUS_STYLE: Record<PaymentStatus, string> = {
  pending: "bg-gray-100 text-gray-700",
  authorized: "bg-blue-100 text-blue-800",
  paid: "bg-blue-100 text-blue-800",
  released: "bg-green-100 text-green-800",
  refunded: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-800",
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("payments")
      .select("order_id, status, amount, currency, is_simulation, created_at")
      .order("created_at", { ascending: false });

    if (fetchError) setError(fetchError.message);
    else setPayments((data as PaymentRow[]) ?? []);
    setLoading(false);
  }

  async function refund(orderId: string) {
    setBusyOrderId(orderId);
    setError(null);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("simulate_refund_payment", {
      p_order_id: orderId,
    });
    if (rpcError) setError(rpcError.message);
    else await load();
    setBusyOrderId(null);
  }

  if (loading) return <div className="p-6 text-gray-500">Loading payments overview...</div>;

  const totalsByStatus = payments.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-xl font-semibold text-gray-900">Payments — Admin Monitoring</h1>
      <p className="mt-1 text-sm text-amber-600">
        All amounts are simulated. No real payment gateway is connected — nothing here
        moves real money.
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
        {Object.entries(totalsByStatus).map(([status, count]) => (
          <span key={status} className="rounded-full bg-gray-100 px-3 py-1">
            {status}: {count}
          </span>
        ))}
      </div>

      <ul className="mt-6 space-y-3">
        {payments.length === 0 && (
          <p className="text-sm text-gray-500">No payment records yet.</p>
        )}
        {payments.map((p) => (
          <li key={p.order_id} className="rounded-md border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-900">
                Order #{p.order_id.slice(0, 8)} — {p.currency} {p.amount.toFixed(2)}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[p.status]}`}
              >
                {p.status} (simulated)
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Recorded {new Date(p.created_at).toLocaleString()}
            </p>

            {(p.status === "authorized" || p.status === "paid" || p.status === "released") && (
              <button
                type="button"
                onClick={() => refund(p.order_id)}
                disabled={busyOrderId === p.order_id}
                className="mt-3 rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 disabled:opacity-50"
              >
                {busyOrderId === p.order_id ? "Processing..." : "Issue simulated refund"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
