'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, BarChart3, CheckCircle2, Leaf, Plus, Route, Truck, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Listing = { id:string; farmer_name:string; crop:string; quantity_kg:number; quality:string; location:string; available_until:string|null; status:string; created_at:string };
const kpis=['Buyer Match Rate','Order Fulfilment Rate','Supply Aggregation Volume','Selling-Window Utilization','Logistics Efficiency','Market Access'];

export default function Dashboard(){
  const [listings,setListings]=useState<Listing[]>([]); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [message,setMessage]=useState('');
  const [form,setForm]=useState({farmerName:'',crop:'Tomato',quantityKg:'1000',quality:'Grade A',location:'Coimbatore',availableUntil:''});
  async function load(){
    setLoading(true); setMessage('');
    if(!supabase){setLoading(false);setMessage('Supabase is not configured.');return;}
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){setLoading(false);setMessage('Sign in to manage your farm supply.');return;}
    const r=await fetch('/api/farmer/listings',{headers:{Authorization:`Bearer ${session.access_token}`},cache:'no-store'}); const j=await r.json();
    if(!r.ok)setMessage(j.error||'Could not load listings.'); else setListings(j.listings||[]); setLoading(false);
  }
  useEffect(()=>{load()},[]);
  async function addListing(e:FormEvent){
    e.preventDefault(); setSaving(true); setMessage('');
    if(!supabase){setMessage('Supabase is not configured.');setSaving(false);return;}
    const {data:{session}}=await supabase.auth.getSession(); if(!session){setMessage('Sign in first to publish supply.');setSaving(false);return;}
    const r=await fetch('/api/farmer/listings',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify(form)}); const j=await r.json();
    if(!r.ok)setMessage(j.error||'Could not publish listing.'); else {setListings(x=>[j.listing,...x]);setMessage('Supply listing published to the marketplace.');setForm(x=>({...x,quantityKg:'1000',availableUntil:''}));} setSaving(false);
  }
  async function updateStatus(id:string,status:string){
    if(!supabase)return; const {data:{session}}=await supabase.auth.getSession(); if(!session)return;
    const r=await fetch('/api/farmer/listings',{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({id,status})}); const j=await r.json();
    if(!r.ok){setMessage(j.error||'Update failed.');return} setListings(x=>x.map(a=>a.id===id?{...a,status}:a)); setMessage(`Listing marked ${status}.`);
  }
  const total=listings.reduce((n,x)=>n+Number(x.quantity_kg),0); const available=listings.filter(x=>x.status==='available').length;
  return <main className="pageShell">
    <header className="mobilePageHead"><Link href="/" className="back"><ArrowLeft size={18}/></Link><div><b>FarmPlug AI</b><span>Farmer / FPO Dashboard</span></div><Leaf size={20}/></header>
    <section className="pageHero"><span className="eyebrow"><BarChart3 size={14}/> FARMER / FPO DASHBOARD</span><h1>Turn your harvest into a market-ready supply.</h1><p>Publish produce, track availability and make your supply visible to matched buyers.</p></section>
    <section className="dashboardGrid"><div className="statCard"><Users size={20}/><small>ACTIVE LISTINGS</small><strong>{available}</strong><span>Live marketplace supply</span></div><div className="statCard"><Truck size={20}/><small>LISTED SUPPLY</small><strong>{total.toLocaleString()} kg</strong><span>From your account</span></div><div className="statCard"><Route size={20}/><small>COLLECTION PLAN</small><strong>{listings.length ? 1 : 0}</strong><span>Prototype recommendation</span></div><div className="statCard"><BarChart3 size={20}/><small>BUYER SIGNAL</small><strong>{listings.length ? 'Ready' : '—'}</strong><span>Based on listed supply</span></div></section>
    <section className="pageCard"><h2><Plus size={19}/> Publish produce</h2><form className="listingForm" onSubmit={addListing}><label>Farmer / FPO name<input value={form.farmerName} onChange={e=>setForm({...form,farmerName:e.target.value})} placeholder="Your farm or FPO"/></label><label>Crop<select value={form.crop} onChange={e=>setForm({...form,crop:e.target.value})}><option>Tomato</option><option>Onion</option><option>Potato</option><option>Mango</option><option>Other</option></select></label><label>Quantity (kg)<input type="number" min="1" value={form.quantityKg} onChange={e=>setForm({...form,quantityKg:e.target.value})}/></label><label>Quality<select value={form.quality} onChange={e=>setForm({...form,quality:e.target.value})}><option>Grade A</option><option>Grade B</option><option>Mixed</option></select></label><label>Location<input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="District / market"/></label><label>Available until<input type="date" value={form.availableUntil} onChange={e=>setForm({...form,availableUntil:e.target.value})}/></label><button className="primaryButton" disabled={saving}>{saving?'Publishing…':'Publish supply'}</button></form>{message&&<div className="notice">{message}</div>}</section>
    <section className="pageCard"><h2>Your supply listings</h2>{loading?<p className="mutedText">Loading live listings…</p>:listings.length===0?<p className="mutedText">No listings yet. Publish your first harvest above.</p>:<div className="listingStack">{listings.map(x=><article className="listingCard" key={x.id}><div><b>{x.crop}</b><span>{x.quantity_kg} kg • {x.quality} • {x.location}</span><small>{x.available_until?`Available until ${x.available_until}`:'Availability date not set'}</small></div><div className="listingActions"><span className={`status ${x.status}`}>{x.status}</span>{x.status==='available'&&<button onClick={()=>updateStatus(x.id,'sold')}>Mark sold</button>}{x.status==='reserved'&&<button onClick={()=>updateStatus(x.id,'available')}>Release</button>}</div></article>)}</div>}</section>
    <section className="pageCard"><h2>Recommended collection plan</h2>{[['Collection sequence','Farmer → Hub → Warehouse → Buyer'],['Vehicle capacity','Aligned to listed quantity'],['Route status','Prototype recommendation']].map(x=><div className="marketRow" key={x[0]}><span className="mutedText">{x[0]}</span><b>{x[1]}</b></div>)}<div className="notice">Demo Route Optimization. No real-time GPS or live routing is claimed.</div></section>
    <section className="pageCard"><h2>Pilot KPIs</h2>{kpis.map(x=><div className="kpiRow" key={x}><b>{x}</b><span>To be measured and validated</span></div>)}</section>
  </main>
}
