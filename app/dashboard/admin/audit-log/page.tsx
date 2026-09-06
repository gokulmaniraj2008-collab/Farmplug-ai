// File location: app/dashboard/admin/audit-log/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

interface AuditRow {
  id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at: string;
}

export default function AdminAuditLogPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("audit_log")
        .select("id, actor_id, action, entity_type, entity_id, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      setRows(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading audit log...</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-xl font-semibold text-gray-900">Audit log</h1>
      <p className="mt-1 text-sm text-gray-500">Most recent 100 events.</p>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-gray-400">
          No audit events recorded yet — this table is populated once
          accept_offer / reject_offer / advance_order_status are wired to
          insert into audit_log.
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2 text-sm"
            >
              <span>
                <span className="font-medium">{row.action}</span> on {" "}
                {row.entity_type}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(row.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
