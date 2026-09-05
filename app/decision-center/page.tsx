'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, CheckCircle2, Sparkles } from 'lucide-react';

type Result = { demandLevel: string; demandScore: number; sellingWindowDays: string; buyerMatches: number; bulkOpportunity: string; freshnessRisk: string; logisticsPriority: string; breakdown: { market: number; quantity: number; quality: number; freshness: number; logistics: number }; reasons: string[]; prototype: true };

export default function DecisionCenter() {
  const [crop, setCrop] = useState('Tomato');
  const [qty, setQty] = useState('500');
  const [location, setLocation] = useState('Coimbatore');
  const [quality, setQuality] = useState('Grade A');
  const [harvestDate, setHarvestDate] = useState('');
  const [storage, setStorage] = useState('Cold Storage');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function run() {
    const quantityKg = Number(qty);
    if (!crop.trim()) {
      setError('Crop is required.');
      setResult(null);
      return;
    }
    if (!Number.isFinite(quantityKg) || quantityKg <= 0) {
      setError('Enter a valid quantity greater than 0 kg.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop: crop.trim(), quantityKg, location: location.trim(), quality, harvestDate, storage }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Decision service returned ${response.status}`);
      setResult(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return <main className="pageShell"><header className="mobilePageHead"><Link href="/" className="back"><ArrowLeft size={18}/></Link><div><b>FarmPlug AI</b><span>Decision Center</span></div><Sparkles size={20}/></header>
    <section className="pageHero"><span className="eyebrow"><Sparkles size={14}/> AI DECISION CENTER</span><h1>Farm intelligence in one place.</h1><p>Use farm and harvest inputs to generate a transparent prototype market-intelligence score.</p></section>
    <section className="pageCard"><div className="field"><label>Crop</label><select value={crop} onChange={e=>setCrop(e.target.value)}><option>Tomato</option><option>Onion</option><option>Potato</option><option>Mango</option><option>Banana</option><option>Chilli</option></select></div><div className="field"><label>Quantity (kg)</label><input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)}/></div><div className="field"><label>Location</label><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="District / market"/></div><div className="field"><label>Quality</label><select value={quality} onChange={e=>setQuality(e.target.value)}><option>Grade A</option><option>Grade B</option><option>Mixed</option></select></div><div className="field"><label>Harvest date</label><input type="date" value={harvestDate} onChange={e=>setHarvestDate(e.target.value)}/></div><div className="field"><label>Storage</label><select value={storage} onChange={e=>setStorage(e.target.value)}><option>Open Storage</option><option>Cold Storage</option></select></div><button className="btn primary full" onClick={run} disabled={loading}>{loading ? 'ANALYZING…' : 'ANALYZE WITH FARMPLUG AI'} <BarChart3 size={17}/></button><div className="notice">AI Demo Prediction — Prototype Demonstration. This transparent scoring engine is not a trained ML model and is not scientifically validated.</div>{error && <div className="notice">{error}</div>}</section>
    {result && <section className="pageResults"><div className="status"><CheckCircle2 size={15}/> Prototype analysis ready</div><div className="miniGrid"><div><small>DEMAND OUTLOOK</small><strong>{result.demandLevel} · {result.demandScore}/100</strong></div><div><small>SELLING WINDOW</small><strong>{result.sellingWindowDays}</strong></div><div><small>BUYER MATCHES</small><strong>{result.buyerMatches} potential</strong></div><div><small>BULK OPPORTUNITY</small><strong>{result.bulkOpportunity}</strong></div><div><small>FRESHNESS RISK</small><strong>{result.freshnessRisk}</strong></div><div><small>LOGISTICS PRIORITY</small><strong>{result.logisticsPriority}</strong></div></div><div className="card" style={{marginTop:16}}><h3 style={{marginTop:0}}>Why did FarmPlug score it this way?</h3><p style={{fontSize:13,color:'#64756a'}}>Explainable prototype components — these are decision signals, not predicted prices or guaranteed outcomes.</p>{[['Market signal',result.breakdown.market],['Quantity / aggregation',result.breakdown.quantity],['Quality fit',result.breakdown.quality],['Freshness / storage',result.breakdown.freshness],['Logistics readiness',result.breakdown.logistics]].map(([label,value])=><div key={String(label)} style={{margin:'14px 0'}}><div style={{display:'flex',justifyContent:'space-between',fontSize:13}}><b>{label}</b><span>{value}/100</span></div><div style={{height:7,borderRadius:8,background:'#e8eee9',marginTop:6,overflow:'hidden'}}><div style={{height:'100%',width:`${Number(value)}%`,background:'#2f7d46',borderRadius:8}}/></div></div>)}</div><div className="notice"><b>Decision rationale</b><ul>{result.reasons.map((reason, i) => <li key={i}>{reason}</li>)}</ul></div></section>}
  </main>;
}
