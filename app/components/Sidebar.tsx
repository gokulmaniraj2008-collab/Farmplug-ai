'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, Sparkles, Store, Users, LayoutDashboard, ShieldCheck, Info, Menu, X, UserRound } from 'lucide-react';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/decision-center', label: 'AI Decision Center', icon: Sparkles },
  { href: '/marketplace', label: 'Marketplace', icon: Store },
  { href: '/buyer', label: 'Buyer Command Center', icon: UserRound },
  { href: '/dashboard', label: 'Farmer / FPO Dashboard', icon: LayoutDashboard },
  { href: '/admin', label: 'Admin Control Center', icon: ShieldCheck },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/about', label: 'About FarmPlug AI', icon: Info },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (mobile = false) => (
    <nav className={mobile ? 'sideNav mobileSideNav' : 'sideNav'} aria-label="FarmPlug navigation">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} onClick={() => mobile && setOpen(false)} className={active ? 'sideItem active' : 'sideItem'}>
            <Icon size={19} strokeWidth={active ? 2.5 : 2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="desktopSidebar">
        <div className="sideBrand"><div className="sideLogo">F</div><div><strong>FarmPlug AI</strong><small>Farm intelligence → market</small></div></div>
        {nav()}
        <div className="sideFooter">SIH 2026 · PS 26033<br /><span>Prototype demonstration</span></div>
      </aside>
      <button className="mobileMenuButton" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={22}/></button>
      {open && <div className="sideOverlay" onClick={() => setOpen(false)} aria-hidden="true" />}
      <aside className={open ? 'mobileSidebar open' : 'mobileSidebar'} aria-label="Mobile navigation">
        <div className="sideBrand"><div className="sideLogo">F</div><div><strong>FarmPlug AI</strong><small>Navigation</small></div><button className="sideClose" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={21}/></button></div>
        {nav(true)}
        <div className="sideFooter">SIH 2026 · PS 26033</div>
      </aside>
    </>
  );
}
