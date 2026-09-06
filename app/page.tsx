import Link from "next/link";
import { ArrowRight, Check, CircleDot, Cpu, Leaf, LineChart, MapPinned, ShoppingBasket, Sparkles, Truck, Waves } from "lucide-react";

const capabilities = [
  { icon: Leaf, title: "Crop health", text: "Capture observations and turn crop signals into clear, explainable decision support." },
  { icon: LineChart, title: "Market intelligence", text: "Compare market signals, demand and selling-window guidance with visible data status." },
  { icon: ShoppingBasket, title: "Buyer matching", text: "Match farmer supply with buyer requirements for quantity, quality, location and delivery." },
  { icon: Truck, title: "Aggregation & logistics", text: "Build traceable lots and move accepted orders through collection, transit and delivery." },
];

const steps = [
  ["Set up your farm", "Add farm, crop, harvest and storage details."],
  ["Understand your crop", "Review crop-health observations and decision support."],
  ["Find the right market", "Compare demand and match supply with buyer requirements."],
  ["Complete the order", "Move from offer to aggregation, logistics and delivery."],
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07130D] text-[#F4F7F2]">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#E3B341]/10 blur-3xl" />
        <div className="absolute right-[-8rem] top-48 h-96 w-96 rounded-full bg-[#7FD79B]/10 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-6 lg:px-8 lg:pb-28 lg:pt-7">
        <nav className="flex items-center justify-between border-b border-white/10 pb-4" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E3B341]/30 bg-[#E3B341]/10 text-[#E3B341]"><Leaf size={20} strokeWidth={2.2} /></span>
            <span><span className="block text-base font-extrabold tracking-tight">FARMPLUG AI</span><span className="hidden text-[10px] font-medium tracking-[.12em] text-white/50 sm:block">Farm intelligence · Market connection</span></span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/signin" className="rounded-xl px-3 py-2 text-sm font-semibold text-white/70 no-underline hover:bg-white/5 hover:text-white">Sign in</Link>
            <Link href="/onboarding/role-selection" className="inline-flex items-center gap-2 rounded-xl bg-[#E3B341] px-4 py-2.5 text-sm font-bold text-[#07130D] no-underline shadow-[0_10px_35px_rgba(227,179,65,.16)] hover:bg-[#efc75e]">Get started <ArrowRight size={16} /></Link>
          </div>
        </nav>

        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7FD79B]/20 bg-[#7FD79B]/[.06] px-3.5 py-2 text-xs font-semibold text-[#A9E5B8]"><CircleDot size={13} /> One connected agriculture workflow</div>
            <h1 className="max-w-4xl text-5xl font-black leading-[.98] tracking-[-.045em] sm:text-6xl lg:text-7xl">Grow smarter.<br /><span className="text-[#E3B341]">Sell with confidence.</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">FarmPlug AI connects farm data, crop intelligence, market demand, buyer matching, orders and logistics in one farmer-first ecosystem.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/onboarding/role-selection" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E3B341] px-6 text-sm font-extrabold text-[#07130D] no-underline shadow-[0_12px_35px_rgba(227,179,65,.15)]">Start with FarmPlug AI <ArrowRight size={17} /></Link>
              <Link href="/marketplace" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-6 text-sm font-bold text-white no-underline backdrop-blur-xl hover:bg-white/[.07]"><ShoppingBasket size={17} /> Explore marketplace</Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-white/50"><span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[#7FD79B]" /> Farmer-first workflows</span><span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[#7FD79B]" /> Explainable recommendations</span><span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[#7FD79B]" /> Shared data ecosystem</span></div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-[2rem] bg-[#7FD79B]/10 blur-3xl" />
            <div className="relative rounded-[1.6rem] border border-white/10 bg-white/[.045] p-3 shadow-[0_30px_90px_rgba(0,0,0,.35)] backdrop-blur-2xl">
              <div className="rounded-[1.25rem] border border-white/10 bg-[#0E2019] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold text-white/45">Farm-to-market journey</p><p className="mt-1 text-xl font-extrabold">One connected flow</p></div><Sparkles size={19} className="text-[#E3B341]" /></div>
                <div className="mt-6 space-y-2.5">
                  {[{ label: "Farm & crop", icon: Leaf }, { label: "Crop health & intelligence", icon: Cpu }, { label: "Buyer demand", icon: LineChart }, { label: "Offer & order", icon: ShoppingBasket }, { label: "Aggregation & logistics", icon: Truck }].map(({ label, icon: Icon }, index) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-white/[.035] px-3.5 py-3.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#7FD79B]/10 text-[#A9E5B8]"><Icon size={17} /></span><span className="text-sm font-bold">{label}</span>{index < 4 && <ArrowRight size={14} className="ml-auto text-white/25" />}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex gap-3 rounded-xl border border-[#E3B341]/20 bg-[#E3B341]/[.06] p-4"><Waves size={18} className="mt-0.5 shrink-0 text-[#E3B341]" /><div><p className="text-xs font-bold text-[#E3B341]">Trust by design</p><p className="mt-1 text-sm leading-5 text-white/55">Recommendations show reason, confidence and data status. Simulated values are explicitly labelled.</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[.08] bg-[#0E2019]/70" aria-labelledby="capabilities-heading">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl"><p className="text-sm font-semibold text-[#E3B341]">Built around the farm</p><h2 id="capabilities-heading" className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Intelligence that connects decisions to outcomes.</h2><p className="mt-4 text-sm leading-6 text-white/50 sm:text-base">From the first crop observation to the final delivery, every step belongs to one workflow.</p></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-white/[.08] bg-white/[.035] p-5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/[.055]"><div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#7FD79B]/20 bg-[#7FD79B]/[.07] text-[#A9E5B8]"><Icon size={20} /></div><h3 className="mt-6 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/50">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="rounded-[1.6rem] border border-white/10 bg-white/[.04] p-6 backdrop-blur-xl sm:p-9 lg:p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-2xl"><p className="text-sm font-semibold text-[#CE7C3B]">How it works</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">A clear path from farm to fulfilled order.</h2></div><MapPinned className="hidden text-[#7FD79B] sm:block" size={28} /></div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([title, text], index) => <div key={title} className="rounded-xl border border-white/[.07] bg-[#0E2019]/80 p-5"><span className="text-xs font-bold text-[#E3B341]">{index + 1}</span><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-5 text-white/50">{text}</p></div>)}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[.08] bg-[#07130D]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><div><span className="font-extrabold text-white">FARMPLUG AI</span><span className="ml-2">From farm intelligence to the right market.</span></div><div className="flex gap-5"><Link href="/about" className="no-underline hover:text-white">About</Link><Link href="/signin" className="no-underline hover:text-white">Sign in</Link></div></div>
      </footer>
    </main>
  );
}
