// File location: app/dashboard/farmer/listings/new/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Crop { id: string; crop_name: string; }
const QUALITY_GRADES = ["Grade A", "Grade B", "Grade C"];

export default function AddProducePage() {
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [form, setForm] = useState({ crop_id: "", quantity_kg: "", quality_grade: QUALITY_GRADES[0], harvest_date: "", availability_date: "", location_text: "", storage_condition: "", expected_price_per_kg: "" });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadCrops(); }, []);
  async function loadCrops() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("crops").select("id, crop_name").eq("farmer_id", user.id);
    setCrops(data ?? []);
  }
  async function submit(publish: boolean) {
    if (!form.crop_id || !form.quantity_kg) { setError("Crop and quantity are required."); return; }
    setStatus("saving"); setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error: insertError } = await supabase.from("produce_listings").insert({ farmer_id: user.id, crop_id: form.crop_id, quantity_kg: Number(form.quantity_kg), quality_grade: form.quality_grade, harvest_date: form.harvest_date || null, availability_date: form.availability_date || null, location_text: form.location_text || null, storage_condition: form.storage_condition || null, expected_price_per_kg: form.expected_price_per_kg ? Number(form.expected_price_per_kg) : null, status: publish ? "published" : "draft" });
    if (insertError) { setStatus("error"); setError("Couldn't save the listing. Try again."); return; }
    setStatus("success"); setTimeout(() => router.push("/dashboard/farmer/listings"), 800);
  }
  return <div className="mx-auto max-w-md p-6"><h1 className="text-xl font-semibold text-[#17211B]">Add Produce</h1><p className="mt-1 text-xs text-[#5F6B63]">Listings appear in the marketplace once published.</p><div className="mt-4 space-y-3">
    <select value={form.crop_id} onChange={e => setForm({ ...form, crop_id: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"><option value="">Select crop</option>{crops.map(c => <option key={c.id} value={c.id}>{c.crop_name}</option>)}</select>
    {crops.length === 0 && <p className="text-xs text-[#B7791F]">No crops on file yet — add one from My Farm first.</p>}
    <input placeholder="Quantity (kg)" type="number" value={form.quantity_kg} onChange={e => setForm({ ...form, quantity_kg: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
    <select value={form.quality_grade} onChange={e => setForm({ ...form, quality_grade: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">{QUALITY_GRADES.map(g => <option key={g} value={g}>{g}</option>)}</select>
    <label className="block text-xs text-[#5F6B63]">Harvest date</label><input type="date" value={form.harvest_date} onChange={e => setForm({ ...form, harvest_date: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
    <label className="block text-xs text-[#5F6B63]">Availability date</label><input type="date" value={form.availability_date} onChange={e => setForm({ ...form, availability_date: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
    <input placeholder="Location" value={form.location_text} onChange={e => setForm({ ...form, location_text: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
    <input placeholder="Storage condition (e.g. cold storage, ambient)" value={form.storage_condition} onChange={e => setForm({ ...form, storage_condition: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
    <input placeholder="Expected price per kg (₹, optional)" type="number" value={form.expected_price_per_kg} onChange={e => setForm({ ...form, expected_price_per_kg: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
  </div>{error && <p className="mt-3 text-sm text-[#B42318]" role="alert">{error}</p>}{status === "success" && <p className="mt-3 text-sm text-[#2E7D32]" role="status">Listing saved.</p>}<div className="mt-4 flex justify-end gap-2"><button onClick={() => submit(false)} disabled={status === "saving"} className="rounded-md border border-gray-300 px-4 py-2 text-sm text-[#5F6B63] disabled:opacity-50">Save Draft</button><button onClick={() => submit(true)} disabled={status === "saving"} className="rounded-md bg-[#1B4332] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{status === "saving" ? "Publishing..." : "Publish Listing"}</button></div></div>;
}
