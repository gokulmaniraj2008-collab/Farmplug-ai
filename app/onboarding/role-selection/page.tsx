// File location: app/onboarding/role-selection/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

type SelectableRole = "farmer" | "buyer" | "fpo";

const ROLES: { value: SelectableRole; label: string; description: string }[] = [
  { value: "farmer", label: "Farmer", description: "List produce and get AI-matched buyers" },
  { value: "buyer", label: "Buyer", description: "Source produce directly from farms and FPOs" },
  { value: "fpo", label: "FPO / Aggregator", description: "Aggregate supply across multiple farmers" },
  // Admin intentionally excluded — see NON-NEGOTIABLE RULES:
  // admin access must be server-side authorized only, never public self-selection.
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<SelectableRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/signin?error=session_expired");
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: selected })
      .eq("id", user.id);

    if (updateError) {
      setError("Couldn't save your role. Please try again.");
      setLoading(false);
      return;
    }

    router.replace("/onboarding/complete-profile");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        How will you use FarmPlug AI?
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        You can only pick one role for now — this can be reviewed later by an
        administrator if it needs to change.
      </p>

      <div className="mt-6 space-y-3">
        {ROLES.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => setSelected(role.value)}
            className={`w-full rounded-lg border p-4 text-left transition ${
              selected === role.value
                ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-medium text-gray-900">{role.label}</div>
            <div className="text-sm text-gray-500">{role.description}</div>
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleContinue}
        disabled={!selected || loading}
        className="mt-6 w-full rounded-md bg-green-600 px-4 py-2.5 font-medium text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}
