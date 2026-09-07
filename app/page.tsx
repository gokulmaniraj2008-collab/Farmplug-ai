import Link from "next/link";
import { ArrowRight, Check, ChevronRight, Leaf, LineChart, MapPinned, MessageCircle, ShieldCheck, ShoppingBasket, Sparkles, Tractor, Truck, Users, Wheat } from "lucide-react";

const heroImage = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Farm_Field_(Unsplash).jpg";

const capabilities = [
  { icon: Leaf, title: "Crop health", text: "Track crop condition, observations and practical next steps." },
  { icon: LineChart, title: "Market intelligence", text: "See market signals and selling opportunities with clear data status." },
  { icon: ShoppingBasket, title: "Direct buyer connection", text: "Match produce with buyer requirements for quantity, quality and timing." },
  { icon: Truck, title: "Orders & logistics", text: "Follow accepted orders from aggregation and collection to delivery." },
];

const workflow = [
  ["My farm", "Add plots, crops and harvest information."],
  ["AI assistant", "Review crop, weather and market guidance."],
  ["Marketplace", "Find buyers or list available produce."],
  ["Orders", "Confirm offers and track fulfilment."],
  ["Delivery", "Keep collection and delivery status visible."],
];

const agricultureImages = [
  { src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Millet_crop_at_Asifabad.jpg", title: "Millet cultivation", text: "Open farm imagery from Asifabad, India.", source: "Wikimedia Commons · Kiran sidam · CC0" },
  { src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Paddy_Crop.jpg", title: "Paddy crop", text: "A close view of cultivated rice plants.", source: "Wikimedia Commons · Harsha099 · CC0" },
  { src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Paddy_field_image.jpg", title: "Paddy field", text: "Rice field imagery representing harvest-ready agriculture.", source: "Wikimedia Commons · Maina Tudu · CC0" },
  { src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cultivation_of_paddy_crops.jpg", title: "Paddy cultivation", text: "Recent open-source agricultural field imagery.", source: "Wikimedia Commons · Pradip paswan · CC0" },
];

const roles = [
  { icon: Tractor, title: "For Farmers", text: "Manage your farm, understand crop and market signals, find buyers and follow orders.", href: "/onboarding/role-selection" },
  { icon: Users, title: "For FPOs", text: "Coordinate farmers, aggregate produce, match demand and keep logistics organised.", href: "/onboarding/role-selection" },
  { icon: ShoppingBasket, title: "For Buyers", text: "Share requirements, discover suitable produce and manage offers and orders.", href: "/onboarding/role-selection" },
];

const trustPoints = [
  "Clear DEMO DATA and ESTIMATED labels",
  "Explainable recommendations with data status",
  "Role-based workspace permissions",
  "Secure authentication with Supabase",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7FAF7] text-[#172117]">
      <header className="sticky top-0 z-40 border-b border-[#DCE6DC] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#2E9E4F]/25 bg-[#EAF6ED] text-[#1E7A3D]"><Leaf size={21} /></span>
            <span><strong className="block text-base font-extrabold tracking-tight">FarmPlug AI</strong><small className="hidden text-xs font-medium text-[#647064] sm:block">From farm intelligence to the right market.</small></span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#526052] md:flex" aria-label="Main navigation">
            <Link href="/platform" className="no-underline hover:text-[#1E7A3D]">Platform</Link>
            <Link href="/ai" className="no-underline hover:text-[#1E7A3D]">AI</Link>
            <Link href="/marketplace" className="no-underline hover:text-[#1E7A3D]">Marketplace</Link>
            <Link href="/about" className="no-underline hover:text-[#1E7A3D]">About</Link>
            <Link href="/signin" className="no-underline hover:text-[#1E7A3D]">Sign in</Link>
          </nav>
          <Link href="/onboarding/role-selection" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2E9E4F] px-4 text-sm font-bold text-white no-underline shadow-sm hover:bg-[#268C45]">Get started <ArrowRight size={16} /></Link>
        </div>
      </header>

      <section className="border-b border-[#DCE6DC] bg-gradient-to-b from-white to-[#F7FAF7]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#BFDCC6] bg-[#EAF6ED] px-3 py-1.5 text-xs font-bold text-[#1E7A3D]"><Sparkles size={13} /> Built for everyday farming</div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-[-.04em] sm:text-6xl">Smart farming.<br /><span className="text-[#2E9E4F]">Better decisions.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#526052] sm:text-lg">FarmPlug AI brings farm management, crop intelligence, market access and buyer orders into one simple workflow for farmers, FPOs and buyers.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/onboarding/role-selection" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2E9E4F] px-6 text-sm font-extrabold text-white no-underline shadow-sm hover:bg-[#268C45]">Start with FarmPlug AI <ArrowRight size={17} /></Link><Link href="/marketplace" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#C9D8CA] bg-white px-6 text-sm font-bold text-[#234029] no-underline shadow-sm hover:border-[#8DBA96]"><ShoppingBasket size={17} /> Explore marketplace</Link></div>
            <div className="mt-8 grid gap-3 text-sm font-semibold text-[#526052] sm:grid-cols-3">{["Farmer-first workflows", "Explainable AI guidance", "Traceable orders"].map(item => <span key={item} className="inline-flex items-center gap-2"><Check size={15} className="text-[#2E9E4F]" /> {item}</span>)}</div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#DCE6DC] bg-white shadow-[0_18px_50px_rgba(31,58,35,.10)]">
            <div className="relative aspect-[4/3] overflow-hidden"><img src={heroImage} alt="Green agricultural farm field" className="h-full w-full object-cover" loading="eager" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-5 pt-16"><p className="text-xs font-bold uppercase tracking-wide text-white/85">Open-source farm imagery</p><p className="mt-1 text-sm font-semibold text-white">Real agricultural context for a farmer-first experience.</p></div></div>
            <div className="p-4 sm:p-5"><div className="rounded-xl border border-[#DCE6DC] bg-[#F8FBF8] p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold text-[#647064]">FarmPlug workflow</p><h2 className="mt-1 text-xl font-extrabold">From farm to buyer</h2></div><MapPinned className="text-[#C99A2E]" size={22} /></div><div className="mt-6 space-y-3">{workflow.map(([title, desc], i) => <div key={title} className="flex gap-3 rounded-xl border border-[#DCE6DC] bg-white p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#EAF6ED] text-sm font-extrabold text-[#1E7A3D]">{i + 1}</span><div><p className="font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-[#647064]">{desc}</p></div></div>)}</div></div><p className="mt-3 text-[11px] leading-5 text-[#6B756B]">Hero image: Farm Field by Arkadiusz Zet, via Wikimedia Commons, CC0.</p></div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#DCE6DC] bg-white"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end"><div><p className="text-sm font-bold text-[#8A6817]">Why FarmPlug AI?</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">One place to move from information to action.</h2></div><p className="max-w-2xl text-sm leading-7 text-[#647064] sm:text-base">Instead of keeping crop notes, market conversations and order updates in different places, FarmPlug connects the journey so every role can focus on its next useful action.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{capabilities.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-[#DCE6DC] bg-[#F8FBF8] p-5 shadow-sm"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EAF6ED] text-[#1E7A3D]"><Icon size={20} /></div><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#647064]">{text}</p></article>)}</div></div></section>

      <section className="border-b border-[#DCE6DC] bg-[#F7FAF7]"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="max-w-3xl"><p className="text-sm font-bold text-[#8A6817]">Built for every side of the market</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">A shared workflow, different workspaces.</h2><p className="mt-3 text-sm leading-6 text-[#647064] sm:text-base">Choose your role and FarmPlug guides you into the workspace that matches your day-to-day work.</p></div><div className="mt-8 grid gap-5 md:grid-cols-3">{roles.map(({ icon: Icon, title, text, href }) => <Link key={title} href={href} className="group rounded-2xl border border-[#DCE6DC] bg-white p-6 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-[#A8CDAF] hover:shadow-md"><div className="flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#EAF6ED] text-[#1E7A3D]"><Icon size={22} /></span><ChevronRight size={19} className="text-[#91A091] transition group-hover:translate-x-1 group-hover:text-[#1E7A3D]" /></div><h3 className="mt-5 text-lg font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#647064]">{text}</p><span className="mt-5 inline-flex text-sm font-bold text-[#1E7A3D]">Explore workspace <ArrowRight size={15} className="ml-1" /></span></Link>)}</div></div></section>

      <section className="border-b border-[#DCE6DC] bg-white"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-8 lg:grid-cols-2"><div className="rounded-2xl border border-[#DCE6DC] bg-[#F8FBF8] p-6 sm:p-8"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#EAF6ED] text-[#1E7A3D]"><Sparkles size={20} /></span><div><p className="text-xs font-bold uppercase tracking-wide text-[#8A6817]">AI intelligence</p><h2 className="text-2xl font-black">Recommendations you can understand.</h2></div></div><p className="mt-5 text-sm leading-7 text-[#647064]">FarmPlug is designed to show the recommendation, why it matters, confidence, data status and the action that needs your confirmation. Demo or calculated values are clearly labelled.</p><div className="mt-6 space-y-3">{["Market and price signals", "Demand and selling-window guidance", "Crop and farm decisions", "Buyer matching and fulfilment"].map(x => <div key={x} className="flex items-center gap-3 rounded-xl border border-[#DCE6DC] bg-white p-3 text-sm font-semibold"><Check size={16} className="text-[#2E9E4F]" /> {x}</div>)}</div><Link href="/ai" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1E7A3D] no-underline">Explore AI Intelligence <ArrowRight size={16} /></Link></div><div className="rounded-2xl border border-[#DCE6DC] bg-white p-6 sm:p-8"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFF9E8] text-[#8A6817]"><ShieldCheck size={20} /></span><div><p className="text-xs font-bold uppercase tracking-wide text-[#8A6817]">Trust & transparency</p><h2 className="text-2xl font-black">No hidden certainty.</h2></div></div><p className="mt-5 text-sm leading-7 text-[#647064]">FarmPlug separates real account actions from demo experiences and never presents estimated or simulated market information as guaranteed results.</p><div className="mt-6 space-y-3">{trustPoints.map(x => <div key={x} className="flex items-center gap-3 rounded-xl bg-[#F8FBF8] p-3 text-sm font-semibold"><Check size={16} className="text-[#2E9E4F]" /> {x}</div>)}</div></div></div></div></section>

      <section className="border-b border-[#DCE6DC] bg-[#F7FAF7]"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-center"><div><p className="text-sm font-bold text-[#8A6817]">From first visit to first action</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Start in a few simple steps.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-[#647064] sm:text-base">Choose a role, create or sign in to your secure account, complete your profile and land directly in the right workspace.</p><div className="mt-7 space-y-4">{[["01", "Choose your role", "Farmer, FPO or Buyer."], ["02", "Create or sign in", "Use secure FarmPlug authentication."], ["03", "Complete your profile", "Add the information needed for your workspace."], ["04", "Reach your dashboard", "Your role determines the tools and next actions you see."]].map(([n,t,d]) => <div key={n} className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EAF6ED] text-sm font-black text-[#1E7A3D]">{n}</span><div><p className="font-extrabold">{t}</p><p className="mt-1 text-sm text-[#647064]">{d}</p></div></div>)}</div></div><div className="rounded-2xl border border-[#DCE6DC] bg-white p-6 shadow-sm"><MessageCircle className="text-[#2E9E4F]" size={28} /><h3 className="mt-5 text-xl font-black">Simple like a conversation.</h3><p className="mt-2 text-sm leading-6 text-[#647064]">Short steps, clear actions, familiar navigation and useful information when you need it — without overwhelming the screen.</p><Link href="/onboarding/role-selection" className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2E9E4F] px-5 text-sm font-bold text-white no-underline">Get started <ArrowRight size={16} /></Link></div></div></div></section>

      <section className="border-b border-[#DCE6DC] bg-white"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold text-[#8A6817]">Open agriculture imagery</p><h2 className="mt-2 text-3xl font-black tracking-tight">Real crops. Real farming context.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#647064]">A growing image library using openly licensed agricultural photographs selected for FarmPlug's farmer-first experience.</p></div><span className="inline-flex w-fit rounded-full border border-[#BFDCC6] bg-[#F8FBF8] px-3 py-1.5 text-xs font-bold text-[#1E7A3D]">CC0 / public domain</span></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{agricultureImages.map(image => <article key={image.src} className="overflow-hidden rounded-2xl border border-[#DCE6DC] bg-white shadow-sm"><div className="aspect-[4/3] overflow-hidden bg-[#EAF6ED]"><img src={image.src} alt={image.title} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105" /></div><div className="p-4"><h3 className="font-extrabold">{image.title}</h3><p className="mt-1 text-sm leading-5 text-[#647064]">{image.text}</p><p className="mt-3 text-[11px] font-medium text-[#788178]">{image.source}</p></div></article>)}</div></div></section>

      <section className="bg-[#1E7A3D] text-white"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16"><div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-bold text-[#E4F3E7]">Ready to connect your farm to the market?</p><h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Start your FarmPlug AI workspace today.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#E4F3E7]">Choose your role and follow the guided onboarding. You can explore the platform before committing to a real workflow.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Link href="/onboarding/role-selection" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-extrabold text-[#1E7A3D] no-underline">Get started <ArrowRight size={17} /></Link><Link href="/demo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/40 px-6 text-sm font-bold text-white no-underline hover:bg-white/10">Try a demo</Link></div></div></div></section>

      <footer className="border-t border-[#DCE6DC] bg-[#F1F6F1]"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[#647064] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><div><span className="font-extrabold text-[#172117]">FarmPlug AI</span><span className="ml-2">From farm intelligence to the right market.</span></div><div className="flex flex-wrap gap-5"><Link href="/privacy" className="no-underline hover:text-[#1E7A3D]">Privacy</Link><Link href="/terms" className="no-underline hover:text-[#1E7A3D]">Terms</Link><Link href="/contact" className="no-underline hover:text-[#1E7A3D]">Contact</Link><Link href="/signin" className="no-underline hover:text-[#1E7A3D]">Sign in</Link></div></div></footer>
    </main>
  );
}
