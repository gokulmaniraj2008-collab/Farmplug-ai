"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function SignInContent() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const error = params.get("error");
    if (error === "session_expired") setMessage("Your session expired. Please sign in again.");
    if (error === "account_created") setMessage("Account created. You can now sign in.");
    if (error === "email_confirmation") setMessage("Check your email to confirm your account, then sign in.");
  }, [params]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setMessage("Sign in succeeded, but no active session was returned. Please try again.");
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <Link href="/" className="text-sm font-bold tracking-tight text-[#1B4332]">
            FARMPLUG AI
          </Link>
          <h1 className="mt-8 text-2xl font-bold text-gray-900">Log in</h1>
          <p className="mt-2 text-sm text-[#5F6B63]">Log in to your FarmPlug AI account.</p>

          {message && (
            <p className="mt-4 rounded-lg bg-gray-100 p-3 text-sm text-gray-700" role="alert">
              {message}
            </p>
          )}

          <form onSubmit={signIn} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-[#1B4332]"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                autoComplete="current-password"
                placeholder="Your password"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-[#1B4332]"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1B4332] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            <span>OR</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-[#1B4332] hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center px-6">Loading...</main>}>
      <SignInContent />
    </Suspense>
  );
}
