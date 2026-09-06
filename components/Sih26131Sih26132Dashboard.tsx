'use client';

import { Camera, Leaf, MapPin, ShieldCheck, ShoppingBag, Truck, TrendingUp, Bug, ArrowRight } from 'lucide-react';

export default function Sih26131Sih26132Dashboard() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">FarmPlug AI v2.0</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">SIH26131 + SIH26132</span>
          </div>
          <div className="grid gap-8 md:grid-cols-[1.3fr_.7fr] md:items-center">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">Integrated AgriTech Platform</p>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Detect better. Decide smarter. Sell better.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">FarmPlug AI connects crop-health intelligence with market intelligence so farmers can move from an early crop warning to a better-informed sale.</p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-6 text-white">
              <Leaf className="mb-4" size={32} />
              <p className="text-sm text-slate-300">Unified farmer journey</p>
              <p className="mt-2 text-xl font-bold">Farm → Crop Health → Market → Buyer → Logistics → Sale</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><Bug /></div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">SIH26131</span>
            </div>
            <h2 className="mt-5 text-2xl font-black">Crop Health Intelligence</h2>
            <p className="mt-2 text-slate-600">Help farmers identify possible crop diseases and pest risks earlier and respond with practical, confidence-aware guidance.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[[Camera,'Image-based scan'],[TrendingUp,'Risk assessment'],[ShieldCheck,'IPM guidance'],[MapPin,'Local risk context']].map(([Icon,label])=>{const I=Icon as typeof Camera;return <div key={String(label)} className="rounded-2xl bg-slate-50 p-4"><I size={20}/><p className="mt-2 text-sm font-semibold">{String(label)}</p></div>})}
            </div>
            <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">Open Crop Health <ArrowRight size={16}/></button>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><ShoppingBag /></div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">SIH26132</span>
            </div>
            <h2 className="mt-5 text-2xl font-black">Smart Market Linkage</h2>
            <p className="mt-2 text-slate-600">Turn price discovery into an actionable selling decision by comparing markets, buyers, logistics and estimated net return.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[[TrendingUp,'Price discovery'],[ShoppingBag,'Buyer matching'],[Truck,'Logistics planning'],[ShieldCheck,'Offer tracking']].map(([Icon,label])=>{const I=Icon as typeof ShoppingBag;return <div key={String(label)} className="rounded-2xl bg-slate-50 p-4"><I size={20}/><p className="mt-2 text-sm font-semibold">{String(label)}</p></div>})}
            </div>
            <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">Open Market <ArrowRight size={16}/></button>
          </section>
        </div>

        <section className="mt-6 rounded-3xl bg-slate-900 p-6 text-white sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">SIH demonstration flow</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">One platform. Two problems. One farmer journey.</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['1. Scan crop','2. Understand risk','3. Compare markets','4. Match buyer'].map((step)=><div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-4 font-semibold">{step}</div>)}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['5. Create lot','6. Accept offer','7. Coordinate logistics','8. Complete sale'].map((step)=><div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-4 font-semibold">{step}</div>)}
          </div>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">AI crop analysis is advisory and may be uncertain. Market prices, demand, transport costs and recommendations must be shown with their source/update time when real data is available.</p>
      </section>
    </main>
  );
}
