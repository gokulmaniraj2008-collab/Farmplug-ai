// File location: app/dashboard/admin/disputes/page.tsx
// Route (per master prompt section 24): /admin/disputes
//
// Read access relies on the new "disputes_admin_read" policy added in
// migration_logistics_payments_disputes_functions.sql. Resolution
// calls the new resolve_dispute() RPC — previously there was no
// UPDATE path on disputes at all.

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

type DisputeStatus = "open" | "investigating" | "resolved" | "rejected";

interface Dispute {
  id: string;
  order_id: string;
  opened_by: string;
  reason: string;
  status: DisputeStatus;
  resolution: string | null;
  created_at: string;
}

const STATUS_STYLE: Record<DisputeStatus, string> = {
  open: "bg-red-100 text-red-800",
  investigating: "bg-amber-100 text-amber-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-gray-100 text-gray-700",
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("disputes")
      .select("id, order_id, opened_by, reason, status, resolution, created_at")
      .order("created_at", { ascending: false });

    if (fetchError) setError(fetchError.message);
    else setDisputes((data as Dispute[]) ?? []);
    setLoading(false);
  }

  async function resolve(disputeId: string, status: "investigating" | "resolved" | "rejected") {
    setBusyId(disputeId);
    setError(null);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("resolve_dispute", {
      p_dispute_id: disputeId,
      p_status: status,
      p_resolution: resolutionDrafts[disputeId] ?? null,
    });
    if (rpcError) setError(rpcError.message);
    else await load();
    setBusyId(null);
  }

  if (loading) return <div className="p-6 text-gray-500">Loading disputes...</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-xl font-semibold text-gray-900">Disputes — Admin</h1>
      <p className="mt-1 text-sm text-gray-500">
        Review and resolve marketplace disputes. Resolution actions are server-side gated.
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <ul className="mt-6 space-y-4">
        {disputes.length === 0 && (
          <p className="text-sm text-gray-500">No disputes recorded yet.</p>
        )}
        {disputes.map((d) => (
          <li key={d.id} className="rounded-md border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-gray-900">
                Order #{d.order_id.slice(0, 8)}
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[d.status]}`}>
                {d.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-700">{d.reason}</p>
            <p className="mt-1 text-xs text-gray-500">
              Opened by #{d.opened_by.slice(0, 8)} · {new Date(d.created_at).toLocaleString()}
            </p>
            {d.resolution && (
              <p className="mt-2 rounded bg-gray-50 p-2 text-sm text-gray-700">
                Resolution: {d.resolution}
              </p>
            )}

            {d.status !== "resolved" && d.status !== "rejected" && (
              <div className="mt-4 space-y-2">
                <textarea
                  value={resolutionDrafts[d.id] ?? ""}
                  onChange={(e) =>
                    setResolutionDrafts((prev) => ({ ...prev, [d.id]: e.target.value }))
                  }
                  placeholder="Resolution notes..."
                  className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                  rows={2}
                />
                <div className="flex gap-2">
                  {d.status === "open" && (
                    <button
                      type="button"
                      onClick={() => resolve(d.id, "investigating")}
                      disabled={busyId === d.id}
                      className="rounded-md border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-800 disabled:opacity-50"
                    >
                      Mark investigating
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => resolve(d.id, "resolved")}
                    disabled={busyId === d.id}
                    className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                  >
                    Resolve
                  </button>
                  <button
                    type="button"
                    onClick={() => resolve(d.id, "rejected")}
                    disabled={busyId === d.id}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
