// File location: app/dashboard/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

interface Metrics {
  totalUsers: number;
  farmers: number;
  buyers: number;
  fpos: number;
  pendingOffers: number;
  activeOrders: number;
  completedOrders: number;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    setLoading(true);
    const supabase = createClient();

    // Relies on the admin_read_* RLS policies — this page only works for
    // users whose profiles.role = 'admin'. Non-admins get empty results,
    // not an error, because RLS silently filters rows rather than 403ing.
    const [
      { count: totalUsers },
      { count: farmers },
      { count: buyers },
      { count: fpos },
      { count: pendingOffers },
      { count: activeOrders },
      { count: completedOrders },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "farmer"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "buyer"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "fpo"),
      supabase.from("offers").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("orders").select("*", { count: "exact", head: true }).not("status", "in", "(completed,cancelled)"),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
    ]);

    setMetrics({
      totalUsers: totalUsers ?? 0,
      farmers: farmers ?? 0,
      buyers: buyers ?? 0,
      fpos: fpos ?? 0,
      pendingOffers: pendingOffers ?? 0,
      activeOrders: activeOrders ?? 0,
      completedOrders: completedOrders ?? 0,
    });
    setLoading(false);
  }

  if (loading) return <div className="p-6 text-gray-500">Loading admin overview...</div>;
  if (!metrics) return <div className="p-6 text-red-600">{error ?? "Couldn't load metrics."}</div>;

  const cards: { label: string; value: number }[] = [
    { label: "Total users", value: metrics.totalUsers },
    { label: "Farmers", value: metrics.farmers },
    { label: "Buyers", value: metrics.buyers },
    { label: "FPOs", value: metrics.fpos },
    { label: "Pending offers", value: metrics.pendingOffers },
    { label: "Active orders", value: metrics.activeOrders },
    { label: "Completed orders", value: metrics.completedOrders },
  ];

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-xl font-semibold text-gray-900">Platform overview</h1>
      <p className="mt-1 text-sm text-gray-500">
        Live counts across users, marketplace activity, and orders.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="text-2xl font-semibold text-gray-900">
              {card.value}
            </div>
            <div className="mt-1 text-sm text-gray-500">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <a
          href="/dashboard/admin/users"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
        >
          Manage users
        </a>
        <a
          href="/dashboard/admin/audit-log"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
        >
          View audit log
        </a>
      </div>
    </div>
  );
}
