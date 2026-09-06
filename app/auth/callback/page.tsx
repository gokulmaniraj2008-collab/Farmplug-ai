'use client';
import { useEffect,useState } from 'react';
import { CheckCircle2,Loader2,RefreshCw,ShieldAlert } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const routes:Record<string,string>={farmer:'/farmer',fpo:'/portals',buyer:'/buyer',admin:'/admin'};

export default function AuthCallbackPage(){
 const [status,setStatus]=useState('Completing secure sign-in…');const [error,setError]=useState('');
 async function finish(){
  setError('');setStatus('Completing secure sign-in…');
  if(!supabase){setError('Supabase authentication is not configured.');return}
  try{
   const code=new URLSearchParams(location.search).get('code');
   if(code){const {error}=await supabase.auth.exchangeCodeForSession(code);if(error)throw error}
   const {data,error:sessionError}=await supabase.auth.getSession();
   if(sessionError||!data.session)throw sessionError||new Error('Authentication session was not found.');
   const user=data.session.user;
   const {data:profile}=await supabase.from('profiles').select('farm_role').eq('id',user.id).maybeSingle();
   const role=(profile?.farm_role||user.user_metadata?.farm_role||'').toLowerCase();
   if(!profile?.farm_role){setStatus('Your account is ready. Choose your workspace…');location.href='/role-select';return}
   location.href=routes[role]||'/farmer';
  }catch(e){setError(e instanceof Error?e.message:'Unable to complete authentication.');setStatus('Authentication could not be completed.');}
 }
 useEffect(()=>{finish()},[]);
 return <main className="pageShell"><section className="pageHero"><span className="eyebrow">{error?<ShieldAlert size={14}/>:<CheckCircle2 size={14}/>} AUTHENTICATION</span><h1>{status}</h1><p>{error?'Your sign-in session could not be completed. You can retry or return to sign in.':'Please wait while FarmPlug AI verifies your session and opens the correct workspace.'}</p></section><section className="pageCard">{error&&<div role="alert" className="notice" style={{color:'#8b1e1e',background:'#fff1f1'}}>{error}</div>}{!error&&<div style={{display:'flex',justifyContent:'center',padding:25}}><Loader2 size={30} className="spin"/></div>}<button className="btn secondary full" onClick={finish}><RefreshCw size={16}/> Retry</button><a className="btn primary full" href="/signin" style={{marginTop:10,textDecoration:'none',display:'flex'}}>Return to Sign In</a></section></main>;
}
