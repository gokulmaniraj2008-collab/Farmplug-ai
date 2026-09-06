// File location: components/orders/DisputeButton.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DisputeButton({ orderId, disabled = false, onCreated }: { orderId: string; disabled?: boolean; onCreated?: () => void }) {
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!reason.trim()) return setError("Please enter a reason.");
    setBusy(true); setError(null);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("open_dispute", { p_order_id: orderId, p_reason: reason.trim() });
    if (rpcError) setError(rpcError.message);
    else { setReason(""); setOpen(false); onCreated?.(); }
    setBusy(false);
  }

  if (!open) return <button type="button" disabled={disabled} onClick={() => setOpen(true)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 disabled:opacity-50">Open dispute</button>;
  return <div className="space-y-2 rounded-md border border-red-200 p-3">
    <label className="block text-xs font-medium text-gray-700">Reason for dispute</label>
    <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
    {error && <p className="text-xs text-red-600">{error}</p>}
    <div className="flex gap-2">
      <button type="button" onClick={() => void submit()} disabled={busy} className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{busy ? "Submitting..." : "Submit dispute"}</button>
      <button type="button" onClick={() => { setOpen(false); setError(null); }} disabled={busy} className="rounded-md border px-3 py-1.5 text-xs">Cancel</button>
    </div>
  </div>;
}
