'use client';

import '../admin.css';
import { FormEvent, useState } from 'react';
import { ArrowRight, Leaf, LockKeyhole, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    if (!supabase) { setError('Supabase Auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in the deployment environment.'); return; }
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    // Demo mode: every authenticated Supabase account is allowed into Admin Center.
    router.replace('/admin');
  };

  return <main className="adminLoginShell"><div className="adminLoginCard">
    <div className="adminBrand"><span className="adminLogo"><Leaf size={21} /></span><b>FarmPlug AI</b></div>
    <div className="adminEyebrow"><ShieldCheck size={14} /> ADMIN CONTROL CENTER</div>
    <h1>Sign in to Admin Center.</h1><p>Any authenticated FarmPlug AI account can access the demo administration center.</p>
    <form onSubmit={submit} className="adminForm"><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required /></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
      </label>{error && <div className="adminError" role="alert">{error}</div>}<button className="adminPrimary" disabled={loading}>{loading?'AUTHENTICATING…':'SIGN IN'} <ArrowRight size={17}/></button>
    </form><div className="adminSecurity"><LockKeyhole size={15}/><span>Authenticated access only. This demo configuration does not use an admin-role allowlist.</span></div>
  </div></main>;
}
