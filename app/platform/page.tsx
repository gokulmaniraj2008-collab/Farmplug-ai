import Link from 'next/link';
import type { ComponentType } from 'react';
import { ArrowRight, Bot, Boxes, CircleDollarSign, Handshake, MapPinned, PackageCheck, Route, ShoppingCart, Sparkles, Store, TrendingUp, Users } from 'lucide-react';

const modules = [
  ['Market Intelligence','Compare available market prices, arrivals and demand signals from connected data sources.','TrendingUp'],
  ['AI Price & Demand Forecast','Store model version, dataset version, horizon, confidence and validation metrics with each forecast.','Sparkles'],
  ['Selling-Window Recommendation','Turn available market signals into a clearly labelled, data-backed selling-window recommendation.','Bot'],
  ['Smart Buyer Matching','Match crop, quantity, quality, location, price and delivery requirements with explainable factors.','Handshake'],
  ['Multi-Farmer Aggregation','Combine fragmented farmer supply to fulfil larger requirements without inventing inventory.','Users'],
  ['Digital Quotes & Orders','Move from requirement to quote, acceptance and a backend-controlled order lifecycle.','CircleDollarSign'],
  ['Logistics Optimization','Coordinate collection and multi-stop delivery using routing data and optimization.','Route'],
  ['Delivery, Payment & Trust','Track delivery, payment status, disputes and audit events with explicit demo/production labels.','PackageCheck'],
];

const icons: Record<string, ComponentType<{size?:number}>> = { TrendingUp, Users, Boxes, Route, Bot, ShoppingCart, Sparkles, Handshake, CircleDollarSign, PackageCheck };

export default function PlatformPage(){
  return <main className="pageShell">
    <div className="mobilePageHead"><span>PLATFORM</span><b>FarmPlug AI</b><span>Startup</span></div>
    <section className="pageHero">
      <span className="eyebrow"><Sparkles size={14}/> AI AGRICULTURAL MARKET PLATFORM</span>
      <h1>From farm intelligence to the right market.</h1>
      <p>FarmPlug AI combines price discovery, AI forecasting, selling-window intelligence, direct buyer linkage, multi-farmer aggregation, logistics and transaction workflows in one farm-to-market platform.</p>
      <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:18}}><Link href="/app-v2" className="btn primary">OPEN FARMER APP <ArrowRight size={16}/></Link><Link href="/marketplace" className="btn secondary">OPEN MARKETPLACE</Link></div>
    </section>
    <section className="pageCard"><h2><Bot size={21}/> AI decision layer</h2><p className="mutedText">FarmPlug is designed around a real ML pipeline: market-data ingestion → cleaning → feature engineering → time-aware validation → training → backtesting → forecast → confidence → persisted model metadata. Forecasts are labelled Prototype Forecast until validated.</p></section>
    <div className="miniGrid">{modules.map(([title,desc,icon])=>{const Icon=icons[icon]||Bot;return <div key={title}><Icon size={20}/><b style={{display:'block',marginTop:9}}>{title}</b><span className="mutedText">{desc}</span></div>})}</div>
    <section className="pageCard" style={{marginTop:14}}><h2><Store size={21}/> End-to-end transaction journey</h2>{[['01','Farmer/FPO adds farm, crop and available quantity'],['02','Market intelligence compares available opportunities'],['03','AI forecasts price/demand and recommends a selling window'],['04','Buyer requirements are matched with supply'],['05','Multiple farmers can aggregate to a requirement'],['06','Quote → accepted → confirmed → collecting → in transit → delivered → completed']].map(([n,t])=><div className="kpiRow" key={n}><b>{n} · {t}</b><span>Shared platform workflow</span></div>)}</section>
    <section className="pageCard"><h2><ShoppingCart size={21}/> Marketplace execution</h2><p className="mutedText">The marketplace is not only a listing board. It is the transaction layer connecting supply, buyer requirements, quotes, orders and fulfilment. Account-specific records come from the authenticated database.</p><Link href="/marketplace" className="btn secondary full">EXPLORE MARKETPLACE <ArrowRight size={16}/></Link></section>
    <section className="pageCard"><h2><MapPinned size={21}/> Startup value proposition</h2><div className="kpiRow"><b>For farmers</b><span>Better market access, price visibility and buyer reach</span></div><div className="kpiRow"><b>For FPOs</b><span>Aggregation, procurement coordination and member supply visibility</span></div><div className="kpiRow"><b>For buyers</b><span>Structured supply discovery and coordinated procurement</span></div><div className="kpiRow"><b>For the supply chain</b><span>Less fragmented coordination and better logistics planning</span></div></section>
    <section className="pageCard"><h2><PackageCheck size={21}/> Trust, security and honesty</h2><div className="checkRow"><span>Supabase Auth + role-based access + row-level security</span></div><div className="checkRow"><span>Server-side validation, ownership checks and protected secrets</span></div><div className="checkRow"><span>Audit trail for sensitive quote/order transitions</span></div><div className="checkRow"><span>Payment Simulation is shown until a real payment provider is integrated</span></div><div className="checkRow"><span>Demo data and prototype forecasts are explicitly labelled</span></div></section>
  </main>;
}
