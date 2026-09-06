// File location: app/dashboard/buyer/requirements/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

interface Requirement {
  id: string;
  crop_name: string;
  quantity_kg: number;
  quality_grade: string | null;
  delivery_date: string | null;
  status: string;
}

export default function BuyerRequirementsPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
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
      .from("buyer_requirements")
      .select("id, crop_name, quantity_kg, quality_grade, delivery_date, status")
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false });
    setRequirements(data ?? []);
    setLoading(false);
  }

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#17211B]">Requirements</h1>
        <Link
          href="/dashboard/buyer/requirements/new"
          className="rounded-md bg-[#1B4332] px-4 py-2 text-sm font-medium text-white"
        >
          + Create Requirement
        </Link>
      </div>

      {requirements.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-[#5F6B63]">
          No requirements yet. Create one to start discovering supply.
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {requirements.map((req) => (
            <div key={req.id} className="rounded-md border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#17211B]">
                  {req.crop_name} · {req.quantity_kg} kg{req.quality_grade ? ` · ${req.quality_grade}` : ""}
                </p>
                <StatusBadge status={req.status} />
              </div>
              <p className="mt-1 text-xs text-[#5F6B63]">
                {req.delivery_date ? `Needed by ${req.delivery_date}` : "No delivery date set"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: "bg-[#2563EB]/10 text-[#2563EB]",
    matched: "bg-[#2E7D32]/10 text-[#2E7D32]",
    fulfilled: "bg-gray-100 text-[#5F6B63]",
    cancelled: "bg-[#B42318]/10 text-[#B42318]",
  };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status] ?? styles.open}`}>
      {status}
    </span>
  );
}
