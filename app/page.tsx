import Link from "next/link";

const features = [
  ["Farm Intelligence", "Track farms and crops with practical, decision-ready information."],
  ["Direct Marketplace", "Publish produce and connect supply with buyer requirements."],
  ["Transparent Orders", "Follow offers, order status, payments and disputes in one workflow."],
  ["Logistics", "Coordinate collection and delivery with route visibility."],
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-8 lg:px-8">
        <nav className="flex items-center justify-between border-b border-gray-200 pb-5">
          <div className="text-lg font-bold tracking-tight text-[#1B4332]">FARMPLUG AI</div>
          <div className="flex items-center gap-3">
            <Link href="/onboarding/role-selection" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-[#17211B]">Get started</Link>
          </div>
        </nav>

        <div className="grid gap-12 py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2E7D32]">Agriculture • Intelligence • Market</p>
            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-[#17211B] sm:text-6xl">From farm intelligence to a better market connection.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5F6B63]">FarmPlug AI brings farmer operations, crop information, produce supply, buyer demand, orders and logistics into one connected platform.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/onboarding/role-selection" className="rounded-lg bg-[#1B4332] px-5 py-3 text-sm font-semibold text-white shadow-sm">Start with FarmPlug AI</Link>
              <Link href="/dashboard/buyer/matches" className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[#17211B]">Explore marketplace</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-[#1B4332]/10 bg-white p-6 shadow-sm">
            <div className="rounded-2xl bg-[#EEF6EF] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5F6B63]">Farm-to-market flow</p>
              <div className="mt-6 space-y-3">
                {["Farmer & Farm", "Crop & Produce", "Buyer Requirement", "Offer & Order", "Logistics & Delivery"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-white bg-white px-4 py-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B4332] text-xs font-bold text-white">{index + 1}</span>
                    <span className="text-sm font-medium text-[#17211B]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <h2 className="text-2xl font-bold text-[#17211B]">One platform, connected workflows.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(([title, text]) => <article key={title} className="rounded-2xl border border-gray-200 p-5"><h3 className="font-semibold text-[#17211B]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#5F6B63]">{text}</p></article>)}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-8 text-sm text-[#5F6B63] lg:px-8">© {new Date().getFullYear()} FarmPlug AI. Built for practical agricultural connectivity.</footer>
    </main>
  );
}
