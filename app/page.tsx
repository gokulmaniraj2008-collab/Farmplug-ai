import Link from "next/link";
import { ArrowRight, Bookmark, ChevronRight, Heart, Leaf, MapPin, MessageCircle, Search, Share2, Sparkles, Tractor, TrendingUp, Users, Wheat } from "lucide-react";

const heroImage = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Farm_Field_(Unsplash).jpg";
const images = [
  { src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Millet_crop_at_Asifabad.jpg", title: "Millet farming", meta: "Asifabad · India" },
  { src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Paddy_Crop.jpg", title: "Paddy crop", meta: "Rice cultivation" },
  { src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Paddy_field_image.jpg", title: "Paddy fields", meta: "Harvest season" },
  { src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cultivation_of_paddy_crops.jpg", title: "Paddy cultivation", meta: "Open farm imagery" },
];

const roles = [
  { icon: Tractor, title: "Farmer", text: "Manage crops, understand markets and find buyers.", href: "/onboarding/role-selection" },
  { icon: Users, title: "FPO", text: "Aggregate produce and coordinate farmers and orders.", href: "/onboarding/role-selection" },
  { icon: Wheat, title: "Buyer", text: "Discover produce and manage requirements and offers.", href: "/onboarding/role-selection" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F7F2] text-[#182119]">
      <style jsx>{`
        @keyframes farmplugImageScroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 6px)); }
        }
        .farmplug-image-track {
          width: max-content;
          animation: farmplugImageScroll 28s linear infinite;
          will-change: transform;
        }
        .farmplug-image-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .farmplug-image-track {
            animation: none;
          }
        }
      `}</style>
      <header className="sticky top-0 z-50 border-b border-[#DDE4D9] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-2.5 no-underline">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#E7F2E8] text-[#247A3D]"><Leaf size={20} /></span>
            <span className="truncate text-base font-black tracking-tight">FarmPlug AI</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-[#5E685F] md:flex">
            <Link href="/platform" className="no-underline hover:text-[#247A3D]">Platform</Link>
            <Link href="/ai" className="no-underline hover:text-[#247A3D]">AI</Link>
            <Link href="/marketplace" className="no-underline hover:text-[#247A3D]">Marketplace</Link>
            <Link href="/about" className="no-underline hover:text-[#247A3D]">About</Link>
          </nav>
          <Link href="/signin" className="hidden text-sm font-bold text-[#247A3D] no-underline sm:block">Sign in</Link>
          <Link href="/onboarding/role-selection" className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#2F8D48] px-4 text-xs font-black text-white no-underline shadow-sm">Get started <ArrowRight size={14} /></Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[26px] bg-white shadow-[0_10px_35px_rgba(35,65,38,.10)]">
          <div className="relative min-h-[470px] overflow-hidden sm:min-h-[560px]">
            <img src={heroImage} alt="Green agricultural field at sunrise" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102414]/80 via-[#102414]/20 to-transparent" />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-extrabold text-[#1E6735] shadow-sm backdrop-blur sm:left-6 sm:top-6">
              <Sparkles size={14} /> Farm intelligence for everyday decisions
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
              <div className="max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[.16em] text-[#E7D18A]">From farm intelligence to the right market.</p>
                <h1 className="mt-3 text-4xl font-black leading-[1.02] tracking-[-.04em] text-white sm:text-6xl">Grow smarter.<br />Sell with confidence.</h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/85 sm:text-base">FarmPlug AI connects your farm, crop decisions, market signals, buyers and orders in one simple experience.</p>
                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                  <Link href="/onboarding/role-selection" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-black text-[#247A3D] no-underline shadow-sm">Start with FarmPlug AI <ArrowRight size={17} /></Link>
                  <Link href="/marketplace" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/15 px-6 text-sm font-bold text-white no-underline backdrop-blur hover:bg-white/25"><Search size={17} /> Explore market</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 -mt-1 px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-full border border-[#D9E2D7] bg-white p-2 shadow-[0_8px_24px_rgba(25,50,30,.10)]">
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#EEF6EE] text-[#2F8D48]"><Search size={18} /></div>
              <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-[#9AA39A]">Search crops, buyers, market signals...</p></div>
              <Link href="/marketplace" className="hidden rounded-full bg-[#2F8D48] px-4 py-2.5 text-xs font-black text-white no-underline sm:block">Explore</Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-[.15em] text-[#B18422]">Your farm story</p><h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Everything useful, in one place.</h2></div>
            <Link href="/platform" className="hidden items-center gap-1 text-sm font-bold text-[#247A3D] no-underline sm:flex">See platform <ChevronRight size={16} /></Link>
          </div>

          <article className="mt-6 overflow-hidden rounded-[24px] border border-[#DDE4D9] bg-white shadow-sm">
            <div className="grid md:grid-cols-[.9fr_1.1fr]">
              <div className="relative min-h-[250px] md:min-h-full"><img src={images[0].src} alt={images[0].title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-black text-[#247A3D]">FIELD NOTE</span></div>
              <div className="p-5 sm:p-7">
                <div className="flex items-center gap-2 text-xs font-bold text-[#7A847A]"><span className="grid size-8 place-items-center rounded-full bg-[#EAF4EA] text-[#247A3D]"><Leaf size={15} /></span> FarmPlug AI · Open agriculture imagery</div>
                <h3 className="mt-5 text-2xl font-black leading-tight">Turn farm information into your next best action.</h3>
                <p className="mt-3 text-sm leading-6 text-[#657065]">Track crops, review market intelligence, discover matching buyers and keep accepted orders moving without switching between disconnected tools.</p>
                <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-[#EEF6EE] px-3 py-1.5 text-xs font-bold text-[#26753C]">Crop health</span><span className="rounded-full bg-[#FFF7DF] px-3 py-1.5 text-xs font-bold text-[#8A6817]">Market signals</span><span className="rounded-full bg-[#F1F4F0] px-3 py-1.5 text-xs font-bold text-[#5E685F]">Buyer matching</span></div>
                <div className="mt-6 flex items-center gap-5 border-t border-[#E6EBE4] pt-4 text-[#6C756C]"><span className="inline-flex items-center gap-1.5 text-xs font-bold"><Heart size={17} /> Useful</span><span className="inline-flex items-center gap-1.5 text-xs font-bold"><MessageCircle size={17} /> Discuss</span><span className="inline-flex items-center gap-1.5 text-xs font-bold"><Share2 size={17} /> Share</span><span className="ml-auto"><Bookmark size={18} /></span></div>
              </div>
            </div>
          </article>
        </section>

        <section className="mx-auto max-w-6xl pb-12 sm:pb-16">
          <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.15em] text-[#B18422]">What you can do</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">Explore FarmPlug</h2></div><Link href="/ai" className="inline-flex items-center gap-1 text-sm font-bold text-[#247A3D] no-underline">AI Center <ChevronRight size={16} /></Link></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[{icon:Leaf,title:"Manage your farm",text:"Keep farm and crop information organised."},{icon:TrendingUp,title:"Read the market",text:"See price and demand signals with clear status."},{icon:Users,title:"Find the right buyer",text:"Match produce by quantity, quality and timing."},{icon:MapPin,title:"Follow the journey",text:"Keep orders, collection and delivery visible."}].map(({icon:Icon,title,text}) => <Link key={title} href="/platform" className="group rounded-[20px] border border-[#DDE4D9] bg-white p-5 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><span className="grid size-11 place-items-center rounded-full bg-[#EAF4EA] text-[#247A3D]"><Icon size={20} /></span><h3 className="mt-4 font-black">{title}</h3><p className="mt-1.5 text-sm leading-5 text-[#6A746A]">{text}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-[#247A3D]">Open <ArrowRight size={13} /></span></Link>)}
          </div>
        </section>

        <section className="mx-auto max-w-6xl pb-12 sm:pb-16">
          <div className="flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[.15em] text-[#B18422]">Choose your path</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">Made for the whole market.</h2></div></div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">{roles.map(({icon:Icon,title,text,href}) => <Link key={title} href={href} className="group flex items-start gap-4 rounded-[20px] border border-[#DDE4D9] bg-white p-5 no-underline shadow-sm hover:border-[#AFCBAF] hover:shadow-md"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#EAF4EA] text-[#247A3D]"><Icon size={22} /></span><span className="min-w-0"><span className="flex items-center gap-2 font-black">For {title}<ChevronRight size={15} className="text-[#8C988C] transition group-hover:translate-x-1" /></span><span className="mt-1 block text-sm leading-5 text-[#697369]">{text}</span></span></Link>)}</div>
        </section>

        <section className="mx-auto max-w-6xl overflow-hidden pb-12 sm:pb-16" aria-label="Agriculture image gallery">
          <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.15em] text-[#B18422]">Inside the field</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">Agriculture, presented simply.</h2></div><span className="hidden text-xs font-bold text-[#788278] sm:block">Auto-scrolling gallery · hover to pause</span></div>
          <div className="relative mt-5 overflow-hidden rounded-[24px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#F5F7F2] to-transparent sm:w-16" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#F5F7F2] to-transparent sm:w-16" />
            <div className="farmplug-image-track flex gap-3 pr-3">
              {[...images, ...images].map((item, index) => (
                <article key={`${item.title}-${index}`} className="w-[250px] shrink-0 overflow-hidden rounded-[20px] border border-[#DDE4D9] bg-white shadow-sm sm:w-[290px]">
                  <div className="aspect-[1.25] overflow-hidden"><img src={item.src} alt={item.title} className="h-full w-full object-cover" loading="lazy" /></div>
                  <div className="p-4"><h3 className="text-sm font-black">{item.title}</h3><p className="mt-1 text-xs text-[#798379]">{item.meta}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl overflow-hidden rounded-[26px] bg-[#2F8D48] px-5 py-10 text-center shadow-[0_14px_40px_rgba(47,141,72,.22)] sm:px-8 sm:py-14">
          <p className="text-xs font-black uppercase tracking-[.16em] text-[#DDEEDC]">Your next step</p><h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Ready to connect your farm to the market?</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/80">Choose your role and build your FarmPlug workspace in a few simple steps.</p><div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row"><Link href="/onboarding/role-selection" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-black text-[#247A3D] no-underline">Get started <ArrowRight size={16} /></Link><Link href="/demo" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-6 text-sm font-bold text-white no-underline">Try a demo</Link></div>
        </section>
      </div>

      <footer className="mt-4 border-t border-[#DDE4D9] bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 text-xs text-[#758075] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><div><span className="font-black text-[#263229]">FarmPlug AI</span><span className="ml-2">From farm intelligence to the right market.</span></div><div className="flex flex-wrap gap-4"><Link href="/privacy" className="no-underline hover:text-[#247A3D]">Privacy</Link><Link href="/terms" className="no-underline hover:text-[#247A3D]">Terms</Link><Link href="/contact" className="no-underline hover:text-[#247A3D]">Contact</Link><Link href="/signin" className="font-bold text-[#247A3D] no-underline">Sign in</Link></div></div></footer>
    </main>
  );
}
