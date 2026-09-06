// File location: components/logistics/LogisticsTracker.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type RouteStatus = "planned" | "active" | "completed" | "cancelled";
interface RoutePoint { label: string; stage?: string; }
interface LogisticsRoute {
  id: string;
  order_id: string;
  collection_hub: string | null;
  buyer_location: string;
  pickup_sequence: RoutePoint[];
  distance_km: number | null;
  estimated_minutes: number | null;
  estimated_cost: number | null;
  status: RouteStatus;
  routing_provider: string | null;
  is_prototype: boolean;
}
const STATUS_LABEL: Record<RouteStatus, string> = {
  planned: "Planned", active: "Active", completed: "Completed", cancelled: "Cancelled",
};

export default function LogisticsTracker({ orderId, canManage = false }: { orderId: string; canManage?: boolean }) {
  const [route, setRoute] = useState<LogisticsRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { void load(); }, [orderId]);

  async function load() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("logistics_routes")
      .select("id, order_id, collection_hub, buyer_location, pickup_sequence, distance_km, estimated_minutes, estimated_cost, status, routing_provider, is_prototype")
      .eq("order_id", orderId)
      .maybeSingle();
    if (fetchError) setError(fetchError.message);
    else setRoute((data as LogisticsRoute) ?? null);
    setLoading(false);
  }

  async function advance(next: RouteStatus) {
    if (!route) return;
    setBusy(true); setError(null);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("advance_logistics_route", {
      p_route_id: route.id, p_new_status: next,
    });
    if (rpcError) setError(rpcError.message);
    else await load();
    setBusy(false);
  }

  if (loading) return <div className="text-sm text-gray-500">Loading logistics...</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!route) return <div className="rounded-md border border-dashed border-gray-300 p-3 text-sm text-gray-500">No logistics route has been created for this order yet.</div>;

  const next: RouteStatus | undefined = route.status === "planned" ? "active" : route.status === "active" ? "completed" : undefined;

  return (
    <div className="rounded-md border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">Logistics</span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">{route.is_prototype ? "SIMULATED ROUTE" : STATUS_LABEL[route.status]}</span>
      </div>
      <ol className="mt-3 space-y-2">
        {(Array.isArray(route.pickup_sequence) ? route.pickup_sequence : []).map((point, i) => (
          <li key={`${point.label}-${i}`} className="flex items-center gap-2 text-sm text-gray-700"><span className="h-2 w-2 rounded-full bg-green-600" />{point.label}</li>
        ))}
      </ol>
      <div className="mt-3 space-y-1 text-xs text-gray-500">
        {route.distance_km != null && <p>Estimated distance: {route.distance_km} km (estimated)</p>}
        {route.estimated_minutes != null && <p>Estimated duration: {route.estimated_minutes} min (estimated)</p>}
        {route.estimated_cost != null && <p>Estimated cost: ₹{route.estimated_cost} (estimated)</p>}
        <p className="italic">No live GPS or routing provider connected. This is a static, simulated waypoint sequence for demo purposes only.</p>
      </div>
      {canManage && next && <button type="button" onClick={() => void advance(next)} disabled={busy} className="mt-4 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{busy ? "Updating..." : `Mark route as ${STATUS_LABEL[next]}`}</button>}
    </div>
  );
}
