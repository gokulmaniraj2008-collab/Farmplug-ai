'use client';
import { useEffect,useState } from 'react';
import { Building2,Check,Leaf,Loader2,Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const roles=[['farmer','Farmer','Manage farms, crops, listings and orders.',Leaf,'/farmer'],['fpo','FPO / Aggregator','Coordinate members, aggregation and logistics.',Users,'/portals'],['buyer','Buyer','Create requirements, matches, offers and orders.',Building2,'/buyer']] as const;
export default function RoleSelectPage(){
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [selected,setSelected]=useState('farmer');
 async function choose(){setError('');if(!supabase){setError('Supabase authentication is not configured.');return}setBusy(true);const {data:{user}}=await supabase.auth.getUser();if(!user){location.href='/signin';return}const {error}=await supabase.from('profiles').update({farm_role:selected}).eq('id',user.id);if(error){setError(error.message);setBusy(false);return}const target=roles.find(r=>r[0]===selected)?.[4]||'/farmer';location.href=target}
 useEffect(()=>{supabase?.auth.getUser().then(({data})=>{if(!data.user)location.href='/signin'})},[]);
 return <main className="pageShell"><section className="pageHero"><span className="eyebrow"><Check size={14}/> WORKSPACE SETUP</span><h1>Choose your FarmPlug workspace.</h1><p>This step is for a new account without an assigned role. Admin access is never selectable here.</p></section><section className="pageCard"><div className="miniGrid">{roles.map(([id,name,desc,Icon])=><button key={id} type="button" onClick={()=>setSelected(id)} style={{textAlign:'left',cursor:'pointer',border:selected===id?'2px solid #166534':'1px solid #e3ece5',background:selected===id?'#effaf1':'#fff',borderRadius:15,padding:18}}><Icon size={22}/><b style={{display:'block',marginTop:9}}>{name}</b><span className="mutedText">{desc}</span></button>)}</div>{error&&<div role="alert" className="notice" style={{color:'#8b1e1e',background:'#fff1f1'}}>{error}</div>}<button className="btn primary full" onClick={choose} disabled={busy} style={{marginTop:15}}>{busy?<><Loader2 size={16}/> Saving…</>:<>Continue as {roles.find(r=>r[0]===selected)?.[1]} <Check size={16}/></>}</button></section></main>;
}
