"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function FarmerProfilePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setEmail(data.user?.email ?? "");
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/signin";
  }

  return (
    <main className="fp-page-shell">
      <section className="fp-page-heading">
        <span className="fp-eyebrow">ACCOUNT</span>
        <h1>Profile</h1>
        <p>Manage your FarmPlug AI account and farmer workspace.</p>
      </section>

      <section className="fp-card" aria-label="Account profile">
        <div className="fp-card-header">
          <div>
            <h2>Account</h2>
            <p>{loading ? "Loading account details…" : email || "Signed-in farmer"}</p>
          </div>
          <div className="fp-brand-mark" aria-hidden="true">FP</div>
        </div>

        <div className="fp-action-grid">
          <Link href="/dashboard/farmer/farm" className="fp-action-card">
            <strong>Farm details</strong>
            <span>Update your farm and crop information.</span>
          </Link>
          <Link href="/dashboard/farmer/orders" className="fp-action-card">
            <strong>Orders</strong>
            <span>Track active and completed orders.</span>
          </Link>
          <Link href="/dashboard/farmer/listings" className="fp-action-card">
            <strong>Market</strong>
            <span>Manage produce listings and selling opportunities.</span>
          </Link>
          <Link href="/dashboard/farmer/intelligence" className="fp-action-card">
            <strong>AI insights</strong>
            <span>Review market intelligence and recommendations.</span>
          </Link>
        </div>

        <button type="button" onClick={signOut} className="fp-secondary-button">
          Sign out
        </button>
      </section>
    </main>
  );
}
