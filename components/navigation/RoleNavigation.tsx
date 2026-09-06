"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "farmer" | "buyer" | "fpo" | "admin";

type Item = { href: string; label: string; icon: string };

const config: Record<Role, { title: string; items: Item[] }> = {
  farmer: {
    title: "Farmer",
    items: [
      { href: "/dashboard/farmer", label: "Home", icon: "⌂" },
      { href: "/dashboard/farmer/farm", label: "Farm", icon: "🌱" },
      { href: "/dashboard/farmer/intelligence", label: "AI", icon: "✦" },
      { href: "/dashboard/farmer/listings", label: "Market", icon: "🛒" },
      { href: "/dashboard/farmer/orders", label: "Profile", icon: "●" },
    ],
  },
  buyer: {
    title: "Buyer",
    items: [
      { href: "/dashboard/buyer", label: "Home", icon: "⌂" },
      { href: "/dashboard/buyer/requirements", label: "Discover", icon: "⌕" },
      { href: "/dashboard/buyer/requirements", label: "Requirements", icon: "▣" },
      { href: "/dashboard/buyer/orders", label: "Orders", icon: "▤" },
      { href: "/dashboard/buyer/settings", label: "Profile", icon: "●" },
    ],
  },
  fpo: {
    title: "FPO",
    items: [
      { href: "/dashboard/fpo", label: "Home", icon: "⌂" },
      { href: "/dashboard/fpo/farmers", label: "Farmers", icon: "♟" },
      { href: "/dashboard/fpo/aggregate", label: "Aggregate", icon: "▦" },
      { href: "/dashboard/fpo/logistics", label: "Logistics", icon: "▰" },
      { href: "/dashboard/fpo", label: "Profile", icon: "●" },
    ],
  },
  admin: {
    title: "Admin",
    items: [
      { href: "/dashboard/admin", label: "Dashboard", icon: "⌂" },
      { href: "/dashboard/admin/users", label: "Users", icon: "♟" },
      { href: "/dashboard/admin/ai", label: "AI", icon: "✦" },
      { href: "/dashboard/admin/orders", label: "Orders", icon: "▤" },
      { href: "/dashboard/admin/settings", label: "Settings", icon: "⚙" },
    ],
  },
};

export default function RoleNavigation({ role }: { role: Role }) {
  const pathname = usePathname();
  const { title, items } = config[role];

  return (
    <>
      <header className="fp-app-header">
        <Link href={items[0].href} className="fp-brand" aria-label="FarmPlug AI home">
          <span className="fp-brand-mark">FP</span>
          <span><strong>FARMPLUG AI</strong><small>{title} workspace</small></span>
        </Link>
        <div className="fp-header-actions">
          <button type="button" aria-label="Notifications" className="fp-icon-button">♢</button>
          <Link href="/signin" className="fp-profile-dot" aria-label="Account">●</Link>
        </div>
      </header>

      <aside className="fp-desktop-nav" aria-label="Workspace navigation">
        <div className="fp-nav-label">WORKSPACE</div>
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== items[0].href && pathname.startsWith(item.href));
          return <Link key={`${item.href}-${item.label}`} href={item.href} className={active ? "fp-nav-item active" : "fp-nav-item"}>
            <span>{item.icon}</span><span>{item.label}</span>
          </Link>;
        })}
      </aside>

      <nav className="fp-bottom-nav" aria-label="Mobile navigation">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== items[0].href && pathname.startsWith(item.href));
          return <Link key={`${item.href}-${item.label}`} href={item.href} className={active ? "fp-bottom-item active" : "fp-bottom-item"}>
            <span className="fp-bottom-icon">{item.icon}</span><span>{item.label}</span>
          </Link>;
        })}
      </nav>
    </>
  );
}
