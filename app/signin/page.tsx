'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, Loader2, ShieldCheck, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    const check = async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (active && data.session) router.replace('/app-v2');
    };
    check();
    return () => { active = false; };
  }, [router]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setMessage('Authentication is not configured. Please contact the administrator.');
      return;
    }
    if (!email.trim() || !password) {
      setMessage('Enter your email and password.');
      return;
    }

    setBusy(true);
    setMessage('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }

    if (!data.session) {
      setMessage('Sign-in completed, but no active session was returned. Please try again.');
      setBusy(false);
      return;
    }

    router.replace('/app-v2');
  };

  return (
    <main className="v2 auth">
      <Link href="/splash" className="backTop">← Back</Link>
      <div className="authLogo"><Leaf /></div>
      <p className="kicker">FARMER ACCOUNT</p>
      <h1>Welcome back.</h1>
      <p className="muted">Sign in securely to your FarmPlug AI farmer workspace.</p>

      <form onSubmit={submit} style={{ display: 'grid', gap: 10, marginTop: 24 }}>
        <label htmlFor="signin-email">Email</label>
        <input id="signin-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <label htmlFor="signin-password">Password</label>
        <input id="signin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
        {message && <p className="formMessage" role="alert">{message}</p>}
        <button className="mainBtn" type="submit" disabled={busy}>
          {busy ? <><Loader2 className="spin" size={18} /> Signing in…</> : <>Sign in <ArrowRight size={18} /></>}
        </button>
      </form>

      <div className="notice" style={{ marginTop: 16 }}>
        <ShieldCheck size={16} /> Your account is protected by Supabase Auth and server-side authorization.
      </div>

      <p style={{ marginTop: 18, textAlign: 'center' }}>
        New farmer? <Link href="/signup" style={{ fontWeight: 800 }}>Create an account</Link>
      </p>

      <Link href="/onboarding" style={{ marginTop: 8, textAlign: 'center' }}>
        Review onboarding again
      </Link>
    </main>
  );
}
