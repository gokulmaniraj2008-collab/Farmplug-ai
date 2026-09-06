'use client';

import { ArrowRight, Bell, Leaf, LogOut, Package, Settings, ShoppingBag, Sparkles, User, Wheat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const destinations = [
  { href: '/crop-health', title: 'Crop Health', description: 'AI-assisted crop risk screening.', icon: Wheat },
  { href: '/farm-intelligence', title: 'Farm Intelligence', description: 'Review farm insights and decisions.', icon: Leaf },
  { href: '/offers', title: 'Offers & Market', description: 'Review buyer offers and market opportunities.', icon: ShoppingBag },
  { href: '/orders', title: 'Orders', description: 'Track accepted trades and order status.', icon: Package },
  { href: '/notifications', title: 'Notifications', description: 'See important FarmPlug alerts.', icon: Bell },
  { href: '/settings', title: 'Settings', description: 'Manage FarmPlug preferences.', icon: Settings },
];

export default function FarmerAppPhase2() {
  const router = useRouter();
  const [name, setName] = useState('Farmer');

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (!active || !data.session) return;
      const { data: profile } = await supabase
        .from('farmer_profiles')
        .select('full_name')
        .eq('id', data.session.user.id)
        .maybeSingle();
      if (active && profile?.full_name) setName(String(profile.full_name));
    };
    void loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    router.replace('/splash');
  };

  return (
    <div className="v2 appShell">
      <header className="appTop">
        <button onClick={() => router.push('/dashboard')} aria-label="Back to dashboard">
          <Leaf /> FarmPlug AI
        </button>
        <button onClick={() => router.push('/settings')} aria-label="Open settings">
          <Settings />
        </button>
      </header>

      <main className="appBody">
        <section className="aiHero">
          <div className="bot"><Leaf /></div>
          <p className="kicker">FARMPLUG AI FARMER APP</p>
          <h1>Vanakkam, {name} 👋</h1>
          <p>One farmer workspace, with every feature opening the same canonical FarmPlug pages.</p>
        </section>

        <div className="cards2">
          {destinations.map(({ href, title, description, icon: Icon }) => (
            <button key={href} onClick={() => router.push(href)} aria-label={`Open ${title}`}>
              <Icon />
              <b>{title}</b>
              <span>{description}</span>
              <ArrowRight />
            </button>
          ))}
        </div>

        <div className="notice">
          <b>Canonical navigation</b>
          <p>
            FarmPlug AI no longer maintains a second copy of Crop Health, Farm Intelligence, Market, Orders,
            Notifications, or Settings inside this shell. Each action opens the corresponding routed page.
          </p>
        </div>

        <button className="outlineBtn" onClick={() => void signOut()}>
          <LogOut /> Sign out
        </button>

        <div className="marketCard">
          <User />
          <div>
            <b>Farmer workspace</b>
            <p>Your authenticated FarmPlug session controls access to the operational pages.</p>
          </div>
          <Sparkles />
        </div>
      </main>
    </div>
  );
}
