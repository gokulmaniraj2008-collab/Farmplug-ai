// File location: components/ai/AIRecommendationCard.tsx
//
// Enforces spec rule: every AI recommendation must show recommendation,
// reason, confidence, data status/source, and require explicit user
// confirmation. Simulated/demo output must never be presented as real.

"use client";

import { useState } from "react";

type DataStatus = "live" | "simulated" | "estimated" | "calculated" | "demo";

const STATUS_LABEL: Record<DataStatus, string> = {
  live: "LIVE DATA",
  simulated: "SIMULATED FORECAST",
  estimated: "ESTIMATED",
  calculated: "CALCULATED",
  demo: "DEMO DATA",
};

const STATUS_STYLE: Record<DataStatus, string> = {
  live: "bg-green-100 text-green-800",
  simulated: "bg-amber-100 text-amber-800",
  estimated: "bg-amber-100 text-amber-800",
  calculated: "bg-blue-100 text-blue-800",
  demo: "bg-gray-200 text-gray-700",
};

export interface AIRecommendationCardProps {
  title: string;
  recommendation: string;
  reason: string;
  confidencePercent: number;
  dataStatus: DataStatus;
  source: string;
  onConfirm?: () => void;
  onDismiss?: () => void;
}

export default function AIRecommendationCard({
  title,
  recommendation,
  reason,
  confidencePercent,
  dataStatus,
  source,
  onConfirm,
  onDismiss,
}: AIRecommendationCardProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[dataStatus]}`}>
          {STATUS_LABEL[dataStatus]}
        </span>
      </div>
      <p className="mt-2 text-base font-medium text-gray-900">{recommendation}</p>
      <p className="mt-1 text-sm text-gray-600">{reason}</p>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-green-600" style={{ width: `${Math.min(100, Math.max(0, confidencePercent))}%` }} />
        </div>
        <span className="text-xs text-gray-500">{confidencePercent}% confidence</span>
      </div>
      <p className="mt-2 text-xs text-gray-400">Source: {source}</p>
      {!confirmed ? (
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => { setConfirmed(true); onConfirm?.(); }} className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white">Use this recommendation</button>
          <button type="button" onClick={onDismiss} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700">Dismiss</button>
        </div>
      ) : (
        <p className="mt-4 text-sm font-medium text-green-700">✓ Applied — you can undo this from your activity log.</p>
      )}
    </div>
  );
}
