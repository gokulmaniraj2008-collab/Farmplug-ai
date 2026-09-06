// File location: app/onboarding/complete-profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

type Role = "farmer" | "buyer" | "fpo" | "admin" | null;

const WORKSPACE_BY_ROLE: Record<string, string> = {
  farmer: "/dashboard/farmer",
  buyer: "/dashboard/buyer",
  fpo: "/dashboard/fpo",
  admin: "/dashboard/admin",
};

export default function CompleteProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [locationText, setLocationText] = useState(""); // village/district or buyer HQ
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/signin?error=session_expired");
        return;
      }

      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (fetchError || !profile?.role) {
        // No role yet -> send back to role selection rather than guessing.
        router.replace("/onboarding/role-selection");
        return;
      }

      setRole(profile.role);
      setFullName(profile.full_name ?? "");
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !role) {
      router.replace("/signin?error=session_expired");
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone,
        location_text: locationText,
        profile_complete: true,
      })
      .eq("id", user.id);

    if (updateError) {
      setError("Couldn't save your profile. Please try again.");
      setSubmitting(false);
      return;
    }

    router.replace(WORKSPACE_BY_ROLE[role] ?? "/");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Complete your profile
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Signed up as{" "}
        <span className="font-medium capitalize">
          {role === "fpo" ? "FPO / Aggregator" : role}
        </span>
        .
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full name
          </label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone number
          </label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {role === "buyer" ? "Business location" : "Village / District"}
          </label>
          <input
            required
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-green-600 px-4 py-2.5 font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Finish setup"}
        </button>
      </form>
    </div>
  );
}
