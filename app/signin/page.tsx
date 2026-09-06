"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function SignInContent() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (params.get("error") === "session_expired") {
      setMessage("Your session expired. Please sign in again.");
    }
  }, [params]);

  async function google() {
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
        <Link href="/" className="text-sm font-semibold text-[#1B4332]">
          FARMPLUG AI
        </Link>
        <h1 className="mt-8 text-2xl font-bold">Sign in</h1>
        <p className="mt-2 text-sm text-[#5F6B63]">
          Continue to your FarmPlug AI workspace.
        </p>
        {message && (
          <p className="mt-4 rounded-lg bg-gray-100 p-3 text-sm" role="alert">
            {message}
          </p>
        )}
        <button
          onClick={google}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-[#1B4332] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Opening Google..." : "Continue with Google"}
        </button>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center px-6">Loading sign in...</main>}>
      <SignInContent />
    </Suspense>
  );
}
