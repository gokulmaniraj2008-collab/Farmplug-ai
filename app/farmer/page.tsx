'use client';

import Link from 'next/link';
import { ArrowRight, Bot, Leaf, PackagePlus, ShoppingCart, Sprout, TrendingUp, UserRound } from 'lucide-react';

const stats = [
  ['Active listings', '04', 'Produce currently available'],
  ['Buyer matches', '08', 'Relevant demand signals'],
  ['Pending quotes', '03', 'Responses to review'],
  ['Open orders', '02', 'Orders in progress'],
];

export default function FarmerPage() {
  return <main className="pageShell">
    <div className="mobilePageHead"><span>FARMER / FPO</span><b>FarmPlug AI</b><span>Portal</span></div>
    <section className="pageHero">
      <span className="eyebrow"><Leaf size={14}/> FARMER WORKSPACE</span>
      <h1>Your farm. Your market. One intelligence layer.</h1>
      <p>Manage produce, review buyer demand and use FarmPlug Intelligence to make better market decisions.</p>
      <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:18}}>
        <Link href="/decision-center" className="btn primary"><Bot size={17}/> ASK FARMPLUG AI <ArrowRight size={16}/></Link>
        <Link href="/marketplace" className="btn secondary">VIEW MARKETPLACE</Link>
      </div>
    </section>

    <div className="dashboardGrid">{stats.map(([label,value,desc])=><div className="statCard" key={label}><small>{label.toUpperCase()}</small><strong>{value}</strong><span>{desc}</span></div>)}</div>

    <section className="pageCard">
      <h2><Sprout size={21}/> Quick actions</h2>
      <div className="miniGrid">
        <Link href="/marketplace" style={{textDecoration:'none',color:'inherit'}}><div><PackagePlus size={20}/><b style={{display:'block',marginTop:9}}>Add produce</b><span className="mutedText">Create a supply listing</span></div></Link>
        <Link href="/decision-center" style={{textDecoration:'none',color:'inherit'}}><div><Bot size={20}/><b style={{display:'block',marginTop:9}}>Ask AI</b><span className="mutedText">Get a decision insight</span></div></Link>
        <Link href="/marketplace" style={{textDecoration:'none',color:'inherit'}}><div><ShoppingCart size={20}/><b style={{display:'block',marginTop:9}}>Find demand</b><span className="mutedText">Explore buyer requirements</span></div></Link>
        <Link href="/orders" style={{textDecoration:'none',color:'inherit'}}><div><TrendingUp size={20}/><b style={{display:'block',marginTop:9}}>Track orders</b><span className="mutedText">Review fulfilment status</span></div></Link>
      </div>
    </section>

    <section className="pageCard">
      <h2><Bot size={21}/> FarmPlug Intelligence</h2>
      <p className="mutedText">Decision support for demand, selling windows, buyer matching and supply coordination. AI outputs should be reviewed by the farmer before action.</p>
      <div className="kpiRow"><b>Demand outlook</b><span>Ready to analyze</span></div>
      <div className="kpiRow"><b>Selling-window signal</b><span>Ready to analyze</span></div>
      <div className="kpiRow"><b>Buyer compatibility</b><span>Based on listed supply</span></div>
    </section>

    <section className="pageCard">
      <h2><UserRound size={21}/> Account</h2>
      <p className="mutedText">This portal is the farmer/FPO interface. Authentication, role permissions and persistent farm data should be connected to the shared backend before production launch.</p>
      <Link href="/download" className="btn secondary full">GET THE FARMPLUG APP <ArrowRight size={16}/></Link>
    </section>
  </main>;
}
