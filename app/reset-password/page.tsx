'use client';
import { FormEvent,useEffect,useState } from 'react';
import Link from 'next/link';
import { CheckCircle2,KeyRound,Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ResetPasswordPage(){
 const [password,setPassword]=useState('');const [confirm,setConfirm]=useState('');const [ready,setReady]=useState(false);const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [error,setError]=useState('');
 useEffect(()=>{if(!supabase)return;supabase.auth.getSession().then(({data})=>setReady(!!data.session))},[]);
 async function submit(e:FormEvent){e.preventDefault();setError('');setMessage('');if(!supabase||!ready){setError('Your reset session is missing or expired. Request a new reset link.');return}if(password.length<8){setError('Password must be at least 8 characters.');return}if(password!==confirm){setError('Passwords do not match.');return}setBusy(true);const {error}=await supabase.auth.updateUser({password});if(error)setError(error.message);else setMessage('Password updated. You can now sign in.');setBusy(false)}
 return <main className="pageShell"><div className="mobilePageHead"><b>FarmPlug AI</b><span>Password</span></div><section className="pageHero"><span className="eyebrow"><KeyRound size={14}/> SECURITY</span><h1>Create a new password.</h1><p>Choose a strong password for your FarmPlug account.</p></section><section className="pageCard"><form onSubmit={submit}><div className="field"><label htmlFor="password">New password</label><input id="password" type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="new-password"/></div><div className="field"><label htmlFor="confirm">Confirm password</label><input id="confirm" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required autoComplete="new-password"/></div>{error&&<div role="alert" className="notice" style={{color:'#8b1e1e',background:'#fff1f1'}}>{error}</div>}{message&&<div role="status" className="notice"><CheckCircle2 size={15}/> {message} <Link href="/signin">Sign in</Link></div>}<button className="btn primary full" disabled={busy}>{busy?<><Loader2 size={16}/> Updating…</>:<>Update password <KeyRound size={16}/></>}</button></form></section></main>;
}
