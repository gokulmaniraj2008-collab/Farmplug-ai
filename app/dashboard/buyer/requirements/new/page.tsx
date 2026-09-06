// File location: app/dashboard/buyer/requirements/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

const QUALITY_GRADES = ["Grade A", "Grade B", "Grade C", "Any"];

export default function CreateRequirementPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    crop_name: "",
    quantity_kg: "",
    quality_grade: QUALITY_GRADES[0],
    delivery_location: "",
    delivery_date: "",
    packaging: "",
    target_price_per_kg: "",
    storage_requirements: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!form.crop_name || !form.quantity_kg) {
      setError("Crop and quantity are required.");
      return;
    }
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error: insertError } = await supabase.from("buyer_requirements").insert({
      buyer_id: user.id,
      crop_name: form.crop_name,
      quantity_kg: Number(form.quantity_kg),
      quality_grade: form.quality_grade,
      delivery_location: form.delivery_location || null,
      delivery_date: form.delivery_date || null,
      packaging: form.packaging || null,
      target_price_per_kg: form.target_price_per_kg ? Number(form.target_price_per_kg) : null,
      storage_requirements: form.storage_requirements || null,
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
        <input
          placeholder="Crop (e.g. Tomato)"
          value={form.crop_name}
          onChange={(e) => setForm({ ...form, crop_name: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Quantity (kg)"
          type="number"
          value={form.quantity_kg}
          onChange={(e) => setForm({ ...form, quantity_kg: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={form.quality_grade}
          onChange={(e) => setForm({ ...form, quality_grade: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {QUALITY_GRADES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <input
          placeholder="Delivery location"
          value={form.delivery_location}
          onChange={(e) => setForm({ ...form, delivery_location: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <label className="block text-xs text-[#5F6B63]">Delivery date</label>
        <input
          type="date"
          value={form.delivery_date}
          onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Packaging requirement (optional)"
          value={form.packaging}
          onChange={(e) => setForm({ ...form, packaging: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Target price per kg (₹, optional)"
          type="number"
          value={form.target_price_per_kg}
          onChange={(e) => setForm({ ...form, target_price_per_kg: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Storage requirements (optional)"
          value={form.storage_requirements}
          onChange={(e) => setForm({ ...form, storage_requirements: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-[#B42318]" role="alert">
          {error}
        </p>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={() => router.back()} className="rounded-md px-4 py-2 text-sm text-[#5F6B63]">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-md bg-[#1B4332] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Create requirement"}
        </button>
      </div>
    </div>
  );
}
