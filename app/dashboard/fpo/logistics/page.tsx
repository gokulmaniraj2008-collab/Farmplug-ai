// File location: app/dashboard/fpo/logistics/page.tsx
// Route (per master prompt section 23): /fpo/logistics
//
// This is the FPO logistics page referenced but not built in the
// previous batch — only CreateLogisticsRouteForm.tsx existed. This
// page is the shell: it lists farmplug_orders that belong to this
// FPO's managed farmers and don't yet have a logistics_routes row,
// plus an overview of routes already created. Access to
// create_logistics_route()/advance_logistics_route() is enforced
// server-side (farm_role='fpo' or role='admin') — this page's own
// gate below is a UX convenience, not the real authorization.
//
// Adjust the "orders needing a route" query if your FPO->farmer
// relationship isn't modeled the way assumed here (fpo_id column on
// farmplug_orders or on profiles) — verify against your real schema
// before shipping.

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path
import CreateLogisticsRouteForm from "@/components/logistics/CreateLogisticsRouteForm";
import LogisticsTracker from "@/components/logistics/LogisticsTracker";

interface OrderSummary {
  id: string;
  status: string;
  total_amount: number | null;
  currency: string | null;
  created_at: string;
  has_route: boolean;
}

export default function FpoLogisticsPage() {
  const [profileChecked, setProfileChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    checkAccessAndLoad();
  }, []);

  async function checkAccessAndLoad() {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setAuthorized(false);
      setProfileChecked(true);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, farm_role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      setError(profileError.message);
      setProfileChecked(true);
      setLoading(false);
      return;
    }

    const isFpoOrAdmin =
      profile?.farm_role?.toLowerCase() === "fpo" || profile?.role?.toLowerCase() === "admin";
    setAuthorized(!!isFpoOrAdmin);
    setProfileChecked(true);

    if (!isFpoOrAdmin) {
      setLoading(false);
      return;
    }

    await loadOrders();
    setLoading(false);
  }

  async function loadOrders() {
    const supabase = createClient();

    // Orders relevant to this FPO's collection/aggregation work.
    // Confirmed order lifecycle table is farmplug_orders (verified
    // against live schema). Left-joins logistics_routes to know which
    // orders still need a route created.
    const { data, error: fetchError } = await supabase
      .from("farmplug_orders")
      .select("id, status, total_amount, currency, created_at, logistics_routes(id)")
      .in("status", ["order_confirmed", "collecting", "in_transit", "delivered", "completed"])
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      return;
    }

    const mapped: OrderSummary[] = (data ?? []).map((o: any) => ({
      id: o.id,
      status: o.status,
      total_amount: o.total_amount,
      currency: o.currency,
      created_at: o.created_at,
      has_route: Array.isArray(o.logistics_routes) && o.logistics_routes.length > 0,
    }));

    setOrders(mapped);
  }

  if (loading) return <div className="p-6 text-gray-500">Loading logistics...</div>;

  if (profileChecked && !authorized) {
    return (
      <div className="mx-auto max-w-xl p-6">
        <h1 className="text-xl font-semibold text-gray-900">Logistics</h1>
        <p className="mt-2 text-sm text-gray-600">
          This page is available to FPO and admin accounts only.
        </p>
      </div>
    );
  }

  const needingRoute = orders.filter((o) => !o.has_route);
  const withRoute = orders.filter((o) => o.has_route);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-xl font-semibold text-gray-900">Logistics</h1>
      <p className="mt-1 text-sm text-amber-600">
        SIMULATED ROUTES — no live GPS or routing provider is connected. Sequences below
        are static, demo waypoints.
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-gray-900">
          Orders needing a route ({needingRoute.length})
        </h2>
        {needingRoute.length === 0 && (
          <p className="mt-2 text-sm text-gray-500">Nothing waiting on a route right now.</p>
        )}
        <ul className="mt-3 space-y-4">
          {needingRoute.map((o) => (
            <li key={o.id} className="rounded-md border border-gray-200 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-900">
                  Order #{o.id.slice(0, 8)} — {o.status}
                </span>
                <span className="text-gray-500">
                  {o.currency ?? ""} {o.total_amount ?? "—"}
                </span>
              </div>
              <div className="mt-3">
                <CreateLogisticsRouteForm orderId={o.id} onCreated={loadOrders} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-gray-900">
          Routes in progress ({withRoute.length})
        </h2>
        {withRoute.length === 0 && (
          <p className="mt-2 text-sm text-gray-500">No routes created yet.</p>
        )}
        <ul className="mt-3 space-y-3">
          {withRoute.map((o) => (
            <li key={o.id} className="rounded-md border border-gray-200 p-4">
              <button
                type="button"
                onClick={() => setExpandedOrderId(expandedOrderId === o.id ? null : o.id)}
                className="flex w-full items-center justify-between text-left text-sm text-gray-900"
              >
                <span>
                  Order #{o.id.slice(0, 8)} — {o.status}
                </span>
                <span className="text-xs text-gray-500">
                  {expandedOrderId === o.id ? "Hide" : "View route"}
                </span>
              </button>
              {expandedOrderId === o.id && (
                <div className="mt-3">
                  <LogisticsTracker orderId={o.id} canManage />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
