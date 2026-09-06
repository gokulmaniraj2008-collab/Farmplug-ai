'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FarmerAppPhase2 from './phase2';
import { supabase } from '../../lib/supabase';

export default function FarmPlugFarmerApp() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      if (!supabase) {
        router.replace('/signin');
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;

      if (!data.session) {
        router.replace('/splash');
        return;
      }

      setChecking(false);
    };

    checkSession();
    const { data: subscription } = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (!session) router.replace('/splash');
    }) ?? { subscription: { unsubscribe: () => undefined } };

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <main className="v2 splash" aria-label="Checking FarmPlug AI session">
        <div className="logoMark">🌱</div>
        <h1>FarmPlug <span>AI</span></h1>
        <p>Checking your secure farmer session…</p>
        <div className="loader" aria-label="Loading" />
      </main>
    );
  }

  return <FarmerAppPhase2 />;
}
