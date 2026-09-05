'use client';

import '../admin.css';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, LogOut, RefreshCw, Search, ShieldCheck, UserRoundCog, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type AdminUser = { id: string; email: string; name: string; provider: string; created_at: string; last_sign_in_at: string | null; email_confirmed_at: string | null };

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const load = async () => {
    if (!supabase) { setError('Supabase is not configured.'); setLoading(false); return; }
    setLoading(true); setError('');
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { router.replace('/admin/login'); return; }
    setEmail(auth.user.email ?? 'Authenticated user');
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !data.session) { setError('Authenticated session unavailable.'); setLoading(false); return; }
    const response = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${data.session.access_token}` }, cache: 'no-store' });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) setError(body.error ?? 'Unable to load users.'); else setUsers(body.users ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => users.filter(u => `${u.email} ${u.name} ${u.provider}`.toLowerCase().includes(query.toLowerCase())), [users, query]);
  const confirmed = users.filter(u => u.email_confirmed_at).length;
  const recent = users.filter(u => u.last_sign_in_at && Date.now() - new Date(u.last_sign_in_at).getTime() < 7 * 86400000).length;
  const fmt = (value: string | null) => value ? new Date(value).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never';

  const logout = async () => { if (supabase) await supabase.auth.signOut(); router.replace('/admin/login'); };
  return <main className="adminShell"><aside className="adminSidebar">
    <Link href="/" className="adminBrand"><span className="adminLogo">🌱</span><span><b>FarmPlug AI</b><small>Admin Center</small></span></Link>
    <div className="adminSideGroup"><span>CONTROL</span><Link href="/admin" className="adminControl">Overview <span>›</span></Link><Link href="/admin/users" className="adminControl selected">Users <span>›</span></Link>{['Farmers & FPOs','Buyers','Marketplace','Supply','Logistics','AI Monitor','Pilot KPIs'].map(x=><button key={x} className="adminControl"><span>{x}</span><span>›</span></button>)}</div>
    <div className="adminSideBottom"><Link href="/" className="adminBack"><ArrowLeft size={15}/> Public site</Link><button onClick={logout} className="adminLogout"><LogOut size={15}/> Sign out</button></div>
  </aside><section className="adminContent">
    <header className="adminTop"><div><div className="adminEyebrow"><Users size={14}/> USER DIRECTORY</div><h1>Registered Users</h1><p>Authenticated FarmPlug AI accounts available to the demo administration center.</p></div><div className="adminUser"><span className="adminAvatar"><UserRoundCog size={18}/></span><div><b>Administrator</b><small>{email}</small></div></div></header>
    <div className="adminNotice"><ShieldCheck size={18}/><div><b>Demo access policy</b><span>All authenticated accounts currently have Admin Center access. This is not production-safe authorization.</span></div></div>
    <div className="adminStats"><div className="adminStat"><Users size={20}/><small>Total users</small><strong>{users.length}</strong><span>Registered accounts</span></div><div className="adminStat"><CheckCircle2 size={20}/><small>Confirmed</small><strong>{confirmed}</strong><span>Email confirmed</span></div><div className="adminStat"><RefreshCw size={20}/><small>Recent sign-ins</small><strong>{recent}</strong><span>Last 7 days</span></div><div className="adminStat"><ShieldCheck size={20}/><small>Admin access</small><strong>ALL</strong><span>Demo configuration</span></div></div>
    <section className="adminPanel"><div className="adminPanelHead"><div><small>ACCOUNT MANAGEMENT</small><h2>Users</h2></div><button className="adminControl" onClick={load}><span><RefreshCw size={15}/> Refresh</span><span>↻</span></button></div>
      <div className="adminSearch"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search email, name, or provider…" /></div>
      {loading ? <div className="adminLoading">Loading registered users…</div> : error ? <div className="adminError" role="alert">{error}</div> : filtered.length === 0 ? <div className="adminEmpty"><Users size={28}/><h2>No users found</h2><p>Try a different search.</p></div> : <div className="adminUsersTable"><div className="adminUsersHead"><span>User</span><span>Provider</span><span>Status</span><span>Joined</span><span>Last sign-in</span></div>{filtered.map(user=><div className="adminUserRow" key={user.id}><div><b>{user.name || 'Unnamed user'}</b><small>{user.email}</small></div><span>{user.provider || 'email'}</span><span className={user.email_confirmed_at ? 'userStatus confirmed' : 'userStatus'}>{user.email_confirmed_at ? 'Confirmed' : 'Unconfirmed'}</span><span>{fmt(user.created_at)}</span><span>{fmt(user.last_sign_in_at)}</span></div>)}</div>}
    </section><footer className="adminFooter"><Users size={15}/> {filtered.length} shown • FarmPlug AI • SIH 2026 • PS 26033</footer>
  </section></main>;
}
