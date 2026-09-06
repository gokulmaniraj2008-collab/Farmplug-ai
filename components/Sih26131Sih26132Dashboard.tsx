'use client';

import Link from 'next/link';
import { Camera, Leaf, MapPin, ShieldCheck, ShoppingBag, Truck, TrendingUp, Bug, ArrowRight } from 'lucide-react';

const cropCapabilities = [
  [Camera, 'Image-based scan'],
  [TrendingUp, 'Risk assessment'],
  [ShieldCheck, 'IPM guidance'],
  [MapPin, 'Local risk context'],
] as const;

const marketCapabilities = [
  [TrendingUp, 'Price discovery'],
  [ShoppingBag, 'Buyer matching'],
  [Truck, 'Logistics planning'],
  [ShieldCheck, 'Offer tracking'],
] as const;

export default function Sih26131Sih26132Dashboard() {
  return (
    <main className="pageShell">
      <section className="pageHero">
        <span className="eyebrow"><Leaf size={14} /> FARMPLUG AI V2.0 • SIH26131 + SIH26132</span>
        <h1>Detect better. Decide smarter. Sell better.</h1>
        <p>FarmPlug AI connects crop-health intelligence with market intelligence so farmers can move from an early crop warning to a better-informed sale.</p>
        <div className="notice" style={{ marginTop: 18 }}>
          <b>One platform. Two problem statements.</b>
          <span>Crop Health Intelligence → Market Linkage → Buyer → Logistics → Sale</span>
        </div>
      </section>

      <section className="dashboardGrid">
        <article className="pageCard">
          <div className="sectionHead">
            <div className="roundIcon"><Bug size={21} /></div>
            <span className="countBadge">SIH26131</span>
          </div>
          <h2>Crop Health Intelligence</h2>
          <p className="mutedText">Help farmers identify possible crop diseases and pest risks earlier and respond with practical, confidence-aware guidance.</p>
          <div className="miniGrid">
            {cropCapabilities.map(([Icon, label]) => (
              <div key={label}>
                <Icon size={20} />
                <b style={{ display: 'block', marginTop: 8 }}>{label}</b>
              </div>
            ))}
          </div>
          <Link href="/crop-health" className="btn primary full" style={{ marginTop: 16 }}>
            Open Crop Health <ArrowRight size={16} />
          </Link>
        </article>

        <article className="pageCard">
          <div className="sectionHead">
            <div className="roundIcon"><ShoppingBag size={21} /></div>
            <span className="countBadge">SIH26132</span>
          </div>
          <h2>Smart Market Linkage</h2>
          <p className="mutedText">Turn price discovery into an actionable selling decision by comparing markets, buyers, logistics and estimated net return.</p>
          <div className="miniGrid">
            {marketCapabilities.map(([Icon, label]) => (
              <div key={label}>
                <Icon size={20} />
                <b style={{ display: 'block', marginTop: 8 }}>{label}</b>
              </div>
            ))}
          </div>
          <Link href="/app-v2" className="btn secondary full" style={{ marginTop: 16 }}>
            Open Market <ArrowRight size={16} />
          </Link>
        </article>
      </section>

      <section className="pageCard">
        <span className="eyebrow"><TrendingUp size={14} /> SIH DEMONSTRATION FLOW</span>
        <h2>One farmer journey from crop health to sale.</h2>
        <div className="miniGrid" style={{ marginTop: 16 }}>
          {['1. Scan crop', '2. Understand risk', '3. Compare markets', '4. Match buyer', '5. Create lot', '6. Accept offer', '7. Coordinate logistics', '8. Complete sale'].map((step) => (
            <div key={step}><b>{step}</b></div>
          ))}
        </div>
      </section>

      <p className="mutedText" style={{ textAlign: 'center', fontSize: 12 }}>
        AI crop analysis is advisory and may be uncertain. Market prices, demand, transport costs and recommendations must show their source/update time when real data is available.
      </p>
    </main>
  );
}
