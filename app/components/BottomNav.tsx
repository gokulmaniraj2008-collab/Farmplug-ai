'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Store, Package, Bell } from 'lucide-react';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/decision-center', label: 'AI', icon: Sparkles },
  { href: '/marketplace', label: 'Market', icon: Store },
  { href: '/orders', label: 'Orders', icon: Package },
  { href: '/notifications', label: 'Alerts', icon: Bell },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottomNav" aria-label="Primary mobile navigation">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={active ? 'bottomItem active' : 'bottomItem'}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
