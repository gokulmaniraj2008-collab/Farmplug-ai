"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.6 4.6-6 7.9-11.3 7.9-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.1-5.1C33.9 5.1 29.2 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6 4.4C13.9 15.1 18.6 12 24 12c3.1 0 5.8 1.1 8 3l5.1-5.1C33.9 5.1 29.2 3 24 3c-7.7 0-14.3 4.3-17.7 10.7z" />
          <path fill="#4CAF50" d="M24 45c5.1 0 9.8-1.9 13.3-5.1l-6.1-5.2C29.2 36.5 26.7 37.3 24 37.3c-5.3 0-9.7-3.3-11.3-7.9l-6.1 4.7C9.7 40.6 16.3 45 24 45z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20.4H24v7.2h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.1 5.2C40.9 35.6 44 30.3 44 24c0-1.2-.1-2.4-.4-3.5z" />
        </svg>
        {loading ? "Connecting to Google..." : "Continue with Google"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}. <button onClick={handleGoogleSignIn} className="underline">Retry</button>
        </p>
      )}
    </div>
  );
}
