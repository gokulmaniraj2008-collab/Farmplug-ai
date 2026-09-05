'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, CheckCircle2, Sparkles } from 'lucide-react';

export default function DecisionCenter() {
  const [crop, setCrop] = useState('Tomato');
  const [qty, setQty] = useState('500');
  const [storage, setStorage] = useState('Cold Storage');
  const [analyzed, setAnalyzed] = useState(false);
  const run = () => setAnalyzed(true);
  return <main className="pageShell"><header className="mobilePageHead"><Link href="/" className="back"><ArrowLeft size={18}/></Link><div><b>FarmPlug AI</b><span>Decision Center</span></div><Sparkles size={20}/></header>
    <section className="pageHero"><span className="eyebrow"><Sparkles size={14}/> AI DECISION CENTER</span><h1>Farm intelligence in one place.</h1><p>Enter a small set of farm/FPO inputs and generate the prototype market intelligence view.</p></section>
    <section className="pageCard"><div className="field"><label>Crop</label><select value={crop} onChange={e=>setCrop(e.target.value)}><option>Tomato</option><option>Onion</option><option>Potato</option><option>Mango</option></select></div><div className="field"><label>Quantity (kg)</label><input type="number" value={qty} onChange={e=>setQty(e.target.value)}/></div><div className="field"><label>Storage</label><select value={storage} onChange={e=>setStorage(e.target.value)}><option>Open Storage</option><option>Cold Storage</option></select></div><button className="btn primary full" onClick={run}>ANALYZE WITH FARMPLUG AI <BarChart3 size={17}/></button><div className="notice">AI Demo Prediction — Prototype Demonstration. Results are simulated and not scientifically validated.</div></section>
    {analyzed && <section className="pageResults"><div className="status"><CheckCircle2 size={15}/> Demo Ready</div><div className="miniGrid"><div><small>DEMAND OUTLOOK</small><strong>{crop === 'Onion' ? 'Medium' : 'High'}</strong></div><div><small>SELLING WINDOW</small><strong>{storage === 'Cold Storage' ? '5–7 days' : '3–5 days'}</strong></div><div><small>BUYER MATCHES</small><strong>{Number(qty) >= 1000 ? '4 suitable' : '3 suitable'}</strong></div><div><small>BULK OPPORTUNITY</small><strong>{Number(qty) >= 1000 ? 'Strong' : 'Potential'}</strong></div></div></section>}
  </main>;
}
