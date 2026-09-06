// File location: components/logistics/CreateLogisticsRouteForm.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CreateLogisticsRouteForm({
  orderId,
  onCreated,
}: {
  orderId: string;
  onCreated?: () => void;
}) {
  const [collectionHub, setCollectionHub] = useState("");
  const [buyerLocation, setBuyerLocation] = useState("");
  const [capacityKg, setCapacityKg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("create_logistics_route", {
      p_order_id: orderId,
      p_collection_hub: collectionHub,
      p_buyer_location: buyerLocation,
      p_vehicle_capacity_kg: capacityKg ? Number(capacityKg) : null,
    });

    if (rpcError) {
      setError(rpcError.message);
    } else {
      setCollectionHub("");
      setBuyerLocation("");
      setCapacityKg("");
      onCreated?.();
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-gray-200 p-4">
      <p className="text-xs text-amber-600">
        This creates a simulated route (no live routing provider connected).
      </p>
      <div>
        <label className="block text-xs font-medium text-gray-700">Collection hub</label>
        <input required value={collectionHub} onChange={(e) => setCollectionHub(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" placeholder="e.g. FPO Collection Center, Coimbatore" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">Buyer delivery location</label>
        <input required value={buyerLocation} onChange={(e) => setBuyerLocation(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700">Vehicle capacity (kg, optional)</label>
        <input type="number" min="0" value={capacityKg} onChange={(e) => setCapacityKg(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={submitting} className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
        {submitting ? "Creating..." : "Create logistics route"}
      </button>
    </form>
  );
}
