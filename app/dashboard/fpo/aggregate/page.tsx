// File location: app/dashboard/fpo/aggregate/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

interface MemberListing {
  listing_id: string;
  farmer_id: string;
  farmer_name: string;
  crop_name: string;
  quantity_kg: number;
}

export default function FpoAggregatePage() {
  const [available, setAvailable] = useState<MemberListing[]>([]);
  const [selected, setSelected] = useState<Record<string, number>>({}); // listing_id -> qty
  const [cropName, setCropName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAvailableListings();
  }, []);

  async function loadAvailableListings() {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Join: listings belonging to farmers who are members of this FPO.
    // Adjust to match your actual produce_listings/profiles column names.
    const { data, error: fetchError } = await supabase
      .from("fpo_members")
      .select(
        `farmer_id, profiles!fpo_members_farmer_id_fkey(full_name),
         produce_listings:produce_listings!produce_listings_farmer_id_fkey(id, crop_name, quantity_kg)`
      )
      .eq("fpo_id", user.id);

    if (fetchError) {
      setError("Couldn't load member listings.");
      setLoading(false);
      return;
    }

    const flattened: MemberListing[] = (data ?? []).flatMap((member: any) =>
      (member.produce_listings ?? []).map((listing: any) => ({
        listing_id: listing.id,
        farmer_id: member.farmer_id,
        farmer_name: member.profiles?.full_name ?? "Unknown farmer",
        crop_name: listing.crop_name,
        quantity_kg: listing.quantity_kg,
      }))
    );

    setAvailable(flattened);
    setLoading(false);
  }

  function toggleSelect(listing: MemberListing) {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[listing.listing_id] !== undefined) {
        delete next[listing.listing_id];
      } else {
        next[listing.listing_id] = listing.quantity_kg;
      }
      return next;
    });
  }

  async function handleCreateLot() {
    const listingIds = Object.keys(selected);
    if (listingIds.length === 0 || !cropName) {
      setError("Pick at least one listing and confirm the crop name.");
      return;
    }

    setCreating(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: lot, error: lotError } = await supabase
      .from("aggregated_lots")
      .insert({ fpo_id: user.id, crop_name: cropName, status: "collecting" })
      .select("id")
      .single();

    if (lotError || !lot) {
      setError("Couldn't create the lot.");
      setCreating(false);
      return;
    }

    const items = listingIds.map((listingId) => {
      const listing = available.find((l) => l.listing_id === listingId)!;
      return {
        lot_id: lot.id,
        listing_id: listingId,
        farmer_id: listing.farmer_id,
        quantity_kg: selected[listingId],
      };
    });

    const { error: itemsError } = await supabase
      .from("aggregated_lot_items")
      .insert(items);

    if (itemsError) {
      setError("Lot created, but couldn't attach all listings. Check manually.");
    } else {
      setSelected({});
      setCropName("");
    }
    setCreating(false);
  }

  const selectedTotal = Object.values(selected).reduce((a, b) => a + b, 0);

  if (loading) return <div className="p-6 text-gray-500">Loading member supply...</div>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold text-gray-900">Aggregate supply</h1>
      <p className="mt-1 text-sm text-gray-500">
        Select listings from your member farmers to pool into one lot.
      </p>

      <input
        placeholder="Crop name for this lot (e.g. Tomato)"
        value={cropName}
        onChange={(e) => setCropName(e.target.value)}
        className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2"
      />

      <div className="mt-4 space-y-2">
        {available.length === 0 && (
          <p className="text-sm text-gray-400">No member listings available.</p>
        )}
        {available.map((listing) => (
          <label
            key={listing.listing_id}
            className="flex items-center gap-3 rounded-md border border-gray-200 p-3"
          >
            <input
              type="checkbox"
              checked={selected[listing.listing_id] !== undefined}
              onChange={() => toggleSelect(listing)}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {listing.crop_name} · {listing.quantity_kg} kg
              </div>
              <div className="text-xs text-gray-500">{listing.farmer_name}</div>
            </div>
          </label>
        ))}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Selected total: {selectedTotal} kg
        </span>
        <button
          type="button"
          onClick={handleCreateLot}
          disabled={creating}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create pooled lot"}
        </button>
      </div>
    </div>
  );
}
