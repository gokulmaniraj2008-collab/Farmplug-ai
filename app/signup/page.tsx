"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Leaf, LockKeyhole, MailCheck } from "lucide-react";
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
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function createAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setAccountExists(false);
    setConfirmationSent(false);

    const normalizedEmail = email.trim().toLowerCase();
    if (password.length < 6) return setMessage("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setMessage("Passwords do not match.");

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding/role-selection`,
          data: { farm_role: "farmer" },
        },
      });

      if (error) {
        const n = error.message.toLowerCase();
        setAccountExists(n.includes("already registered") || n.includes("already exists"));
        setMessage(friendlyAuthError(error.message));
        return;
      }

      if (!data.user) {
        setMessage("We could not create the account. Please try again.");
        return;
      }

      // With email confirmation enabled, Supabase intentionally returns no session.
      // The confirmation callback creates the profile and starts the onboarding flow.
      if (!data.session) {
        setConfirmationSent(true);
        setMessage(`Account created for ${normalizedEmail}. Check your email and confirm your account to continue.`);
        return;
      }

      // If email confirmation is disabled, a session is available immediately.
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          email: data.user.email,
          auth_provider: "email",
          role: "user",
          farm_role: "farmer",
          profile_complete: false,
        },
        { onConflict: "id" },
      );

      if (profileError) {
        setMessage(`Account created, but profile setup failed: ${profileError.message}`);
        return;
      }

      window.location.href = "/onboarding/role-selection";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create your account right now.");
    } finally {
      setLoading(false);
    }
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
          <p className="mt-2 text-sm leading-6 text-[#647064]">Create a secure FarmPlug account and continue to farmer onboarding.</p>

          {message && (
            <div className={`mt-5 rounded-xl border p-3 text-sm ${confirmationSent ? "border-[#B8DCC0] bg-[#EDF8EF] text-[#285C34]" : "border-[#DCE6DC] bg-[#F1F6F1] text-[#435043]"}`} role="alert">
              <div className="flex items-start gap-2">
                {confirmationSent && <MailCheck size={18} className="mt-0.5 shrink-0 text-[#2E9E4F]" />}
                <span>{message}</span>
              </div>
              {accountExists && <Link href="/signin" className="mt-2 inline-block font-semibold text-[#1E7A3D] hover:underline">Log in instead</Link>}
            </div>
          )}

          {!confirmationSent && (
            <form onSubmit={createAccount} className="mt-6 space-y-4">
              <label className="block"><span className="mb-2 block text-sm font-medium text-[#435043]">Email</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" className="w-full rounded-xl border border-[#C9D8CA] bg-white px-4 py-3.5 text-sm text-[#172117] outline-none placeholder:text-[#8A958A] focus:border-[#2E9E4F] focus:ring-2 focus:ring-[#2E9E4F]/20" /></label>
              <label className="block"><span className="mb-2 block text-sm font-medium text-[#435043]">Password</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" placeholder="At least 6 characters" className="w-full rounded-xl border border-[#C9D8CA] bg-white px-4 py-3.5 text-sm text-[#172117] outline-none placeholder:text-[#8A958A] focus:border-[#2E9E4F] focus:ring-2 focus:ring-[#2E9E4F]/20" /></label>
              <label className="block"><span className="mb-2 block text-sm font-medium text-[#435043]">Confirm password</span><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} autoComplete="new-password" placeholder="Re-enter your password" className="w-full rounded-xl border border-[#C9D8CA] bg-white px-4 py-3.5 text-sm text-[#172117] outline-none placeholder:text-[#8A958A] focus:border-[#2E9E4F] focus:ring-2 focus:ring-[#2E9E4F]/20" /></label>
              <button type="submit" disabled={loading} className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2E9E4F] px-4 text-sm font-bold text-white transition hover:bg-[#268C45] disabled:opacity-50">{loading ? "Creating account…" : "Create account"}<ArrowRight size={17} /></button>
            </form>
          )}

          {confirmationSent && <Link href="/signin" className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2E9E4F] px-4 text-sm font-bold text-white no-underline transition hover:bg-[#268C45]">Continue to sign in<ArrowRight size={17} /></Link>}
          <div className="mt-5 flex items-center gap-2 text-xs text-[#647064]"><LockKeyhole size={14} /> Your password is handled securely by Supabase Auth.</div>
          <p className="mt-6 text-center text-sm text-[#647064]">Already have an account? <Link href="/signin" className="font-semibold text-[#1E7A3D] hover:underline">Sign in</Link></p>
        </section>
      </div>
    </main>
  );
}
