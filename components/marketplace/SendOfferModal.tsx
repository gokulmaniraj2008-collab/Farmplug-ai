// File location: components/marketplace/SendOfferModal.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

export interface SendOfferModalProps {
  listingId: string;
  farmerId: string;
  suggestedPricePerKg: number;
  availableQuantityKg: number;
  onClose: () => void;
  onSent?: () => void;
}

export default function SendOfferModal({ listingId, farmerId, suggestedPricePerKg, availableQuantityKg, onClose, onSent }: SendOfferModalProps) {
  const [quantity, setQuantity] = useState(availableQuantityKg);
  const [price, setPrice] = useState(suggestedPricePerKg);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Your session has expired. Please sign in again."); setSubmitting(false); return; }
    if (quantity <= 0 || quantity > availableQuantityKg) { setError(`Quantity must be between 1 and ${availableQuantityKg} kg.`); setSubmitting(false); return; }
    const { error: insertError } = await supabase.from("offers").insert({ listing_id: listingId, buyer_id: user.id, farmer_id: farmerId, quantity_kg: quantity, price_per_kg: price, message: message || null, status: "pending" });
    if (insertError) { setError("Couldn't send the offer. Please try again."); setSubmitting(false); return; }
    onSent?.(); onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">Send an offer</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700">Quantity (kg) — up to {availableQuantityKg}</label><input type="number" min={1} max={availableQuantityKg} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Your offer price (₹/kg)</label><input type="number" min={0.01} step={0.01} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /><p className="mt-1 text-xs text-gray-400">Listed at ₹{suggestedPricePerKg.toFixed(2)}/kg</p></div>
          <div><label className="block text-sm font-medium text-gray-700">Message (optional)</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" /></div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <div className="flex gap-2"><button type="button" onClick={onClose} className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">Cancel</button><button type="submit" disabled={submitting} className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{submitting ? "Sending..." : "Send offer"}</button></div>
        </form>
      </div>
    </div>
  );
}
