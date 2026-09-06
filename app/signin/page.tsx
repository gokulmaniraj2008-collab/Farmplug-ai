"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck } from "lucide-react";
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
    if (error) { setMessage(error.message); setLoading(false); return; }
    if (!data.session) { setMessage("Sign in succeeded, but no active session was returned. Please try again."); setLoading(false); return; }
    const next = params.get("next");
    const safeNext = next && (next.startsWith("/dashboard") || next.startsWith("/onboarding")) ? next : "/onboarding/complete-profile";
    window.location.href = safeNext;
  }

  return (
    <main className="min-h-screen bg-[#F7FAF7] px-4 py-6 text-[#172117] sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <section className="hidden rounded-[2rem] border border-[#DCE6DC] bg-white p-10 shadow-sm lg:block">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#172117] no-underline">
            <span className="grid size-9 place-items-center rounded-xl bg-[#EAF6ED] text-[#1E7A3D]"><Leaf size={19} /></span>
            FarmPlug AI
          </Link>
          <p className="mt-20 text-sm font-semibold text-[#2E9E4F]">Your farm. Your market. One connected workspace.</p>
          <h1 className="mt-3 max-w-xl text-5xl font-semibold tracking-tight text-[#172117]">Make better farm decisions with confidence.</h1>
          <div className="mt-8 flex items-center gap-3 text-sm text-[#647064]"><ShieldCheck size={18} className="text-[#2E9E4F]" /> Your account and farm data stay protected by your workspace permissions.</div>
        </section>

        <section className="rounded-[2rem] border border-[#DCE6DC] bg-white p-6 shadow-[0_18px_50px_rgba(31,58,35,.08)] sm:p-8">
          <Link href="/" className="text-sm font-bold text-[#1E7A3D] no-underline lg:hidden">FarmPlug AI</Link>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#172117]">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-[#647064]">Sign in to continue to your FarmPlug workspace.</p>
          {message && <p className="mt-5 rounded-xl border border-[#DCE6DC] bg-[#F1F6F1] p-3 text-sm text-[#435043]" role="alert">{message}</p>}
          <form onSubmit={signIn} className="mt-6 space-y-4">
            <label className="block"><span className="mb-2 block text-sm font-medium text-[#435043]">Email</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" className="w-full rounded-xl border border-[#C9D8CA] bg-white px-4 py-3.5 text-sm text-[#172117] outline-none placeholder:text-[#8A958A] focus:border-[#2E9E4F] focus:ring-2 focus:ring-[#2E9E4F]/20" /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium text-[#435043]">Password</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} autoComplete="current-password" placeholder="Your password" className="w-full rounded-xl border border-[#C9D8CA] bg-white px-4 py-3.5 text-sm text-[#172117] outline-none placeholder:text-[#8A958A] focus:border-[#2E9E4F] focus:ring-2 focus:ring-[#2E9E4F]/20" /></label>
            <button type="submit" disabled={loading} className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2E9E4F] px-4 text-sm font-bold text-white transition hover:bg-[#268C45] disabled:opacity-50">{loading ? "Signing in…" : "Sign in"}<ArrowRight size={17} className="transition group-hover:translate-x-0.5" /></button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs text-[#8A958A]"><span className="h-px flex-1 bg-[#DCE6DC]" /><span>or</span><span className="h-px flex-1 bg-[#DCE6DC]" /></div>
          <p className="text-center text-sm text-[#647064]">New to FarmPlug? <Link href="/signup" className="font-semibold text-[#1E7A3D] hover:underline">Create an account</Link></p>
        </section>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#F7FAF7] text-[#172117]">Loading…</main>}><SignInContent /></Suspense>;
}
