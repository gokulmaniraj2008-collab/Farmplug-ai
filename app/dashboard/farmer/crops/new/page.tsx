// File location: app/dashboard/farmer/crops/new/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AddCropPage() {
  const router = useRouter();
  const [form, setForm] = useState({ crop_name: "", variety: "", expected_harvest_date: "", crop_calendar_notes: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleSubmit() {
    if (!form.crop_name) { setError("Crop name is required."); return; }
    setSaving(true); setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: farm, error: farmError } = await supabase.from("farms").select("id").eq("farmer_id", user.id).maybeSingle();
    if (farmError || !farm) { setError("Set up your farm profile first, then add crops."); setSaving(false); return; }
    const { error: insertError } = await supabase.from("crops").insert({ farm_id: farm.id, farmer_id: user.id, crop_name: form.crop_name, variety: form.variety || null, expected_harvest_date: form.expected_harvest_date || null, crop_calendar_notes: form.crop_calendar_notes || null });
    if (insertError) { setError("Couldn't save the crop. Try again."); setSaving(false); return; }
    router.push("/dashboard/farmer/farm");
  }
  return <div className="mx-auto max-w-md p-6"><h1 className="text-xl font-semibold text-[#17211B]">Add Crop</h1><div className="mt-4 space-y-3"><input placeholder="Crop (e.g. Tomato)" value={form.crop_name} onChange={(e) => setForm({ ...form, crop_name: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" /><input placeholder="Variety (optional)" value={form.variety} onChange={(e) => setForm({ ...form, variety: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" /><label className="block text-xs text-[#5F6B63]">Expected harvest date</label><input type="date" value={form.expected_harvest_date} onChange={(e) => setForm({ ...form, expected_harvest_date: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" /><textarea placeholder="Crop calendar notes (optional)" value={form.crop_calendar_notes} onChange={(e) => setForm({ ...form, crop_calendar_notes: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" rows={3} /></div>{error && <p className="mt-3 text-sm text-[#B42318]" role="alert">{error}</p>}<div className="mt-4 flex justify-end gap-2"><button onClick={() => router.back()} className="rounded-md px-4 py-2 text-sm text-[#5F6B63]">Cancel</button><button onClick={handleSubmit} disabled={saving} className="rounded-md bg-[#1B4332] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving..." : "Save crop"}</button></div></div>;
}
