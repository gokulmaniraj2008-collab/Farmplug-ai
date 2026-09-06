// File location: app/dashboard/buyer/logistics/page.tsx
//
// Reuses the existing LogisticsTracker component (confirmed schema)
// in read-only mode (canManage=false — buyers track, they don't
// advance the route). Lists the buyer's in-flight orders and mounts
// one tracker per order.
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path
import LogisticsTracker from "@/components/logistics/LogisticsTracker";

interface Order {
  id: string;
  status: string;
  delivery_location: string | null;
}

const ACTIVE_STATUSES = ["order_confirmed", "collecting", "in_transit"];

export default function BuyerLogisticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("farmplug_orders")
      .select("id, status, delivery_location")
      .eq("buyer_id", user.id)
      .in("status", ACTIVE_STATUSES);
    setOrders(data ?? []);
    setLoading(false);
  }

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold text-[#17211B]">Logistics</h1>

      {orders.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-[#5F6B63]">
          No orders currently in transit or collection.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-md border border-gray-200 p-3">
              <p className="text-xs text-[#5F6B63]">
                Order to {order.delivery_location ?? "destination not set"}
              </p>
              <div className="mt-2">
                <LogisticsTracker orderId={order.id} canManage={false} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
