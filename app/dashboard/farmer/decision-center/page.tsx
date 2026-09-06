"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Crop {
  id: string;
  crop_name: string;
  harvest_date: string | null;
  status: string;
}

interface Recommendation {
  id: string;
  title: string;
  reason: string;
  confidence: number;
  dataStatus: string;
}

function buildRecommendations(crops: Crop[]): Recommendation[] {
  const recs: Recommendation[] = [];

  crops.forEach((crop) => {
    if (crop.status && ["at_risk", "risk", "needs_attention"].includes(crop.status.toLowerCase())) {
      recs.push({
        id: `status-${crop.id}`,
        title: `Review ${crop.crop_name}`,
        reason: `This crop is marked with status “${crop.status}”.`,
        confidence: 100,
        dataStatus: "Based on your crop record",
      });
    }

    if (crop.harvest_date) {
      const days = Math.ceil(
        (new Date(crop.harvest_date).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      );
      if (days >= 0 && days <= 14) {
        recs.push({
          id: `harvest-${crop.id}`,
          title: `${crop.crop_name} harvest in ${days} day${days === 1 ? "" : "s"}`,
          reason:
            "The recorded harvest date is within the next two weeks — consider preparing your listing and buyer outreach.",
          confidence: 100,
          dataStatus: "Calculated from your crop record",
        });
      }
    }
  });

  if (recs.length === 0) {
    recs.push({
      id: "none",
      title: "No urgent actions right now",
      reason:
        "No crop status requires attention and no recorded harvest dates fall within the next two weeks.",
      confidence: 100,
      dataStatus: "Calculated from your crop records",
    });
  }

  return recs;
}

export default function DecisionCenterPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: farms } = await supabase
      .from("farms")
      .select("id")
      .eq("owner_id", user.id);

    const farmIds = (farms ?? []).map((farm) => farm.id);

    if (farmIds.length === 0) {
      setCrops([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("crops")
      .select("id, crop_name, harvest_date, status")
      .in("farm_id", farmIds);

    setCrops((data ?? []) as Crop[]);
    setLoading(false);
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading...</div>;
  }

  const recommendations = buildRecommendations(crops).filter(
    (recommendation) => !dismissed.has(recommendation.id),
  );

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold text-[#17211B]">Decision Center</h1>
      <p className="mt-1 text-xs text-[#5F6B63]">
        Recommendations are calculated from the crop data you have entered — not a live AI model.
      </p>

      <div className="mt-4 space-y-3">
        {recommendations.map((recommendation) => (
          <div key={recommendation.id} className="rounded-md border border-gray-200 p-4">
            <p className="text-sm font-medium text-[#17211B]">{recommendation.title}</p>
            <p className="mt-1 text-xs text-[#5F6B63]">{recommendation.reason}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-[#5F6B63]">
              <span>
                Confidence: {recommendation.confidence}% · {recommendation.dataStatus}
              </span>
              {recommendation.id !== "none" && (
                <button
                  onClick={() =>
                    setDismissed((previous) =>
                      new Set(previous).add(recommendation.id),
                    )
                  }
                  className="font-medium text-[#1B4332] hover:underline"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
