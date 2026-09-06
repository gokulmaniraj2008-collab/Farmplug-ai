// File location: app/dashboard/buyer/requirements/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const QUALITY_GRADES = ["Grade A", "Grade B", "Grade C", "Any"];

export default function CreateRequirementPage() {
  const router = useRouter();
  const [form, setForm] = useState({ crop: "", quantity_kg: "", quality: QUALITY_GRADES[0], location: "", delivery_days: "7" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!form.crop || !form.quantity_kg || !form.location) {
      setError("Crop, quantity and location are required.");
      return;
    }
    const deliveryDays = Number(form.delivery_days);
    const quantity = Number(form.quantity_kg);
    if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isInteger(deliveryDays) || deliveryDays < 1) {
      setError("Enter a valid quantity and delivery window.");
      return;
    }

    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Please sign in again.");
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase.from("farmplug_buyer_requirements").insert({
      buyer_name: user.email ?? "Buyer",
      crop: form.crop,
      quantity_kg: quantity,
      quality: form.quality,
      location: form.location,
      delivery_days: deliveryDays,
      status: "open",
      created_by: user.id,
      is_verified: false,
    });

    if (insertError) {
      setError("Couldn't save the requirement. Try again.");
      setSaving(false);
      return;
    }

    router.push("/dashboard/buyer/requirements");
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold text-[#17211B]">Create Requirement</h1>
      <div className="mt-4 space-y-3">
        <input placeholder="Crop (e.g. Tomato)" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        <input placeholder="Quantity (kg)" type="number" min="1" value={form.quantity_kg} onChange={(e) => setForm({ ...form, quantity_kg: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        <select value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          {QUALITY_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <input placeholder="Delivery location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        <label className="block text-xs text-[#5F6B63]">Delivery window (days)</label>
        <input type="number" min="1" value={form.delivery_days} onChange={(e) => setForm({ ...form, delivery_days: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </div>
      {error && <p className="mt-3 text-sm text-[#B42318]" role="alert">{error}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={() => router.back()} className="rounded-md px-4 py-2 text-sm text-[#5F6B63]">Cancel</button>
        <button onClick={handleSubmit} disabled={saving} className="rounded-md bg-[#1B4332] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {saving ? "Saving..." : "Create requirement"}
        </button>
      </div>
    </div>
  );
}
