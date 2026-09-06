import Link from "next/link";

const features = [
  ["Farm Intelligence", "Turn farm and crop data into clear, practical decisions."],
  ["Better Market Access", "Publish available produce and discover relevant buyer demand."],
  ["Offers & Orders", "Move from matched supply to transparent offers and confirmed orders."],
  ["Logistics", "Coordinate collection, delivery and order progress in one workflow."],
];

const steps = [
  ["01", "Set up your farm", "Add your farm and crop details once."],
  ["02", "Understand your crop", "Use intelligence to plan harvest and selling decisions."],
  ["03", "Find the right market", "Match available supply with buyer requirements."],
  ["04", "Complete the order", "Track offers, logistics and delivery to completion."],
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pb-24 lg:pt-7">
        <nav className="flex items-center justify-between border-b border-[#dfe8e1] pb-4" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17633a] text-sm font-black text-white shadow-sm">FP</span>
            <span><span className="block text-base font-extrabold tracking-tight text-[#142019]">FARMPLUG AI</span><span className="hidden text-[10px] font-semibold uppercase tracking-[.16em] text-[#647067] sm:block">Farm intelligence • Market connection</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/signin" className="rounded-xl px-3 py-2 text-sm font-semibold text-[#526058] no-underline hover:bg-white">Sign in</Link>
            <Link href="/onboarding/role-selection" className="rounded-xl bg-[#17633a] px-4 py-2.5 text-sm font-bold text-white no-underline shadow-sm">Get started</Link>
          </div>
        </nav>

        <div className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#cfe3d3] bg-[#eef6ef] px-3 py-1.5 text-xs font-bold text-[#17633a]">
              <span className="h-2 w-2 rounded-full bg-[#18794e]" /> Built for practical agriculture
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-[-.035em] text-[#142019] sm:text-6xl">From <span className="text-[#17633a]">farm intelligence</span> to a better market.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#647067] sm:text-lg sm:leading-8">FarmPlug AI connects farm operations, crop intelligence, produce supply, buyer demand, orders and logistics in one simple flow.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/onboarding/role-selection" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#17633a] px-6 text-sm font-extrabold text-white no-underline shadow-[0_10px_25px_rgba(23,99,58,.18)]">Start with FarmPlug AI →</Link>
              <Link href="/marketplace" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#dfe8e1] bg-white px-6 text-sm font-bold text-[#142019] no-underline shadow-sm">Explore marketplace</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#647067]">
              <span>✓ Farmer-first workflows</span><span>✓ Transparent recommendations</span><span>✓ Shared Supabase data</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-[#dff0e3]/70 blur-2xl" />
            <div className="rounded-[1.5rem] border border-[#dfe8e1] bg-white p-3 shadow-[0_20px_60px_rgba(20,32,25,.10)]">
              <div className="rounded-[1.15rem] bg-[#f4f8f4] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#647067]">Farm-to-market flow</p><p className="mt-1 text-xl font-extrabold text-[#142019]">One connected journey</p></div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#18794e] shadow-sm">LIVE WORKFLOW</span>
                </div>
                <div className="mt-5 space-y-2.5">
                  {["Farm & crop", "Crop intelligence", "Buyer demand", "Offer & order", "Logistics & delivery"].map((item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl border border-[#e7eee8] bg-white px-3.5 py-3 shadow-sm">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#17633a] text-xs font-black text-white">{index + 1}</span>
                      <span className="text-sm font-bold text-[#142019]">{item}</span>
                      {index < 4 && <span className="ml-auto text-xs font-bold text-[#18794e]">Next →</span>}
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl border border-[#cfe3d3] bg-[#eef6ef] p-3.5">
                  <p className="text-xs font-bold text-[#17633a]">Decision support</p>
                  <p className="mt-1 text-sm leading-5 text-[#526058]">Every AI recommendation is designed to show the reason, confidence and data status before action.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfe8e1] bg-white" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#17633a]">Everything connected</p><h2 id="features-heading" className="mt-2 text-3xl font-black tracking-tight text-[#142019]">Less switching. More clarity.</h2><p className="mt-3 text-sm leading-6 text-[#647067]">A consistent interface across farmer, buyer, FPO and admin workflows.</p></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(([title, text], index) => <article key={title} className="group rounded-2xl border border-[#dfe8e1] bg-[#fbfdfb] p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef6ef] text-sm font-black text-[#17633a]">0{index + 1}</div><h3 className="mt-5 font-extrabold text-[#142019]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#647067]">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-[1.5rem] border border-[#dfe8e1] bg-[#17633a] p-6 text-white shadow-[0_20px_60px_rgba(23,99,58,.16)] sm:p-9">
          <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#cfe3d3]">How it works</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">A simple path from farm to fulfilled order.</h2></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([number, title, text]) => <div key={number} className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"><span className="text-xs font-black text-[#cfe3d3]">{number}</span><h3 className="mt-4 font-extrabold">{title}</h3><p className="mt-1 text-sm leading-5 text-white/75">{text}</p></div>)}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#dfe8e1] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-sm text-[#647067] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><div><span className="font-extrabold text-[#142019]">FARMPLUG AI</span><span className="ml-2">Practical agricultural connectivity.</span></div><div className="flex gap-4"><Link href="/about" className="no-underline hover:text-[#17633a]">About</Link><Link href="/signin" className="no-underline hover:text-[#17633a]">Sign in</Link></div></div>
      </footer>
    </main>
  );
}
