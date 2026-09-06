// File location: app/dashboard/admin/logistics/page.tsx
// Route (per master prompt section 24): /admin/logistics
//
// Read-only monitoring view across all logistics_routes. Relies on
// the "logistics_fpo_admin_read" policy added in
// migration_logistics_payments_disputes_functions.sql (previously
// admin/FPO had no read access beyond order participants). No writes
// happen here — status changes still go through advance_logistics_route()
// via LogisticsTracker on the order/FPO pages, not this view.

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

type RouteStatus = "planned" | "active" | "completed" | "cancelled";

interface RouteRow {
  id: string;
  order_id: string;
  collection_hub: string | null;
  buyer_location: string;
  status: RouteStatus;
  routing_provider: string | null;
  is_prototype: boolean;
  created_at: string;
}

const STATUS_STYLE: Record<RouteStatus, string> = {
  planned: "bg-gray-100 text-gray-700",
  active: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminLogisticsPage() {
  const [routes, setRoutes] = useState<RouteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RouteStatus | "all">("all");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("logistics_routes")
      .select(
        "id, order_id, collection_hub, buyer_location, status, routing_provider, is_prototype, created_at"
      )
      .order("created_at", { ascending: false });

    if (fetchError) setError(fetchError.message);
    else setRoutes((data as RouteRow[]) ?? []);
    setLoading(false);
  }

  if (loading) return <div className="p-6 text-gray-500">Loading logistics overview...</div>;

  const filtered = filter === "all" ? routes : routes.filter((r) => r.status === filter);
  const counts = routes.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-xl font-semibold text-gray-900">Logistics — Admin Monitoring</h1>
      <p className="mt-1 text-sm text-amber-600">
        All routes shown are simulated (no live GPS/routing provider connected).
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {(["all", "planned", "active", "completed", "cancelled"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === s ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {s === "all" ? `All (${routes.length})` : `${s} (${counts[s] ?? 0})`}
          </button>
        ))}
      </div>

      <ul className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-gray-500">No routes match this filter.</p>
        )}
        {filtered.map((r) => (
          <li key={r.id} className="rounded-md border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-900">
                Order #{r.order_id.slice(0, 8)} — {r.collection_hub ?? "Unspecified hub"} → {" "}
                {r.buyer_location}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[r.status]}`}
              >
                {r.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Created {new Date(r.created_at).toLocaleString()} · routing provider: {" "}
              {r.routing_provider ?? "none"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
