// File location: app/dashboard/buyer/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

interface Order { id: string; quantity_kg: number; unit_price: number; total_amount: number; currency: string; delivery_location: string | null; status: string; created_at: string; }

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from("farmplug_orders").select("id, quantity_kg, unit_price, total_amount, currency, delivery_location, status, created_at").eq("buyer_id", user.id).order("created_at", { ascending: false });
    setOrders(data ?? []); setLoading(false);
  }
  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>;
  return <div className="mx-auto max-w-2xl p-6"><h1 className="text-xl font-semibold text-[#17211B]">Orders</h1>{orders.length === 0 ? <div className="mt-4 rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-[#5F6B63]">No orders yet.</div> : <div className="mt-4 space-y-2">{orders.map((order) => <Link key={order.id} href={`/dashboard/orders/${order.id}`} className="flex items-center justify-between rounded-md border border-gray-200 p-3 hover:bg-gray-50"><div><p className="text-sm font-medium text-[#17211B]">{order.quantity_kg} kg · {order.currency} {order.total_amount}</p><p className="text-xs text-[#5F6B63]">{order.delivery_location ?? "Delivery location not set"}</p></div><OrderStatusBadge status={order.status} /></Link>)}</div>}</div>;
}
