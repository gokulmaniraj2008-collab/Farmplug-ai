'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Leaf, ShieldCheck, Smartphone, UserRound } from 'lucide-react';

const roles = [
  ['Farmer / FPO','Open the farmer workspace','/farmer',Leaf],
  ['Buyer','Open the buyer portal','/buyer',Building2],
  ['Admin','Open the administration console','/admin',ShieldCheck],
] as const;

export default function SignInPage(){
  const [role,setRole]=useState('Farmer / FPO');
  const target=roles.find(r=>r[0]===role)?.[2]||'/farmer';
  return <main className="pageShell">
    <div className="mobilePageHead"><span>ACCOUNT</span><b>FarmPlug AI</b><span>Sign in</span></div>
    <section className="pageHero">
      <span className="eyebrow"><UserRound size={14}/> SECURE ACCESS</span>
      <h1>Sign in to your FarmPlug workspace.</h1>
      <p>Choose your role to continue. Production authentication should use the shared identity service with role-based access control.</p>
    </section>
    <section className="pageCard">
      <h2><UserRound size={21}/> Choose your workspace</h2>
      <div className="miniGrid">{roles.map(([name,desc,href,Icon])=><button key={name} onClick={()=>setRole(name)} style={{textAlign:'left',cursor:'pointer',border:role===name?'2px solid #166534':'1px solid #e3ece5',background:role===name?'#effaf1':'#fff',borderRadius:15,padding:17}}><Icon size={20}/><b style={{display:'block',marginTop:9}}>{name}</b><span className="mutedText">{desc}</span></button>)}</div>
      <Link href={target} className="btn primary full" style={{marginTop:14}}>CONTINUE AS {role.toUpperCase()} <ArrowRight size={16}/></Link>
      <div className="notice" style={{marginTop:14}}><Smartphone size={15}/> For the dedicated farmer mobile experience, use the FarmPlug Android app.</div>
    </section>
    <section className="pageCard"><h2><ShieldCheck size={21}/> Production readiness</h2><p className="mutedText">This role selector is the platform entry point. Connect it to Supabase Auth, server-side authorization and Row-Level Security before treating the portals as production authenticated surfaces.</p></section>
  </main>;
}
