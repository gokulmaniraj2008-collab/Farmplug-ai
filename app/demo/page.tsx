'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Leaf, Map, MessageCircle, PackageCheck, Route, Sparkles, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Order = { id: string; status: string; quantity_kg: number; delivery_location: string };

const steps = [
  { n: '01', title: 'Farmer lists harvest', text: 'Publish crop, quantity, quality and location.', href: '/dashboard', icon: Leaf },
  { n: '02', title: 'AI decides', text: 'Demand, selling window, buyer fit and freshness signal.', href: '/decision-center', icon: Sparkles },
  { n: '03', title: 'Buyer matches', text: 'Select a live requirement and request a quote.', href: '/buyer', icon: Users },
  { n: '04', title: 'Farmer accepts', text: 'Accept the quote and reserve the supply lot.', href: '/dashboard', icon: CheckCircle2 },
  { n: '05', title: 'Order moves', text: 'Track confirmed → collecting → transit → delivered → completed.', href: '/dashboard', icon: PackageCheck },
  { n: '06', title: 'Route optimizes', text: 'Generate a real road route using OpenStreetMap + OSRM.', href: '/buyer', icon: Route },
];

export default function DemoPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [route, setRoute] = useState<{distanceKm:number;durationMinutes:number;points:Array<{label:string}>}|null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const response = await fetch('/api/orders', { headers: { Authorization: `Bearer ${session.access_token}` }, cache: 'no-store' });
      if (response.ok) setOrders((await response.json()).orders ?? []);
    })();
  }, []);

  async function generateDemoRoute() {
    setRouteLoading(true); setMessage('');
    const response = await fetch('/api/logistics/route', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locations: ['Coimbatore, Tamil Nadu, India', 'Salem, Tamil Nadu, India', 'Chennai, Tamil Nadu, India'] }) });
    const data = await response.json();
    if (!response.ok) setMessage(data.error || 'Route generation failed.'); else setRoute(data);
    setRouteLoading(false);
  }

  return <main className="demoPage"><header className="demoHero"><Link href="/" className="demoBack">← FarmPlug AI</Link><span className="eyebrow"><Sparkles size={14}/> SIH 2026 · PS 26033</span><h1>From farm intelligence to the right market.</h1><p>A judge-ready two-minute story: supply → AI decision → buyer match → quote → order → logistics.</p><div className="demoButtons"><Link href="/dashboard" className="primary">Start with Farmer <ArrowRight size={16}/></Link><Link href="/buyer" className="secondary">Open Buyer Center</Link><Link href="/decision-center" className="secondary"><Sparkles size={16}/> AI Decision</Link></div></header>
    <section className="timeline">{steps.map(({n,title,text,href,icon:Icon})=><Link className="step" href={href} key={n}><span className="num">{n}</span><Icon size={20}/><div><b>{title}</b><span>{text}</span></div><ArrowRight size={16}/></Link>)}</section>
    <section className="liveGrid"><div className="card"><span className="eyebrow"><PackageCheck size={13}/> LIVE ORDER LIFECYCLE</span><h2>Proof of transaction flow</h2>{orders.length===0?<p className="muted">No order for your account yet. Complete one quote acceptance to make the lifecycle live.</p>:<div className="orders">{orders.slice(0,4).map(order=><div className="order" key={order.id}><div><b>#{order.id.slice(0,8)}</b><span>{Number(order.quantity_kg).toLocaleString()} kg → {order.delivery_location}</span></div><strong>{order.status.replace('_',' ')}</strong></div>)}</div>}<Link href="/dashboard" className="textLink">Manage farmer orders <ArrowRight size={14}/></Link></div>
      <div className="card"><span className="eyebrow"><Map size={13}/> LIVE ROUTING</span><h2>Road-aware collection plan</h2>{route?<><div className="routeMetric"><strong>{route.distanceKm} km</strong><span>{route.durationMinutes} min estimated driving time</span></div><p className="muted">{route.points.map(p=>p.label.split(',')[0]).join(' → ')}</p><small>© OpenStreetMap contributors · Routing via OSRM</small></>:<><p className="muted">This button calls the live routing service for a demo route. Results depend on current map data and service availability.</p><button className="routeButton" onClick={generateDemoRoute} disabled={routeLoading}>{routeLoading?'Generating route…':'Generate live demo route'} <Route size={15}/></button></>} {message&&<div className="warning">{message}</div>}</div></section>
    <section className="judgeCard"><MessageCircle size={22}/><div><b>Judge script</b><p>“A farmer publishes supply. FarmPlug converts farm context into a market decision. The buyer requirement is matched to available supply, a quote is requested, the farmer accepts it, and the system creates an order. Finally, the collection route is generated from real road-network data. The AI is explicitly a prototype signal, not a scientifically validated forecast.”</p></div></section>
    <footer>FarmPlug AI · SIH 2026 · Problem Statement 26033 · Prototype demonstration</footer>
    <style jsx>{`.demoPage{min-height:100vh;background:#f4f8f4;color:#17331f}.demoHero{background:#173d25;color:#fff;padding:34px max(18px,calc((100% - 1100px)/2)) 48px}.demoBack{display:inline-block;color:#d8eadb;text-decoration:none;font-weight:800;margin-bottom:32px}.eyebrow{display:flex;gap:6px;align-items:center;color:#7a9580;font-size:11px;font-weight:900;letter-spacing:.12em}.demoHero .eyebrow{color:#cde2d1}.demoHero h1{font:800 clamp(38px,6vw,64px)/.98 'Space Grotesk',sans-serif;max-width:850px;margin:12px 0}.demoHero p{max-width:720px;color:#d5e5d8;font-size:16px;line-height:1.6}.demoButtons{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.demoButtons a,.routeButton{display:inline-flex;align-items:center;gap:7px;border-radius:11px;padding:11px 14px;font-weight:800;font-size:12px;text-decoration:none}.primary{background:#fff;color:#173d25}.secondary{border:1px solid #5b7d63;color:#fff}.timeline,.liveGrid{max-width:1100px;margin:22px auto;padding:0 18px}.timeline{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.step{display:flex;align-items:flex-start;gap:10px;background:#fff;border:1px solid #dce8de;border-radius:15px;padding:15px;color:#17331f;text-decoration:none;box-shadow:0 8px 24px rgba(23,51,31,.05)}.step>div{flex:1}.step b,.step span{display:block}.step span:not(.num){font-size:11px;color:#6d7c71;line-height:1.4;margin-top:4px}.num{font-size:10px;font-weight:900;background:#e7f4e8;border-radius:7px;padding:5px 6px}.liveGrid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.card{background:#fff;border:1px solid #dce8de;border-radius:18px;padding:20px}.card h2{font:800 24px 'Space Grotesk',sans-serif;margin:8px 0 12px}.muted{color:#6b7a70;font-size:12px;line-height:1.5}.orders{display:grid;gap:8px;margin:15px 0}.order{display:flex;justify-content:space-between;gap:10px;border:1px solid #e1ebe2;border-radius:10px;padding:11px}.order b,.order span{display:block}.order span{font-size:11px;color:#718078;margin-top:3px}.order strong{font-size:10px;text-transform:uppercase;color:#2a713a}.textLink{display:inline-flex;align-items:center;gap:5px;color:#276b36;text-decoration:none;font-size:12px;font-weight:800}.routeMetric{background:#eff8f0;border-radius:12px;padding:15px;margin:14px 0}.routeMetric strong{font-size:28px;display:block}.routeMetric span{font-size:11px;color:#65756b}.routeButton{border:0;background:#28733b;color:#fff;cursor:pointer}.routeButton:disabled{opacity:.7}.warning{margin-top:10px;background:#fff8e8;padding:9px;border-radius:9px;font-size:11px;color:#765f2a}.judgeCard{max-width:1100px;margin:0 auto 22px;padding:20px 18px;background:#eaf6ec;border:1px solid #d2e8d5;border-radius:18px;display:flex;gap:12px}.judgeCard p{margin:6px 0 0;color:#52685a;font-size:13px;line-height:1.6}.demoPage footer{text-align:center;color:#75847a;font-size:11px;padding:20px}@media(max-width:700px){.timeline,.liveGrid{grid-template-columns:1fr}.timeline{display:grid}.liveGrid{display:grid}.demoHero{padding-top:24px}.demoHero h1{font-size:40px}.demoButtons{display:grid}.demoButtons a{justify-content:center}.judgeCard{margin-left:14px;margin-right:14px}}`}</style>
  </main>;
}
