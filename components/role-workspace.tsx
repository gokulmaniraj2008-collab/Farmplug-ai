import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Boxes,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  MapPinned,
  PackageCheck,
  Settings,
  ShoppingBasket,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";

const roleNav: Record<string, { label: string; href: string }[]> = {
  farmer: [
    { label: "Dashboard", href: "/farmer" }, { label: "My Farm", href: "/farmer/farm" }, { label: "Crops", href: "/farmer/crops" },
    { label: "Market", href: "/farmer/marketplace" }, { label: "AI", href: "/farmer/intelligence" }, { label: "Listings", href: "/farmer/listings" },
    { label: "Offers", href: "/farmer/offers" }, { label: "Orders", href: "/farmer/orders" }, { label: "Notifications", href: "/farmer/notifications" }, { label: "Settings", href: "/farmer/settings" },
  ],
  buyer: [
    { label: "Overview", href: "/buyer" }, { label: "Requirements", href: "/buyer/requirements" }, { label: "Recommended Supply", href: "/buyer/matches" },
    { label: "Aggregated Lots", href: "/buyer/logistics" }, { label: "Offers", href: "/buyer/offers" }, { label: "Orders", href: "/buyer/orders" },
    { label: "Logistics", href: "/buyer/logistics" }, { label: "Notifications", href: "/buyer/notifications" }, { label: "Profile", href: "/buyer/settings" }, { label: "Settings", href: "/buyer/settings" },
  ],
  fpo: [
    { label: "Overview", href: "/fpo" }, { label: "Farmers", href: "/fpo/farmers" }, { label: "Supply", href: "/fpo/supply" },
    { label: "Aggregation", href: "/fpo/aggregation" }, { label: "Collection Centers", href: "/fpo/collection-centers" }, { label: "Logistics", href: "/fpo/logistics" },
    { label: "Orders", href: "/fpo/orders" }, { label: "Notifications", href: "/fpo/notifications" }, { label: "Settings", href: "/fpo/settings" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin" }, { label: "Users", href: "/admin/users" }, { label: "Marketplace", href: "/admin/listings" },
    { label: "Orders", href: "/admin/orders" }, { label: "Logistics", href: "/admin/logistics" }, { label: "AI", href: "/admin/ai" },
    { label: "Reports", href: "/admin/reports" }, { label: "Audit", href: "/admin/audit" }, { label: "Settings", href: "/admin/settings" },
  ],
};

const titles: Record<string, string> = {
  farmer: "Farmer Workspace", buyer: "Buyer Workspace", fpo: "FPO Workspace", admin: "Admin Workspace",
};

const buyerCards = [
  { label: "Requirements", href: "/buyer/requirements", icon: ClipboardList, text: "Create and manage the crops, quantities, quality and delivery windows you need." },
  { label: "Recommended supply", href: "/buyer/matches", icon: Sparkles, text: "Review supply matched to your sourcing needs instead of searching a generic catalogue." },
  { label: "Aggregated lots", href: "/buyer/logistics", icon: Boxes, text: "Track grouped farmer supply and move suitable lots toward fulfilment." },
  { label: "Offers", href: "/buyer/offers", icon: ShoppingBasket, text: "Review commercial offers and keep negotiation activity in one place." },
  { label: "Orders", href: "/buyer/orders", icon: PackageCheck, text: "Follow confirmed orders from acceptance through delivery." },
  { label: "Logistics", href: "/buyer/logistics", icon: Truck, text: "Coordinate collection, transport and delivery milestones." },
];

function BuyerWorkspace({ keyPath }: { keyPath: string }) {
  const isOverview = !keyPath;
  const active = keyPath || "overview";
  const heading = active === "overview"
    ? "Source with confidence"
    : active.split("/").map((part) => part.replace(/-/g, " ")).join(" / ");

  return (
    <main className="min-h-screen bg-[#07130D] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-[#0E2019]/80 p-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#E3B341] text-[#07130D]"><LeafMark /></span>
              FarmPlug AI
            </Link>
            <Link href="/buyer/notifications" aria-label="Notifications" className="rounded-xl border border-white/10 p-2 text-white/70 transition hover:bg-white/5 hover:text-white">
              <Bell className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-3 text-sm text-white/50">Buyer workspace</p>
          <nav aria-label="Buyer navigation" className="mt-7 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {roleNav.buyer.map((item) => {
              const selected = item.href === "/buyer" ? isOverview : keyPath && item.href.replace("/buyer/", "") === keyPath;
              return (
                <Link key={item.href + item.label} href={item.href} className={`rounded-xl px-3 py-2.5 text-sm transition ${selected ? "bg-[#E3B341]/15 text-[#E3B341] ring-1 ring-[#E3B341]/25" : "text-white/65 hover:bg-white/5 hover:text-white"}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 lg:block">
            <p className="text-xs font-medium text-[#7FD79B]">Buyer flow</p>
            <p className="mt-2 text-sm leading-6 text-white/60">Requirement → matched supply → offer → order → delivery.</p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-white/45">Buyer workspace</p>
              <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">A sourcing workspace built around traceable supply, clear commercial steps and practical fulfilment.</p>
            </div>
            <Link href="/buyer/requirements/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#E3B341] px-4 py-2.5 text-sm font-semibold text-[#07130D] shadow-[0_12px_35px_rgba(227,179,65,0.18)] transition hover:-translate-y-0.5">
              New requirement <ArrowRight className="h-4 w-4" />
            </Link>
          </header>

          {isOverview ? (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric icon={ClipboardList} label="Open requirements" value="Start sourcing" detail="Create your first requirement" />
                <Metric icon={Sparkles} label="Recommended supply" value="Ready to review" detail="Matched supply appears here" />
                <Metric icon={PackageCheck} label="Active orders" value="Track here" detail="Confirmed orders and status" />
                <Metric icon={Truck} label="Delivery" value="Connected" detail="Plan fulfilment milestones" />
              </section>

              <section className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-7">
                  <div className="flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#7FD79B]/10 text-[#7FD79B]"><LayoutDashboard className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-medium text-[#7FD79B]">Your sourcing command center</p>
                      <h2 className="mt-1 text-2xl font-semibold">Build the requirement first.</h2>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">FarmPlug can keep the sourcing journey structured: what you need, which supply fits, what you offered, and what happens after acceptance.</p>
                    </div>
                  </div>
                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    <Step icon={ClipboardList} title="Define" text="Crop, volume, quality and timing." />
                    <Step icon={Users} title="Match" text="Compare suitable supply." />
                    <Step icon={CheckCircle2} title="Fulfil" text="Move accepted orders to delivery." />
                  </div>
                </div>
                <div className="rounded-3xl border border-[#E3B341]/20 bg-[#E3B341]/[0.07] p-5 sm:p-7">
                  <MapPinned className="h-5 w-5 text-[#E3B341]" />
                  <h2 className="mt-4 text-xl font-semibold">Traceable by design</h2>
                  <p className="mt-2 text-sm leading-6 text-white/60">Keep location, supply, commercial decisions and fulfilment context visible as a requirement moves through the workspace.</p>
                  <Link href="/buyer/requirements" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#E3B341]">View requirements <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </section>

              <section className="mt-6">
                <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-sm text-white/45">Workspace modules</p><h2 className="mt-1 text-2xl font-semibold">Everything in the sourcing loop</h2></div></div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {buyerCards.map((card) => <FeatureCard key={card.href} {...card} />)}
                </div>
              </section>
            </>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-8">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E3B341]/10 text-[#E3B341]"><Sparkles className="h-5 w-5" /></div>
              <h2 className="mt-5 text-2xl font-semibold capitalize">{heading}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">This buyer module is now on the shared FarmPlug workspace shell. The next implementation pass can connect its existing Supabase data and actions without creating a second navigation system.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/buyer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-medium hover:bg-white/5"><ArrowRight className="h-4 w-4 rotate-180" /> Overview</Link>
                <Link href="/buyer/settings" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-medium hover:bg-white/5"><Settings className="h-4 w-4" /> Settings</Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof ClipboardList; label: string; value: string; detail: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><Icon className="h-5 w-5 text-[#7FD79B]" /><p className="mt-5 text-xs text-white/45">{label}</p><p className="mt-1 text-lg font-semibold">{value}</p><p className="mt-1 text-xs leading-5 text-white/45">{detail}</p></div>;
}

function Step({ icon: Icon, title, text }: { icon: typeof ClipboardList; title: string; text: string }) {
  return <div className="rounded-2xl border border-white/10 bg-black/10 p-4"><Icon className="h-4 w-4 text-[#E3B341]" /><p className="mt-3 text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-white/45">{text}</p></div>;
}

function FeatureCard({ label, href, icon: Icon, text }: { label: string; href: string; icon: typeof ClipboardList; text: string }) {
  return <Link href={href} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"><div className="flex items-center justify-between gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#7FD79B]/10 text-[#7FD79B]"><Icon className="h-5 w-5" /></div><ArrowRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-[#E3B341]" /></div><h3 className="mt-5 text-base font-semibold">{label}</h3><p className="mt-2 text-sm leading-6 text-white/50">{text}</p></Link>;
}

function LeafMark() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8" aria-hidden="true"><path d="M20 4C12 4 6 7.5 5 14c-.3 2 .4 4 2 5 1.4.8 3.1.7 4.5-.1C17 15.8 19.6 10.7 20 4Z" /><path d="M5.5 18.5C9 14.5 12 11.5 17 8.5" /></svg>;
}

export default function RoleWorkspace({ role, slug }: { role: string; slug: string[] }) {
  if (role === "buyer") return <BuyerWorkspace keyPath={slug.join("/")} />;

  const nav = roleNav[role] ?? [];
  const key = slug.join("/");
  const title = key ? key.split("/").map((s) => s.replace(/-/g, " ")).join(" / ") : "Dashboard";
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        <aside className="border-b border-border p-4 md:w-64 md:border-b-0 md:border-r md:p-6">
          <Link href="/" className="text-xl font-bold tracking-tight">FarmPlug AI</Link>
          <p className="mt-1 text-xs text-muted-foreground">{titles[role]}</p>
          <nav className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-1">
            {nav.map((item) => <Link key={item.href + item.label} href={item.href} className="rounded-xl border border-border px-3 py-2 text-sm hover:bg-muted">{item.label}</Link>)}
          </nav>
        </aside>
        <section className="flex-1 p-5 md:p-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div><p className="text-sm text-muted-foreground">{titles[role]}</p><h1 className="mt-1 text-3xl font-bold capitalize">{title}</h1></div>
            <Link href="/" className="rounded-xl border border-border px-4 py-2 text-sm">Home</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border p-5"><p className="text-sm text-muted-foreground">Workspace</p><h2 className="mt-2 text-xl font-semibold">{title}</h2><p className="mt-2 text-sm text-muted-foreground">Connected to the FarmPlug role workflow.</p></div>
            <div className="rounded-2xl border border-border p-5"><p className="text-sm text-muted-foreground">Status</p><h2 className="mt-2 text-xl font-semibold">Ready</h2><p className="mt-2 text-sm text-muted-foreground">Use the navigation to continue through this workspace.</p></div>
            <div className="rounded-2xl border border-border p-5"><p className="text-sm text-muted-foreground">Path</p><h2 className="mt-2 break-all text-xl font-semibold">/{role}{key ? `/${key}` : ""}</h2></div>
          </div>
        </section>
      </div>
    </main>
  );
}
