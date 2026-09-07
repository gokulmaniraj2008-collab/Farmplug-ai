"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Leaf, MapPin, Phone, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const labels: Record<string, string> = {
  farmer: "Farmer",
  buyer: "Buyer",
  fpo: "FPO / Aggregator",
  admin: "Administrator",
};

export default function CompleteProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/signin");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("farm_role,role,phone,location_text,profile_complete")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (!data?.farm_role && data?.role !== "admin") {
        router.replace("/onboarding/role-selection");
        return;
      }

      if (data.profile_complete) {
        router.replace(data.role === "admin" ? "/dashboard/admin" : `/dashboard/${data.farm_role}`);
        return;
      }

      setRole(data.role === "admin" ? "admin" : data.farm_role);
      setPhone(data.phone ?? "");
      setLocation(data.location_text ?? "");
    }

    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !role) {
      router.replace("/signin");
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        phone: phone.trim(),
        location_text: location.trim(),
        profile_complete: true,
      })
      .eq("id", user.id);

    if (updateError) {
      setError("We couldn't save your details. Please try again.");
      setSaving(false);
      return;
    }

    localStorage.removeItem("farmplug_onboarding_role");
    window.location.href = role === "admin" ? "/dashboard/admin" : `/dashboard/${role}`;
  }

  const workspaceLabel = role ? labels[role] ?? "FarmPlug" : "Loading…";

  return (
    <main className="min-h-screen bg-[#F7FAF7] px-4 py-5 text-[#172117] sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-3xl flex-col">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="grid size-10 place-items-center rounded-full border border-[#DCE6DC] bg-white text-[#526052] shadow-sm"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 text-sm font-extrabold">
            <span className="grid size-9 place-items-center rounded-xl bg-[#EAF6ED] text-[#1E7A3D]">
              <Leaf size={19} />
            </span>
            FarmPlug AI
          </div>
          <span className="w-10" />
        </div>

        <div className="mx-auto w-full max-w-2xl py-8 sm:py-12">
          <div className="flex gap-2" aria-label="Onboarding progress">
            <span className="h-1.5 flex-1 rounded-full bg-[#2E9E4F]" />
            <span className="h-1.5 flex-1 rounded-full bg-[#2E9E4F]" />
            <span className="h-1.5 flex-1 rounded-full bg-[#2E9E4F]" />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#8A6817]">
            STEP 3 OF 3 · Almost there
          </p>

          <div className="mt-7 flex size-14 items-center justify-center rounded-2xl bg-[#EAF6ED] text-[#2E9E4F]">
            <Sparkles size={25} />
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Make your workspace yours.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#647064] sm:text-base">
            Just two details. Then we’ll take you straight to your {workspaceLabel} workspace.
          </p>

          <div className="mt-7 rounded-2xl border border-[#DCE6DC] bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#8A6817]">
              Selected workspace
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-[#EDF8EF] text-[#1E7A3D]">
                <Check size={19} />
              </span>
              <span className="font-extrabold">{workspaceLabel}</span>
            </div>
          </div>

          <form onSubmit={submit} className="mt-3 space-y-3">
            <label className="block rounded-2xl border border-[#DCE6DC] bg-white p-4 shadow-sm focus-within:border-[#2E9E4F] focus-within:ring-2 focus-within:ring-[#2E9E4F]/10">
              <span className="flex items-center gap-2 text-sm font-bold">
                <Phone size={17} className="text-[#2E9E4F]" />
                Phone number
              </span>
              <input
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="10-digit phone number"
                inputMode="tel"
                autoComplete="tel"
                className="mt-3 w-full bg-transparent text-base outline-none placeholder:text-[#9AA39A]"
              />
            </label>

            <label className="block rounded-2xl border border-[#DCE6DC] bg-white p-4 shadow-sm focus-within:border-[#2E9E4F] focus-within:ring-2 focus-within:ring-[#2E9E4F]/10">
              <span className="flex items-center gap-2 text-sm font-bold">
                <MapPin size={17} className="text-[#2E9E4F]" />
                Location
              </span>
              <input
                required
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Village, district or business location"
                autoComplete="address-level2"
                className="mt-3 w-full bg-transparent text-base outline-none placeholder:text-[#9AA39A]"
              />
            </label>

            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || !role}
              className="flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#2E9E4F] text-sm font-extrabold text-white shadow-sm hover:bg-[#268C45] disabled:opacity-40"
            >
              {saving ? "Saving your workspace…" : "Finish & enter FarmPlug"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-[#7A857A]">
            Your information is used to personalize your workspace and remains protected by your account permissions.
          </p>
        </div>
      </div>
    </main>
  );
}
