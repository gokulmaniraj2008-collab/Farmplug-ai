"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

interface Order {
  id: string;
  quantity_kg: number | null;
  unit_price: number | null;
  total_amount: number | null;
  currency: string | null;
  delivery_location: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

const nextStatus: Record<string, string | undefined> = {
  order_confirmed: "collecting",
  collecting: "in_transit",
  in_transit: "delivered",
  delivered: "completed",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!id) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: queryError } = await supabase
      .from("farmplug_orders")
      .select("id,quantity_kg,unit_price,total_amount,currency,delivery_location,status,notes,created_at,updated_at")
      .eq("id", id)
      .maybeSingle();
    if (queryError || !data) setError("Order not found or you do not have access to it.");
    else setOrder(data as Order);
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function advanceStatus() {
    if (!order) return;
    const target = nextStatus[order.status];
    if (!target) return;
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("transition_farmplug_order", {
      p_order_id: order.id,
      p_next_status: target,
    });
    if (rpcError) setError(rpcError.message || "Could not update the order status.");
    else await load();
    setSaving(false);
  }

  if (loading) return <main className="p-6 text-sm text-gray-500">Loading order...</main>;
  if (error || !order) return <main className="mx-auto max-w-2xl p-6"><Link href="/dashboard/farmer/orders" className="text-sm text-[#1B4332]">← Orders</Link><p className="mt-4 text-sm text-[#B42318]" role="alert">{error ?? "Order not found."}</p></main>;

  const currency = order.currency ?? "INR";
  const canAdvance = Boolean(nextStatus[order.status]);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/dashboard/farmer/orders" className="text-sm text-[#1B4332]">← Orders</Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div><p className="text-xs text-[#5F6B63]">Order</p><h1 className="text-xl font-semibold">{order.id}</h1></div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border p-4"><p className="text-xs text-[#5F6B63]">Quantity</p><p className="mt-1 font-medium">{order.quantity_kg ?? "—"} kg</p></div>
        <div className="rounded-xl border p-4"><p className="text-xs text-[#5F6B63]">Total</p><p className="mt-1 font-medium">{currency} {order.total_amount ?? "—"}</p></div>
        <div className="rounded-xl border p-4"><p className="text-xs text-[#5F6B63]">Unit price</p><p className="mt-1 font-medium">{currency} {order.unit_price ?? "—"}/kg</p></div>
        <div className="rounded-xl border p-4"><p className="text-xs text-[#5F6B63]">Delivery</p><p className="mt-1 font-medium">{order.delivery_location ?? "Not set"}</p></div>
      </div>
      {order.notes && <div className="mt-4 rounded-xl border p-4"><p className="text-xs text-[#5F6B63]">Notes</p><p className="mt-1 text-sm">{order.notes}</p></div>}
      <div className="mt-6 rounded-xl border p-4">
        <p className="text-sm font-semibold">Order timeline</p>
        <p className="mt-2 text-sm text-[#5F6B63]">Current status: {order.status}</p>
        {canAdvance && <button disabled={saving} onClick={advanceStatus} className="mt-4 rounded-md bg-[#1B4332] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Updating..." : `Move to ${nextStatus[order.status]}`}</button>}
        {error && <p className="mt-3 text-sm text-[#B42318]" role="alert">{error}</p>}
      </div>
    </main>
  );
}
