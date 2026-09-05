'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Store, LayoutDashboard, Info } from 'lucide-react';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/decision-center', label: 'AI', icon: Sparkles },
  { href: '/marketplace', label: 'Market', icon: Store },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/about', label: 'About', icon: Info },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottomNav" aria-label="Primary mobile navigation">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} className={active ? 'bottomItem active' : 'bottomItem'}>
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
