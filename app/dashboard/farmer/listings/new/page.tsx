"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  validateAvailableQuantity,
  validateFarmerListingForm,
  type FarmerListingFormErrors,
} from "@/lib/farmer-listing-validation";

type Crop = { id: string; crop_name: string; available_quantity_kg: number | null; quality_grade: string | null };

export default function AddProducePage() {
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [form, setForm] = useState({ crop_id: "", quantity_kg: "", quality: "Grade A", location: "", available_until: "" });
  const [errors, setErrors] = useState<FarmerListingFormErrors>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const s = createClient();
      const { data: { user } } = await s.auth.getUser();
      if (!user) return;
      const { data: f } = await s.from("farms").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
      if (!f) return;
      const { data } = await s.from("crops").select("id,crop_name,available_quantity_kg,quality_grade").eq("farm_id", f.id);
      setCrops(data ?? []);
    })();
  }, []);

  function updateField(field: keyof typeof form, value: string) {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  }

  async function submit() {
    setError("");
    const validationErrors = validateFarmerListingForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const c = crops.find((x) => x.id === form.crop_id);
    const q = Number(form.quantity_kg);
    if (!c) { setErrors({ crop_id: "Please select a valid produce item." }); return; }

    const quantityError = validateAvailableQuantity(q, c);
    if (quantityError) {
      setErrors({ quantity_kg: quantityError });
      return;
    }

    setSaving(true);
    const s = createClient();
    const { data: { user } } = await s.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }
    const { error: e } = await s.from("farmplug_supply_listings").insert({
      farmer_name: user.user_metadata?.full_name ?? user.email ?? "Farmer",
      crop: c.crop_name, quantity_kg: q, quality: form.quality,
      location: form.location.trim(), available_until: form.available_until || null,
      status: "available", created_by: user.id,
    });
    if (e) { setError(e.message); setSaving(false); return; }
    router.push("/dashboard/farmer/listings");
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold">Add Produce Listing</h1>
      <div className="mt-4 space-y-3">
        <div><select value={form.crop_id} onChange={(e) => updateField("crop_id", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" aria-invalid={Boolean(errors.crop_id)}><option value="">Select crop</option>{crops.map((c) => <option key={c.id} value={c.id}>{c.crop_name}</option>)}</select>{errors.crop_id && <p className="mt-1 text-sm text-red-600">{errors.crop_id}</p>}</div>
        <div><input type="number" min="0.01" step="any" placeholder="Quantity (kg)" value={form.quantity_kg} onChange={(e) => updateField("quantity_kg", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" aria-invalid={Boolean(errors.quantity_kg)} />{errors.quantity_kg && <p className="mt-1 text-sm text-red-600">{errors.quantity_kg}</p>}</div>
        <select value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm"><option>Grade A</option><option>Grade B</option><option>Grade C</option></select>
        <div><input placeholder="Location" value={form.location} onChange={(e) => updateField("location", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" aria-invalid={Boolean(errors.location)} />{errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}</div>
        <div><input type="date" value={form.available_until} onChange={(e) => updateField("available_until", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" aria-invalid={Boolean(errors.available_until)} />{errors.available_until && <p className="mt-1 text-sm text-red-600">{errors.available_until}</p>}</div>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button disabled={saving} onClick={submit} className="mt-4 w-full rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Publishing…" : "Publish listing"}</button>
    </main>
  );
}
