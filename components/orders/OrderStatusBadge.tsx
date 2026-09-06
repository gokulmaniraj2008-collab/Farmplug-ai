// File location: components/orders/OrderStatusBadge.tsx

type OrderStatus =
  | "quote_pending"
  | "negotiating"
  | "quote_accepted"
  | "order_confirmed"
  | "collecting"
  | "in_transit"
  | "delivered"
  | "completed"
  | "cancelled"
  | "disputed";

const LABEL: Record<OrderStatus, string> = {
  quote_pending: "Quote Pending",
  negotiating: "Negotiating",
  quote_accepted: "Quote Accepted",
  order_confirmed: "Order Confirmed",
  collecting: "Collecting",
  in_transit: "In Transit",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
};

const STYLE: Record<OrderStatus, string> = {
  quote_pending: "bg-blue-100 text-blue-800",
  negotiating: "bg-blue-100 text-blue-800",
  quote_accepted: "bg-indigo-100 text-indigo-800",
  order_confirmed: "bg-indigo-100 text-indigo-800",
  collecting: "bg-amber-100 text-amber-800",
  in_transit: "bg-amber-100 text-amber-800",
  delivered: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  disputed: "bg-red-100 text-red-800",
};

export default function OrderStatusBadge({
  status,
  isPaymentSimulated,
}: {
  status: OrderStatus;
  isPaymentSimulated?: boolean;
}) {
  const known = LABEL[status] !== undefined;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
          known ? STYLE[status] : "bg-gray-100 text-gray-600"
        }`}
      >
        {known ? LABEL[status] : status}
      </span>
      {status === "order_confirmed" && isPaymentSimulated && (
        <span className="text-[10px] uppercase text-gray-400">(simulated)</span>
      )}
    </span>
  );
}
