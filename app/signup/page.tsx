'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Chrome, Leaf, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [message, setMessage] = useState('');

  const signUpWithGoogle = async () => {
    if (!supabase) {
      setMessage('Authentication is not configured. Please contact the administrator.');
      return;
    }
    setGoogleBusy(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/app-v2`,
        queryParams: { access_type: 'offline', prompt: 'select_account' },
      },
    });
    if (error) {
      setMessage(error.message);
      setGoogleBusy(false);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return setMessage('Authentication is not configured. Please contact the administrator.');
    if (!name.trim() || !email.trim()) return setMessage('Enter your name and email.');
    if (password.length < 8 || password !== confirm) return setMessage('Use matching passwords with at least 8 characters.');

    setBusy(true);
    setMessage('');
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim(), farm_role: 'farmer' } },
    });

    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, email: email.trim(), farm_role: 'farmer' });
      await supabase.from('farmer_profiles').upsert({ id: data.user.id, full_name: name.trim() });
    }

    setBusy(false);
    if (data.session) router.replace('/app-v2');
    else setMessage('Account created. Check your email if confirmation is required, then sign in.');
  };

  return (
    <main className="v2 auth">
      <Link href="/signin" className="backTop">← Back to sign in</Link>
      <div className="authLogo"><Leaf /></div>
      <p className="kicker">CREATE FARMER ACCOUNT</p>
      <h1>Join FarmPlug AI.</h1>
      <p className="muted">Create your secure farmer workspace and continue to your farm dashboard.</p>

      <button className="mainBtn" type="button" onClick={signUpWithGoogle} disabled={googleBusy || busy} style={{ marginTop: 24 }}>
        {googleBusy ? <><Loader2 className="spin" size={18} /> Connecting to Google…</> : <><Chrome size={18} /> Continue with Google</>}
      </button>

      <div className="muted" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
        <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: 0.2 }} />
        <span>or create with email</span>
        <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: 0.2 }} />
      </div>

      <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
        <label htmlFor="signup-name">Full name</label>
        <input id="signup-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <label htmlFor="signup-email">Email</label>
        <input id="signup-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <label htmlFor="signup-password">Password</label>
        <input id="signup-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
        <label htmlFor="signup-confirm">Confirm password</label>
        <input id="signup-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" />
        {message && <p className="formMessage" role="alert">{message}</p>}
        <button className="mainBtn" type="submit" disabled={busy || googleBusy}>
          {busy ? <><Loader2 className="spin" size={18} /> Creating…</> : <>Create account <ArrowRight size={18} /></>}
        </button>
      </form>
    </main>
  );
}
