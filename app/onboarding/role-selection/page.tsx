"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Role = "farmer" | "buyer" | "fpo";
const roles: { value: Role; label: string; description: string }[] = [
  { value: "farmer", label: "Farmer", description: "List produce and manage your farm." },
  { value: "buyer", label: "Buyer", description: "Source produce and manage requirements." },
  { value: "fpo", label: "FPO / Aggregator", description: "Aggregate farmer supply and logistics." },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Role | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit() {
    if (!selected) return;
    setSaving(true); setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/signin"); return; }
    const { error } = await supabase.from("profiles").update({ farm_role: selected }).eq("id", user.id);
    if (error) { setError(error.message); setSaving(false); return; }
    router.replace("/onboarding/complete-profile");
  }
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
    <h1 className="text-2xl font-bold">Choose your FarmPlug workspace</h1>
    <p className="mt-2 text-sm text-gray-500">Your administrator role is never self-selectable.</p>
    <div className="mt-6 space-y-3">{roles.map(r => <button key={r.value} onClick={() => setSelected(r.value)} className={`w-full rounded-xl border p-4 text-left ${selected === r.value ? "border-green-600 bg-green-50" : "border-gray-200"}`}><b>{r.label}</b><p className="mt-1 text-sm text-gray-500">{r.description}</p></button>)}</div>
    {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    <button disabled={!selected || saving} onClick={submit} className="mt-6 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Continue"}</button>
  </main>;
}
