// File location: app/dashboard/farmer/farm/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

interface Farm {
  id: string;
  farm_name: string | null;
  location_text: string | null;
  farm_area_acres: number | null;
  storage_available: boolean;
  storage_notes: string | null;
}

interface Crop {
  id: string;
  crop_name: string;
  variety: string | null;
  expected_harvest_date: string | null;
  health_status: string;
}

export default function MyFarmPage() {
  const [farm, setFarm] = useState<Farm | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    farm_name: "",
    location_text: "",
    farm_area_acres: "",
    storage_available: false,
    storage_notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Not signed in.");
      setLoading(false);
      return;
    }

    const { data: farmData, error: farmError } = await supabase
      .from("farms")
      .select("id, farm_name, location_text, farm_area_acres, storage_available, storage_notes")
      .eq("farmer_id", user.id)
      .maybeSingle();

    if (farmError) {
      setError("Couldn't load your farm profile.");
      setLoading(false);
      return;
    }

    setFarm(farmData ?? null);
    if (farmData) {
      setForm({
        farm_name: farmData.farm_name ?? "",
        location_text: farmData.location_text ?? "",
        farm_area_acres: farmData.farm_area_acres?.toString() ?? "",
        storage_available: farmData.storage_available,
        storage_notes: farmData.storage_notes ?? "",
      });

      const { data: cropData } = await supabase
        .from("crops")
        .select("id, crop_name, variety, expected_harvest_date, health_status")
        .eq("farm_id", farmData.id)
        .order("created_at", { ascending: false });
      setCrops(cropData ?? []);
    } else {
      setEditing(true); // no farm yet — go straight to the create form
    }

    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      farmer_id: user.id,
      farm_name: form.farm_name || null,
      location_text: form.location_text || null,
      farm_area_acres: form.farm_area_acres ? Number(form.farm_area_acres) : null,
      storage_available: form.storage_available,
      storage_notes: form.storage_notes || null,
    };

    const { error: upsertError } = await supabase
      .from("farms")
      .upsert(payload, { onConflict: "farmer_id" });

    if (upsertError) {
      setError("Couldn't save your farm profile.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setEditing(false);
    load();
  }

  const profileComplete =
    !!farm?.farm_name && !!farm?.location_text && !!farm?.farm_area_acres && crops.length > 0;

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading your farm...</div>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#17211B]">My Farm</h1>
        {farm && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-medium text-[#1B4332] hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {!profileComplete && (
        <div className="mt-3 rounded-md border border-[#C9A227]/40 bg-[#C9A227]/10 px-3 py-2 text-xs text-[#5F6B63]">
          Profile completeness: {farm ? (crops.length > 0 ? "Almost there" : "Add a crop to finish") : "Not started"}
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-[#B42318]" role="alert">
          {error}
        </p>
      )}

      {editing ? (
        <div className="mt-4 space-y-3 rounded-md border border-gray-200 p-4">
          <input
            placeholder="Farm name"
            value={form.farm_name}
            onChange={(e) => setForm({ ...form, farm_name: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            placeholder="Location (village/district/state)"
            value={form.location_text}
            onChange={(e) => setForm({ ...form, location_text: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            placeholder="Farm area (acres)"
            type="number"
            value={form.farm_area_acres}
            onChange={(e) => setForm({ ...form, farm_area_acres: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-[#5F6B63]">
            <input
              type="checkbox"
              checked={form.storage_available}
              onChange={(e) => setForm({ ...form, storage_available: e.target.checked })}
            />
            Storage available on-site
          </label>
          {form.storage_available && (
            <input
              placeholder="Storage notes (capacity, type)"
              value={form.storage_notes}
              onChange={(e) => setForm({ ...form, storage_notes: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          )}
          <div className="flex justify-end gap-2">
            {farm && (
              <button
                onClick={() => setEditing(false)}
                className="rounded-md px-4 py-2 text-sm text-[#5F6B63]"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !form.farm_name}
              className="rounded-md bg-[#1B4332] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save farm profile"}
            </button>
          </div>
        </div>
      ) : (
        farm && (
          <div className="mt-4 rounded-md border border-gray-200 p-4">
            <p className="text-sm text-[#17211B]">{farm.farm_name}</p>
            <p className="mt-1 text-xs text-[#5F6B63]">{farm.location_text}</p>
            <p className="mt-1 text-xs text-[#5F6B63]">
              {farm.farm_area_acres ? `${farm.farm_area_acres} acres` : "Area not set"} ·{" "}
              {farm.storage_available ? "Storage available" : "No on-site storage"}
            </p>
          </div>
        )
      )}

      {farm && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#17211B]">Crops</h2>
            <Link
              href="/dashboard/farmer/crops/new"
              className="text-sm font-medium text-[#1B4332] hover:underline"
            >
              + Add Crop
            </Link>
          </div>

          {crops.length === 0 ? (
            <div className="mt-3 rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-[#5F6B63]">
              No crops added yet. Add your first crop to start tracking harvest and health.
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {crops.map((crop) => (
                <Link
                  key={crop.id}
                  href={`/dashboard/farmer/crops/${crop.id}`}
                  className="flex items-center justify-between rounded-md border border-gray-200 p-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-[#17211B]">
                      {crop.crop_name}
                      {crop.variety ? ` · ${crop.variety}` : ""}
                    </p>
                    <p className="text-xs text-[#5F6B63]">
                      {crop.expected_harvest_date
                        ? `Expected harvest: ${crop.expected_harvest_date}`
                        : "Harvest date not set"}
                    </p>
                  </div>
                  <HealthBadge status={crop.health_status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HealthBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    healthy: "bg-[#2E7D32]/10 text-[#2E7D32]",
    attention: "bg-[#B7791F]/10 text-[#B7791F]",
    at_risk: "bg-[#B42318]/10 text-[#B42318]",
    unknown: "bg-gray-100 text-[#5F6B63]",
  };
  const labels: Record<string, string> = {
    healthy: "Healthy",
    attention: "Needs attention",
    at_risk: "At risk",
    unknown: "Not assessed",
  };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status] ?? styles.unknown}`}>
      {labels[status] ?? "Not assessed"}
    </span>
  );
}
