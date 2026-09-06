// File location: app/dashboard/buyer/matches/page.tsx
//
// CALCULATED match, not a live AI/matching engine — see explanation
// logic below. Per master prompt section 19: match explanations must
// be understandable, and section 36: never invent AI confidence.
//
// Depends on `produce_listings` — same unverified-schema caveat as the
// Farmer core batch's Add Produce form. Adjust the select() below once
// the real column names are confirmed.
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // adjust to your existing client path

interface Requirement {
  id: string;
  crop_name: string;
  quantity_kg: number;
  quality_grade: string | null;
}

interface Listing {
  id: string;
  crop_name: string | null;
  quantity_kg: number;
  quality_grade: string | null;
  location_text: string | null;
  farmer_id: string;
}

interface Match {
  listing: Listing;
  score: number;
  reason: string;
}

export default function BuyerMatchesPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [selectedReq, setSelectedReq] = useState<string>("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    loadRequirements();
  }, []);

  async function loadRequirements() {
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
      .select("id, crop_name, quantity_kg, quality_grade")
      .eq("buyer_id", user.id)
      .eq("status", "open");
    setRequirements(data ?? []);
    if (data && data.length > 0) setSelectedReq(data[0].id);
    setLoading(false);
  }

  async function findMatches(reqId: string) {
    setSelectedReq(reqId);
    setMatching(true);
    const req = requirements.find((r) => r.id === reqId);
    if (!req) {
      setMatching(false);
      return;
    }

    const supabase = createClient();
    // NOTE: this queries `produce_listings` by crop name only — join
    // to your real `crops` table (crop_id -> crop_name) if that's how
    // your listings actually reference crop names.
    const { data, error } = await supabase
      .from("produce_listings")
      .select("id, crop_name, quantity_kg, quality_grade, location_text, farmer_id")
      .ilike("crop_name", `%${req.crop_name}%`)
      .eq("status", "published");

    if (error || !data) {
      setMatches([]);
      setMatching(false);
      return;
    }

    const scored: Match[] = data.map((listing) => {
      let score = 40; // base score for matching crop name
      const reasons: string[] = [`Crop matches "${req.crop_name}"`];

      if (req.quality_grade && listing.quality_grade === req.quality_grade) {
        score += 30;
        reasons.push(`Quality matches (${req.quality_grade})`);
      }
      if (listing.quantity_kg >= req.quantity_kg) {
        score += 20;
        reasons.push("Quantity covers full requirement");
      } else {
        score += Math.round((listing.quantity_kg / req.quantity_kg) * 20);
        reasons.push("Partial quantity — may need aggregation");
      }

      return { listing, score: Math.min(score, 100), reason: reasons.join(" · ") };
    });

    scored.sort((a, b) => b.score - a.score);
    setMatches(scored);
    setMatching(false);
  }

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold text-[#17211B]">Buyer Matches</h1>
      <p className="mt-1 text-xs text-[#5F6B63]">
        Calculated match against published listings — not a live AI matching model.
      </p>

      {requirements.length === 0 ? (
        <p className="mt-4 text-sm text-[#5F6B63]">
          No open requirements. Create one first to see matches.
        </p>
      ) : (
        <>
          <select
            value={selectedReq}
            onChange={(e) => findMatches(e.target.value)}
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {requirements.map((r) => (
              <option key={r.id} value={r.id}>
                {r.crop_name} · {r.quantity_kg} kg
              </option>
            ))}
          </select>

          {matching ? (
            <p className="mt-4 text-sm text-gray-500">Finding matches...</p>
          ) : matches.length === 0 ? (
            <p className="mt-4 text-sm text-[#5F6B63]">
              This information is not available in the current workspace — no matching listings found.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {matches.map((m) => (
                <div key={m.listing.id} className="rounded-md border border-gray-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#17211B]">
                      {m.listing.crop_name} · {m.listing.quantity_kg} kg
                      {m.listing.quality_grade ? ` · ${m.listing.quality_grade}` : ""}
                    </p>
                    <span className="rounded-full bg-[#2E7D32]/10 px-2 py-1 text-xs font-medium text-[#2E7D32]">
                      {m.score}% match
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#5F6B63]">{m.reason}</p>
                  <p className="mt-1 text-xs text-[#5F6B63]">
                    {m.listing.location_text ?? "Location not set"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
