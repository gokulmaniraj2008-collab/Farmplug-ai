'use client';
import { FormEvent,useState } from 'react';
import Link from 'next/link';
import { ArrowLeft,KeyRound,Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ForgotPasswordPage(){
 const [email,setEmail]=useState('');const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [error,setError]=useState('');
 async function submit(e:FormEvent){e.preventDefault();setMessage('');setError('');if(!supabase){setError('Supabase authentication is not configured.');return}if(!email){setError('Enter your account email.');return}setBusy(true);const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:`${location.origin}/reset-password`});if(error)setError(error.message);else setMessage('If this email is registered, a password reset link has been sent.');setBusy(false)}
 return <main className="pageShell"><div className="mobilePageHead"><Link href="/signin" className="back"><ArrowLeft size={18}/></Link><b>FarmPlug AI</b><span>Reset</span></div><section className="pageHero"><span className="eyebrow"><KeyRound size={14}/> ACCOUNT RECOVERY</span><h1>Reset your password.</h1><p>Enter your account email and we will send a secure Supabase password reset link.</p></section><section className="pageCard"><form onSubmit={submit}><div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required/></div>{error&&<div role="alert" className="notice" style={{color:'#8b1e1e',background:'#fff1f1'}}>{error}</div>}{message&&<div role="status" className="notice">{message}</div>}<button className="btn primary full" disabled={busy}>{busy?<><Loader2 size={16}/> Sending…</>:<>Send reset link <KeyRound size={16}/></>}</button></form></section></main>;
}
