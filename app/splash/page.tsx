'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const boot = async () => {
      if (!supabase) {
        if (active) router.replace('/signin');
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;

      if (data.session) {
        router.replace('/app-v2');
        return;
      }

      const onboardingDone = window.localStorage.getItem('farmplug_onboarding_done') === '1';
      router.replace(onboardingDone ? '/signin' : '/onboarding');
    };

    const timer = window.setTimeout(boot, 650);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [router]);

  return (
    <main className="v2 splash" aria-label="FarmPlug AI loading">
      <div className="logoMark"><Leaf size={44} /></div>
      <h1>FarmPlug <span>AI</span></h1>
      <p>From Farm Intelligence to the Right Market.</p>
      <div className="loader" aria-label="Loading" />
    </main>
  );
}
