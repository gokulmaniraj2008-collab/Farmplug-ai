"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function createAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (password.length < 6) return setMessage("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setMessage("Passwords do not match.");

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.session || !data.user) {
      setMessage("Account creation did not start a session. Please try signing in directly, or try creating the account again.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email: data.user.email,
      auth_provider: "email",
      role: "user",
      farm_role: "farmer",
      profile_complete: false,
    }, { onConflict: "id" });
    if (profileError) {
      setMessage(`Account created, but profile setup failed: ${profileError.message}`);
      setLoading(false);
      return;
    }

    window.location.href = "/onboarding/role-selection";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <Link href="/" className="text-sm font-bold tracking-tight text-[#1B4332]">FARMPLUG AI</Link>
          <h1 className="mt-8 text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-2 text-sm text-[#5F6B63]">Join FarmPlug AI with your email and password.</p>
          {message && <p className="mt-4 rounded-lg bg-gray-100 p-3 text-sm text-gray-700" role="alert">{message}</p>}
          <form onSubmit={createAccount} className="mt-6 space-y-4">
            <label className="block"><span className="mb-1.5 block text-sm font-medium text-gray-700">Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-[#1B4332]" /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-medium text-gray-700">Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" placeholder="At least 6 characters" className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-[#1B4332]" /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-medium text-gray-700">Confirm password</span><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} autoComplete="new-password" placeholder="Re-enter your password" className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-[#1B4332]" /></label>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#1B4332] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Creating account..." : "Create account"}</button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">Already have an account? <Link href="/signin" className="font-semibold text-[#1B4332] hover:underline">Log in</Link></p>
        </div>
      </div>
    </main>
  );
}
