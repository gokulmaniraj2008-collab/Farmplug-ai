import Link from 'next/link';
import { ArrowLeft, Search, Store, Users } from 'lucide-react';

const listings = [
  ['Tomato', '5,000 kg', 'Grade A • Chennai', 'Processor'],
  ['Onion', '3,000 kg', 'Grade A • Salem', 'Exporter'],
  ['Mango', '2,000 kg', 'Grade A • Coimbatore', 'Buyer'],
];

const buyers = [
  ['Buyer A', 'Tomato — 4,000 kg', 'Grade A • Nearby', 'HIGH'],
  ['Buyer B', 'Tomato — 2,000 kg', 'Grade B • Medium distance', 'MEDIUM'],
  ['Processor C', 'Tomato — 6,000 kg', 'Grade A • 3-day delivery', 'HIGH'],
];

export default function Marketplace() {
  return (
    <main className="pageShell">
      <header className="mobilePageHead">
        <Link href="/" className="back" aria-label="Back to home">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <b>FarmPlug AI</b>
          <span>Marketplace</span>
        </div>
        <Store size={20} />
      </header>

      <section className="pageHero">
        <span className="eyebrow"><Store size={14} /> MARKETPLACE</span>
        <h1>Find the right demand.</h1>
        <p>Demo marketplace for the SIH prototype. These are simulated requirements, not real orders.</p>
      </section>

      <section className="pageCard">
        <div className="searchBox">
          <Search size={17} aria-hidden="true" />
          <label className="srOnly" htmlFor="marketplace-search">Search marketplace</label>
          <input
            id="marketplace-search"
            name="marketplace-search"
            type="search"
            placeholder="Search crop, buyer or location"
            aria-label="Search crop, buyer or location"
          />
        </div>
        {listings.map((r) => (
          <div className="marketRow" key={r[0]}>
            <div><b>{r[0]}</b><div className="mutedText">{r[1]} • {r[2]}</div></div>
            <span className="pill">{r[3]}</span>
          </div>
        ))}
      </section>

      <section className="pageCard">
        <h2><Users size={20} /> Smart Buyer Matching</h2>
        {buyers.map((b) => (
          <div className="marketRow" key={b[0]}>
            <div><b>{b[0]}</b><div className="mutedText">{b[1]} • {b[2]}</div></div>
            <span className="pill">{b[3]}</span>
          </div>
        ))}
        <div className="notice">Match factors: quantity • quality • location • delivery requirement • demand relevance.</div>
      </section>
    </main>
  );
}
