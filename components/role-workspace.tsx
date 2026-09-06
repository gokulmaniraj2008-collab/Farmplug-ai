import Link from "next/link";

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

export default function RoleWorkspace({ role, slug }: { role: string; slug: string[] }) {
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
