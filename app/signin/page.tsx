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
    event.preventDefault(); setLoading(true); setMessage("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) { setMessage(error.message); setLoading(false); return; }
    if (!data.session) { setMessage("Sign in succeeded, but no active session was returned. Please try again."); setLoading(false); return; }
    const next = params.get("next");
    const safeNext = next && (next.startsWith("/dashboard") || next.startsWith("/onboarding")) ? next : "/onboarding/complete-profile";
    window.location.href = safeNext;
  }

  return <main className="min-h-screen bg-[#07130D] px-4 py-6 text-white sm:px-6 sm:py-10">
    <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
      <section className="hidden rounded-[2rem] border border-white/10 bg-[#0E2019] p-10 lg:block">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-white"><span className="grid size-9 place-items-center rounded-xl bg-[#E3B341] text-[#07130D]"><Leaf size={19}/></span>FarmPlug AI</Link>
        <p className="mt-20 text-sm font-semibold text-[#7FD79B]">Your farm. Your market. One connected workspace.</p>
        <h1 className="mt-3 max-w-xl text-5xl font-semibold tracking-tight">Make better farm decisions with confidence.</h1>
        <div className="mt-8 flex items-center gap-3 text-sm text-white/65"><ShieldCheck size={18} className="text-[#7FD79B]"/> Your account and farm data stay protected by your workspace permissions.</div>
      </section>
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <Link href="/" className="text-sm font-bold text-[#E3B341] lg:hidden">FarmPlug AI</Link>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">Welcome back</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">Sign in to continue to your FarmPlug workspace.</p>
        {message && <p className="mt-5 rounded-xl border border-white/10 bg-white/[0.06] p-3 text-sm text-white/80" role="alert">{message}</p>}
        <form onSubmit={signIn} className="mt-6 space-y-4">
          <label className="block"><span className="mb-2 block text-sm font-medium text-white/80">Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#7FD79B] focus:ring-2 focus:ring-[#7FD79B]/20" /></label>
          <label className="block"><span className="mb-2 block text-sm font-medium text-white/80">Password</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} autoComplete="current-password" placeholder="Your password" className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#7FD79B] focus:ring-2 focus:ring-[#7FD79B]/20" /></label>
          <button type="submit" disabled={loading} className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E3B341] px-4 text-sm font-bold text-[#07130D] transition hover:brightness-105 disabled:opacity-50">{loading ? "Signing in…" : "Sign in"}<ArrowRight size={17} className="transition group-hover:translate-x-0.5"/></button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs text-white/35"><span className="h-px flex-1 bg-white/10"/><span>or</span><span className="h-px flex-1 bg-white/10"/></div>
        <p className="text-center text-sm text-white/60">New to FarmPlug? <Link href="/signup" className="font-semibold text-[#7FD79B] hover:underline">Create an account</Link></p>
      </section>
    </div>
  </main>;
}
export default function SignInPage(){return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#07130D] text-white">Loading…</main>}><SignInContent/></Suspense>}
