import Link from 'next/link';
import type { ComponentType } from 'react';
import { ArrowRight, Bot, Boxes, Route, ShoppingCart, Sparkles, Store, TrendingUp, Users } from 'lucide-react';

const modules = [
  ['Demand Forecasting','Anticipate relevant demand signals before production and selling decisions.','TrendingUp'],
  ['Production Decision Support','Translate market and seasonal signals into practical planning guidance.','Bot'],
  ['Selling-Window Intelligence','Help estimate a suitable selling window for perishable produce.','Bot'],
  ['Smart Buyer Matching','Match supply with quantity, quality, location and delivery requirements.','Users'],
  ['Supply Aggregation','Combine fragmented supply to satisfy larger buyer requirements.','Boxes'],
  ['Route Planning','Coordinate collection and delivery around the confirmed transaction.','Route'],
];

const icons: Record<string, ComponentType<{size?:number}>> = { TrendingUp, Users, Boxes, Route, Bot, ShoppingCart };

export default function PlatformPage(){
  return <main className="pageShell">
    <div className="mobilePageHead"><span>PLATFORM</span><b>FarmPlug AI</b><span>Overview</span></div>
    <section className="pageHero">
      <span className="eyebrow"><Sparkles size={14}/> FARMPLUG INTELLIGENCE</span>
      <h1>One platform from farm intelligence to the right market.</h1>
      <p>FarmPlug connects farmers and FPOs with market intelligence, buyer discovery, supply aggregation and coordinated fulfilment through a shared product platform.</p>
      <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:18}}><Link href="/farmer" className="btn primary">OPEN FARMER WORKSPACE <ArrowRight size={16}/></Link><Link href="/buyer" className="btn secondary">OPEN BUYER PORTAL</Link></div>
    </section>
    <section className="pageCard"><h2><Bot size={21}/> Intelligence layer</h2><p className="mutedText">Decision modules are designed to connect to validated AI/ML services as the product matures. Prototype outputs must be clearly labelled and reviewed before operational use.</p></section>
    <div className="miniGrid">{modules.map(([title,desc,icon])=>{const Icon=icons[icon]||Bot;return <div key={title}><Icon size={20}/><b style={{display:'block',marginTop:9}}>{title}</b><span className="mutedText">{desc}</span></div>})}</div>
    <section className="pageCard" style={{marginTop:14}}><h2><Store size={21}/> Connected transaction journey</h2>{[['01','Farmer / FPO lists supply'],['02','Buyer creates requirement'],['03','FarmPlug matches supply and demand'],['04','AI explains the recommendation'],['05','Quote → order → collection → delivery']].map(([n,t])=><div className="kpiRow" key={n}><b>{n} · {t}</b><span>Shared platform workflow</span></div>)}</section>
    <section className="pageCard"><h2><ShoppingCart size={21}/> Marketplace</h2><p className="mutedText">The marketplace is the transaction surface. Farmer supply and buyer requirements should become persistent records in the shared database once authentication and production APIs are connected.</p><Link href="/marketplace" className="btn secondary full">EXPLORE MARKETPLACE <ArrowRight size={16}/></Link></section>
    <section className="pageCard"><h2><Route size={21}/> Trust and operations</h2><div className="checkRow"><span>Role-based access for farmers, FPOs, buyers and admins</span></div><div className="checkRow"><span>Server-side AI calls and protected credentials</span></div><div className="checkRow"><span>Audit trail for quotes, orders and status changes</span></div><div className="checkRow"><span>Measured pilot KPIs instead of invented impact claims</span></div></section>
  </main>;
}
