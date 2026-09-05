"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, MapPin, Search, ShoppingCart, Sparkles, Truck, Users } from "lucide-react";

const requirements = [
  { crop: "Tomato", quantity: 4000, quality: "Grade A", location: "Chennai", delivery: "3 days", status: "Open" },
  { crop: "Onion", quantity: 3000, quality: "Grade A", location: "Salem", delivery: "5 days", status: "Open" },
  { crop: "Mango", quantity: 2000, quality: "Grade A", location: "Coimbatore", delivery: "3 days", status: "Open" },
];

const supply = [
  { name: "FPO Tamil Nadu Fresh", crop: "Tomato", quantity: 3000, quality: "Grade A", location: "Kanchipuram", distance: "54 km", match: "HIGH" },
  { name: "GreenHarvest FPO", crop: "Tomato", quantity: 1000, quality: "Grade A", location: "Tiruvallur", distance: "42 km", match: "HIGH" },
  { name: "Salem Growers FPO", crop: "Tomato", quantity: 1800, quality: "Grade B", location: "Salem", distance: "310 km", match: "MEDIUM" },
];

export default function BuyerCenter() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [requested, setRequested] = useState<string[]>([]);
  const requirement = requirements[selected];
  const filtered = useMemo(() => supply.filter((item) => `${item.name} ${item.crop} ${item.location}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const matched = filtered.filter((item) => item.crop === requirement.crop && item.quality === requirement.quality);
  const matchedQty = matched.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="buyerPage">
      <header className="buyerHeader">
        <a href="/" className="back"><ArrowLeft size={17} /> FarmPlug AI</a>
        <div><span className="eyebrow"><Sparkles size={13} /> BUYER MODULE</span><h1>Buyer Command Center</h1><p>Find aligned FPO supply, consolidate lots and plan delivery.</p></div>
      </header>

      <section className="buyerWrap">
        <div className="buyerStats">
          <div><span>OPEN REQUIREMENTS</span><strong>{requirements.length}</strong></div>
          <div><span>MATCHED SUPPLY</span><strong>{matchedQty.toLocaleString()} kg</strong></div>
          <div><span>HIGH MATCHES</span><strong>{matched.filter(x => x.match === "HIGH").length}</strong></div>
        </div>

        <section className="buyerCard">
          <div className="sectionTitle"><div><span className="eyebrow">1 · BUYER REQUIREMENT</span><h2>Select what you need</h2></div><ShoppingCart size={22} /></div>
          <div className="requirementGrid">
            {requirements.map((item, i) => (
              <button key={`${item.crop}-${item.location}`} className={`requirement ${selected === i ? "active" : ""}`} onClick={() => setSelected(i)}>
                <b>{item.crop}</b><strong>{item.quantity.toLocaleString()} kg</strong><span>{item.quality} · {item.location}</span><small>Delivery: {item.delivery}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="buyerCard">
          <div className="sectionTitle"><div><span className="eyebrow">2 · SMART MATCHING</span><h2>FPO supply matches</h2></div><Users size={22} /></div>
          <div className="search"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search FPO, crop or location" /></div>
          <div className="matchSummary"><b>{requirement.crop} · {requirement.quantity.toLocaleString()} kg · {requirement.quality}</b><span>{matchedQty >= requirement.quantity ? "Requirement can be fulfilled" : "Additional aggregation may be needed"}</span></div>
          <div className="supplyList">
            {filtered.map(item => (
              <article className="supply" key={item.name}>
                <div className="supplyTop"><div><b>{item.name}</b><span>{item.crop} · {item.quality}</span></div><span className={`match ${item.match.toLowerCase()}`}>{item.match}</span></div>
                <div className="supplyMeta"><span>{item.quantity.toLocaleString()} kg</span><span><MapPin size={13} /> {item.location} · {item.distance}</span></div>
                <button className="quote" onClick={() => setRequested(x => x.includes(item.name) ? x : [...x, item.name])}>{requested.includes(item.name) ? <><CheckCircle2 size={15} /> Request sent</> : "REQUEST QUOTE"}</button>
              </article>
            ))}
          </div>
        </section>

        <section className="buyerGrid">
          <div className="buyerCard">
            <span className="eyebrow">3 · BULK OPPORTUNITY</span><h2>Consolidate the requirement</h2>
            <div className="bulk"><div><strong>3,000 kg</strong><span>FPO Tamil Nadu Fresh</span></div><div>+</div><div><strong>1,000 kg</strong><span>GreenHarvest FPO</span></div><div>=</div><div className="total"><strong>4,000 kg</strong><span>Buyer requirement</span></div></div>
            <p className="muted">FarmPlug demonstrates how fragmented FPO supply can be aligned into one commercial lot. Prototype data only.</p>
          </div>
          <div className="buyerCard">
            <span className="eyebrow">4 · DELIVERY PLAN</span><h2>Coordinate the last mile</h2>
            <div className="delivery"><Truck size={25} /><div><b>Consolidated delivery</b><span>Kanchipuram + Tiruvallur → Chennai</span><small>OpenStreetMap-compatible architecture · demo route</small></div></div>
            <div className="notice">No real-time vehicle tracking or live routing is claimed.</div>
          </div>
        </section>

        <section className="buyerCard demoNotice"><Sparkles size={18} /><div><b>AI Demo Prediction — Prototype Demonstration</b><p>Match scores, supply quantities and delivery suggestions on this page are simulated for the SIH prototype and are not scientifically or commercially validated.</p></div></section>
      </section>

      <style jsx>{`
        .buyerPage{min-height:100vh;background:#f6faf6;color:#17331f;padding-bottom:50px}.buyerHeader{background:#173d25;color:white;padding:30px 20px 34px}.buyerHeader>*{max-width:1100px;margin-left:auto;margin-right:auto}.back{display:inline-flex;align-items:center;gap:7px;color:#dcebdd;text-decoration:none;font-weight:700;margin-bottom:35px}.buyerHeader h1{font:700 42px/1.05 "Space Grotesk",sans-serif;margin:10px 0}.buyerHeader p{color:#d2e3d5;max-width:650px;margin:0}.buyerWrap{max-width:1100px;margin:-14px auto 0;padding:0 20px}.buyerStats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}.buyerStats>div{background:white;border:1px solid #dce8de;border-radius:16px;padding:17px;box-shadow:0 8px 25px rgba(28,60,38,.06)}.buyerStats span,.eyebrow{font-size:11px;letter-spacing:.11em;font-weight:800;color:#66806d;display:flex;gap:6px;align-items:center}.buyerStats strong{font-size:25px;display:block;margin-top:6px}.buyerCard{background:white;border:1px solid #dce8de;border-radius:20px;padding:22px;margin-bottom:18px;box-shadow:0 8px 25px rgba(28,60,38,.05)}.sectionTitle{display:flex;justify-content:space-between;align-items:flex-start}.sectionTitle h2,.buyerCard h2{font:700 25px "Space Grotesk",sans-serif;margin:7px 0 18px}.requirementGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.requirement{background:#f7faf7;border:1px solid #dce8de;border-radius:14px;padding:16px;text-align:left;cursor:pointer;color:#17331f}.requirement.active{border:2px solid #28733b;background:#eff8f0}.requirement b,.requirement strong,.requirement span,.requirement small{display:block}.requirement strong{font-size:20px;margin:5px 0}.requirement span,.requirement small,.muted{color:#6a7b70;font-size:12px}.search{display:flex;align-items:center;gap:8px;border:1px solid #dce8de;border-radius:12px;padding:10px 12px;margin-bottom:12px}.search input{border:0;outline:0;width:100%;font:inherit}.matchSummary{display:flex;justify-content:space-between;gap:10px;background:#f0f8f1;padding:12px;border-radius:12px;font-size:13px;margin-bottom:10px}.matchSummary span{color:#4d7055}.supply{border-top:1px solid #e5eee6;padding:15px 0}.supplyTop,.supplyMeta{display:flex;justify-content:space-between;gap:12px}.supplyTop b,.supplyTop span{display:block}.supplyTop>div span{font-size:12px;color:#6a7b70;margin-top:4px}.match{padding:5px 8px;border-radius:999px;font-size:10px;font-weight:800;height:max-content}.match.high{background:#e4f5e6;color:#176329}.match.medium{background:#fff2d8;color:#805c10}.supplyMeta{font-size:12px;color:#64756a;margin:9px 0}.supplyMeta span{display:flex;align-items:center;gap:4px}.quote{border:1px solid #b9cfbc;background:white;border-radius:9px;padding:8px 11px;font-size:11px;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:5px}.buyerGrid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.bulk{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#f4f9f4;border-radius:14px;padding:15px}.bulk div{font-size:18px;text-align:center}.bulk strong,.bulk span{display:block}.bulk strong{font-size:20px}.bulk span{font-size:10px;color:#6a7b70;margin-top:4px}.bulk .total{background:#e7f5e9;border-radius:10px;padding:10px}.delivery{display:flex;gap:13px;align-items:flex-start;background:#f4f9f4;padding:16px;border-radius:14px;margin-bottom:12px}.delivery b,.delivery span,.delivery small{display:block}.delivery span{font-size:13px;margin-top:5px}.delivery small{font-size:11px;color:#6a7b70;margin-top:5px}.notice{background:#fff8e8;border:1px solid #f1dfae;padding:11px;border-radius:10px;font-size:11px;color:#6f5a26}.demoNotice{display:flex;gap:12px;background:#eff8f0}.demoNotice p{margin:5px 0 0;color:#607065;font-size:12px;line-height:1.5}@media(max-width:700px){.buyerHeader{padding:22px 16px 30px}.buyerHeader h1{font-size:32px}.buyerWrap{padding:0 14px}.buyerStats{grid-template-columns:1fr}.requirementGrid,.buyerGrid{grid-template-columns:1fr}.buyerCard{padding:17px}.bulk{flex-wrap:wrap}.bulk>div{flex:1;min-width:80px}.matchSummary{display:block}.matchSummary span{display:block;margin-top:5px}}
      `}</style>
    </main>
  );
}
