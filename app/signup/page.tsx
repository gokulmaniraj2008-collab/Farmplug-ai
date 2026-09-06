"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Leaf, LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function friendlyAuthError(message: string) {
  const n = message.toLowerCase();
  if (n.includes("rate limit")) return "Too many signup attempts right now. Wait a few minutes and try again.";
  if (n.includes("already registered") || n.includes("already exists")) return "An account with this email already exists. Log in instead.";
  if (n.includes("invalid") && n.includes("email")) return "Enter a valid email address.";
  return message;
}

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [accountExists, setAccountExists] = useState(false);

  async function createAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setAccountExists(false);
    if (password.length < 6) return setMessage("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setMessage("Passwords do not match.");
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
    if (error) {
      const n = error.message.toLowerCase();
      setAccountExists(n.includes("already registered") || n.includes("already exists"));
      setMessage(friendlyAuthError(error.message));
      setLoading(false);
      return;
    }
    if (!data.session || !data.user) { setMessage("Account creation did not start a session. Please try signing in directly, or try again."); setLoading(false); return; }
    const { error: profileError } = await supabase.from("profiles").upsert({ id: data.user.id, email: data.user.email, auth_provider: "email", role: "user", farm_role: "farmer", profile_complete: false }, { onConflict: "id" });
    if (profileError) { setMessage(`Account created, but profile setup failed: ${profileError.message}`); setLoading(false); return; }
    window.location.href = "/onboarding/role-selection";
  }

  return (
    <main className="min-h-screen bg-[#F7FAF7] px-4 py-6 text-[#172117] sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <section className="hidden rounded-[2rem] border border-[#DCE6DC] bg-white p-10 shadow-sm lg:block">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#172117] no-underline"><span className="grid size-9 place-items-center rounded-xl bg-[#EAF6ED] text-[#1E7A3D]"><Leaf size={19} /></span>FarmPlug AI</Link>
          <h1 className="mt-20 max-w-xl text-5xl font-semibold tracking-tight text-[#172117]">Start with your farm. We’ll help you find the next best move.</h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#647064]">Create one workspace for your farm, crop intelligence, market opportunities and orders.</p>
        </section>

        <section className="rounded-[2rem] border border-[#DCE6DC] bg-white p-6 shadow-[0_18px_50px_rgba(31,58,35,.08)] sm:p-8">
          <Link href="/" className="text-sm font-bold text-[#1E7A3D] no-underline lg:hidden">FarmPlug AI</Link>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#172117]">Create your account</h2>
          <p className="mt-2 text-sm leading-6 text-[#647064]">Set up your workspace in a few simple steps.</p>
          {message && <div className="mt-5 rounded-xl border border-[#DCE6DC] bg-[#F1F6F1] p-3 text-sm text-[#435043]" role="alert">{message}{accountExists && <> <Link href="/signin" className="font-semibold text-[#1E7A3D] hover:underline">Log in</Link></>}</div>}
          <form onSubmit={createAccount} className="mt-6 space-y-4">
            <label className="block"><span className="mb-2 block text-sm font-medium text-[#435043]">Email</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" className="w-full rounded-xl border border-[#C9D8CA] bg-white px-4 py-3.5 text-sm text-[#172117] outline-none placeholder:text-[#8A958A] focus:border-[#2E9E4F] focus:ring-2 focus:ring-[#2E9E4F]/20" /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium text-[#435043]">Password</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" placeholder="At least 6 characters" className="w-full rounded-xl border border-[#C9D8CA] bg-white px-4 py-3.5 text-sm text-[#172117] outline-none placeholder:text-[#8A958A] focus:border-[#2E9E4F] focus:ring-2 focus:ring-[#2E9E4F]/20" /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium text-[#435043]">Confirm password</span><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} autoComplete="new-password" placeholder="Re-enter your password" className="w-full rounded-xl border border-[#C9D8CA] bg-white px-4 py-3.5 text-sm text-[#172117] outline-none placeholder:text-[#8A958A] focus:border-[#2E9E4F] focus:ring-2 focus:ring-[#2E9E4F]/20" /></label>
            <button type="submit" disabled={loading} className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2E9E4F] px-4 text-sm font-bold text-white transition hover:bg-[#268C45] disabled:opacity-50">{loading ? "Creating account…" : "Create account"}<ArrowRight size={17} /></button>
          </form>
          <div className="mt-5 flex items-center gap-2 text-xs text-[#647064]"><LockKeyhole size={14} /> Your password is handled by the authentication provider.</div>
          <p className="mt-6 text-center text-sm text-[#647064]">Already have an account? <Link href="/signin" className="font-semibold text-[#1E7A3D] hover:underline">Sign in</Link></p>
        </section>
      </div>
    </main>
  );
}
