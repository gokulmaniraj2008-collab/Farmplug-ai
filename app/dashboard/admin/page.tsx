"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  useEffect(() => { (async () => {
    const s = createClient();
    const [users, farmers, buyers, fpos, requirements, listings, orders, disputes] = await Promise.all([
      s.from("profiles").select("id", { count: "exact", head: true }),
      s.from("profiles").select("id", { count: "exact", head: true }).eq("farm_role", "farmer"),
      s.from("profiles").select("id", { count: "exact", head: true }).eq("farm_role", "buyer"),
      s.from("profiles").select("id", { count: "exact", head: true }).eq("farm_role", "fpo"),
      s.from("farmplug_buyer_requirements").select("id", { count: "exact", head: true }),
      s.from("farmplug_supply_listings").select("id", { count: "exact", head: true }),
      s.from("farmplug_orders").select("id", { count: "exact", head: true }),
      s.from("disputes").select("id", { count: "exact", head: true }).eq("status", "open"),
    ]);
    setStats({ Users: users.count ?? 0, Farmers: farmers.count ?? 0, Buyers: buyers.count ?? 0, FPOs: fpos.count ?? 0, Requirements: requirements.count ?? 0, Listings: listings.count ?? 0, Orders: orders.count ?? 0, "Open disputes": disputes.count ?? 0 });
  })(); }, []);
  return <main className="mx-auto max-w-5xl p-6"><h1 className="text-2xl font-bold">Admin control center</h1><p className="mt-1 text-sm text-gray-500">Live platform metrics from the production schema.</p><div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{Object.entries(stats).map(([k,v])=><div key={k} className="rounded-2xl border p-4"><div className="text-2xl font-bold">{v}</div><div className="text-sm text-gray-500">{k}</div></div>)}</div><nav className="mt-8 grid gap-2 sm:grid-cols-3">{["farmers","fpos","buyers","listings","requirements","matches","ai","reports","settings","users","audit-log","disputes","logistics","payments"].map(x=><a key={x} href={`/dashboard/admin/${x}`} className="rounded-xl border p-3 capitalize hover:bg-gray-50">{x.replace("-"," ")}</a>)}</nav></main>;
}
