import Link from "next/link";
import { ArrowRight, Check, Leaf, LineChart, MapPinned, ShoppingBasket, Sparkles, Truck } from "lucide-react";

const capabilities = [
  { icon: Leaf, title: "Crop health", text: "Track crop condition, observations and practical next steps." },
  { icon: LineChart, title: "Market intelligence", text: "See market signals and selling opportunities with clear data status." },
  { icon: ShoppingBasket, title: "Direct buyer connection", text: "Match produce with buyer requirements for quantity, quality and timing." },
  { icon: Truck, title: "Orders & logistics", text: "Follow accepted orders from aggregation and collection to delivery." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F0]">
      <header className="border-b border-[#303330] bg-[#0B0B0B]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#2E9E4F]/40 bg-[#2E9E4F]/12 text-[#72D68C]"><Leaf size={21} /></span>
            <span><strong className="block text-base font-extrabold tracking-tight">FarmPlug AI</strong><small className="hidden text-xs text-[#A7ACA7] sm:block">Smart farming. Better decisions. Greater yields.</small></span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#A7ACA7] md:flex" aria-label="Main navigation">
            <Link href="/marketplace" className="no-underline hover:text-white">Marketplace</Link>
            <Link href="/about" className="no-underline hover:text-white">About</Link>
            <Link href="/signin" className="no-underline hover:text-white">Sign in</Link>
          </nav>
          <Link href="/onboarding/role-selection" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2E9E4F] px-4 text-sm font-bold text-white no-underline hover:bg-[#39AC5A]">Get started <ArrowRight size={16} /></Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2E9E4F]/30 bg-[#2E9E4F]/10 px-3 py-1.5 text-xs font-bold text-[#72D68C]"><Sparkles size={13} /> Built for everyday farming</div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-[-.04em] sm:text-6xl">Smart farming.<br /><span className="text-[#2E9E4F]">Better decisions.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#A7ACA7] sm:text-lg">FarmPlug AI brings farm management, crop intelligence, market access and buyer orders into one simple workflow for farmers, FPOs and buyers.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/onboarding/role-selection" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2E9E4F] px-6 text-sm font-extrabold text-white no-underline">Start with FarmPlug AI <ArrowRight size={17} /></Link>
            <Link href="/marketplace" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#303330] bg-[#151715] px-6 text-sm font-bold text-white no-underline hover:border-[#2E9E4F]/50"><ShoppingBasket size={17} /> Explore marketplace</Link>
          </div>
          <div className="mt-8 grid gap-3 text-sm font-semibold text-[#A7ACA7] sm:grid-cols-3">
            {['Farmer-first workflows','Explainable AI guidance','Traceable orders'].map((item) => <span key={item} className="inline-flex items-center gap-2"><Check size={15} className="text-[#2E9E4F]" /> {item}</span>)}
          </div>
        </div>

        <div className="rounded-2xl border border-[#303330] bg-[#151715] p-4 shadow-[0_18px_50px_rgba(0,0,0,.28)] sm:p-5">
          <div className="rounded-xl border border-[#303330] bg-[#0F110F] p-5 sm:p-6">
            <div className="flex items-start justify-between"><div><p className="text-xs font-semibold text-[#A7ACA7]">FarmPlug workflow</p><h2 className="mt-1 text-xl font-extrabold">From farm to buyer</h2></div><MapPinned className="text-[#D6AD45]" size={22} /></div>
            <div className="mt-6 space-y-3">
              {[['My farm','Add plots, crops and harvest information.'],['AI assistant','Review crop, weather and market guidance.'],['Marketplace','Find buyers or list available produce.'],['Orders','Confirm offers and track fulfilment.'],['Delivery','Keep collection and delivery status visible.']].map(([title,desc], i) => <div key={title} className="flex gap-3 rounded-xl border border-[#303330] bg-[#151715] p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#2E9E4F]/15 text-sm font-extrabold text-[#72D68C]">{i+1}</span><div><p className="font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-[#A7ACA7]">{desc}</p></div></div>)}
            </div>
            <div className="mt-4 rounded-xl border border-[#D6AD45]/25 bg-[#D6AD45]/8 p-4"><p className="text-sm font-bold text-[#D6AD45]">Trust by design</p><p className="mt-1 text-xs leading-5 text-[#A7ACA7]">Simulated values are labelled and recommendations explain their data status.</p></div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#303330] bg-[#111311]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="max-w-2xl"><p className="text-sm font-bold text-[#D6AD45]">One connected platform</p><h2 className="mt-2 text-3xl font-black tracking-tight">Everything a farm needs to make the next decision.</h2><p className="mt-3 text-sm leading-6 text-[#A7ACA7] sm:text-base">Simple enough for everyday use, structured enough to keep farm, market and order information connected.</p></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(({icon: Icon,title,text}) => <article key={title} className="rounded-2xl border border-[#303330] bg-[#151715] p-5"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#2E9E4F]/12 text-[#72D68C]"><Icon size={20}/></div><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#A7ACA7]">{text}</p></article>)}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#303330] bg-[#0B0B0B]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[#707670] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><div><span className="font-extrabold text-white">FarmPlug AI</span><span className="ml-2">From farm intelligence to the right market.</span></div><div className="flex gap-5"><Link href="/privacy" className="no-underline hover:text-white">Privacy</Link><Link href="/terms" className="no-underline hover:text-white">Terms</Link><Link href="/signin" className="no-underline hover:text-white">Sign in</Link></div></div>
      </footer>
    </main>
  );
}
