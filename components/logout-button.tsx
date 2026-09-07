"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setVisible(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setVisible(Boolean(session));
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function logout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/signin";
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      aria-label="Log out of FarmPlug AI"
      className="fixed bottom-5 right-5 z-50 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#DCE6DC] bg-white px-4 py-3 text-sm font-bold text-[#B42318] shadow-[0_10px_30px_rgba(31,58,35,.12)] transition hover:bg-[#FFF6F5] disabled:cursor-wait disabled:opacity-60 sm:bottom-6 sm:right-6"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Logging out…" : "Log out"}
    </button>
  );
}
