"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { (async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/signin"); return; }
    const { data } = await supabase.from("profiles").select("farm_role, role, phone, location_text, profile_complete").eq("id", user.id).maybeSingle();
    if (!data?.farm_role && data?.role !== "admin") { router.replace("/onboarding/role-selection"); return; }
    if (data.profile_complete) router.replace(data.role === "admin" ? "/dashboard/admin" : `/dashboard/${data.farm_role}`);
    setRole(data.role === "admin" ? "admin" : data.farm_role);
    setPhone(data.phone ?? ""); setLocation(data.location_text ?? "");
  })(); }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !role) { router.replace("/signin"); return; }
    const { error } = await supabase.from("profiles").update({ phone, location_text: location, profile_complete: true }).eq("id", user.id);
    if (error) { setError(error.message); setSaving(false); return; }
    router.replace(role === "admin" ? "/dashboard/admin" : `/dashboard/${role}`);
  }
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
    <h1 className="text-2xl font-bold">Complete your profile</h1><p className="mt-2 text-sm text-gray-500">Workspace: <b className="capitalize">{role ?? "…"}</b></p>
    <form onSubmit={submit} className="mt-6 space-y-4">
      <input required placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl border px-3 py-3" />
      <input required placeholder="Village / District / Business location" value={location} onChange={e => setLocation(e.target.value)} className="w-full rounded-xl border px-3 py-3" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={saving} className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Finish setup"}</button>
    </form>
  </main>;
}
