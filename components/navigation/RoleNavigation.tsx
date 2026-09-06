"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  BrainCircuit,
  ClipboardList,
  Factory,
  Home,
  Leaf,
  ListChecks,
  MapPinned,
  PackageCheck,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

type Role = "farmer" | "buyer" | "fpo" | "admin";
type Item = { href: string; label: string; icon: LucideIcon };
type RoleConfig = { title: string; profileHref: string; items: Item[] };

const config: Record<Role, RoleConfig> = {
  farmer: {
    title: "Farmer",
    profileHref: "/dashboard/farmer/profile",
    items: [
      { href: "/dashboard/farmer", label: "Home", icon: Home },
      { href: "/dashboard/farmer/farm", label: "Farm", icon: Leaf },
      { href: "/dashboard/farmer/intelligence", label: "AI", icon: BrainCircuit },
      { href: "/dashboard/farmer/listings", label: "Market", icon: Store },
      { href: "/dashboard/farmer/profile", label: "Profile", icon: UserRound },
    ],
  },
  buyer: {
    title: "Buyer",
    profileHref: "/dashboard/buyer/settings",
    items: [
      { href: "/dashboard/buyer", label: "Home", icon: Home },
      { href: "/dashboard/buyer/requirements", label: "Discover", icon: ShoppingCart },
      { href: "/dashboard/buyer/requirements", label: "Requirements", icon: ClipboardList },
      { href: "/dashboard/buyer/orders", label: "Orders", icon: PackageCheck },
      { href: "/dashboard/buyer/settings", label: "Profile", icon: UserRound },
    ],
  },
  fpo: {
    title: "FPO",
    profileHref: "/dashboard/fpo",
    items: [
      { href: "/dashboard/fpo", label: "Home", icon: Home },
      { href: "/dashboard/fpo/farmers", label: "Farmers", icon: UsersRound },
      { href: "/dashboard/fpo/aggregate", label: "Aggregate", icon: Boxes },
      { href: "/dashboard/fpo/logistics", label: "Logistics", icon: Truck },
      { href: "/dashboard/fpo", label: "Profile", icon: UserRound },
    ],
  },
  admin: {
    title: "Admin",
    profileHref: "/dashboard/admin/settings",
    items: [
      { href: "/dashboard/admin", label: "Dashboard", icon: BarChart3 },
      { href: "/dashboard/admin/users", label: "Users", icon: UsersRound },
      { href: "/dashboard/admin/ai", label: "AI", icon: BrainCircuit },
      { href: "/dashboard/admin/orders", label: "Orders", icon: ListChecks },
      { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
    ],
  },
};

export default function RoleNavigation({ role }: { role: Role }) {
  const pathname = usePathname();
  const { title, profileHref, items } = config[role];

  return (
    <>
      <header className="fp-app-header">
        <Link href={items[0].href} className="fp-brand" aria-label="FarmPlug AI home">
          <span className="fp-brand-mark" aria-hidden="true"><Leaf size={19} strokeWidth={2.2} /></span>
          <span><strong>FarmPlug AI</strong><small>{title} workspace</small></span>
        </Link>
        <div className="fp-header-actions">
          <Link href={profileHref} className="fp-profile-dot" aria-label="Profile"><UserRound size={19} /></Link>
        </div>
      </header>

      <aside className="fp-desktop-nav" aria-label="Workspace navigation">
        <div className="fp-nav-label">Workspace</div>
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== items[0].href && pathname.startsWith(item.href));
          const Icon = item.icon;
          return <Link key={`${item.href}-${item.label}`} href={item.href} className={active ? "fp-nav-item active" : "fp-nav-item"}>
            <Icon size={19} strokeWidth={2} aria-hidden="true" /><span>{item.label}</span>
          </Link>;
        })}
      </aside>

      <nav className="fp-bottom-nav" aria-label="Mobile navigation">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== items[0].href && pathname.startsWith(item.href));
          const Icon = item.icon;
          return <Link key={`${item.href}-${item.label}`} href={item.href} className={active ? "fp-bottom-item active" : "fp-bottom-item"}>
            <span className="fp-bottom-icon"><Icon size={19} strokeWidth={2} aria-hidden="true" /></span><span>{item.label}</span>
          </Link>;
        })}
      </nav>
    </>
  );
}
