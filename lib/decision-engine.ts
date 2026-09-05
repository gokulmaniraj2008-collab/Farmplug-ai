export type DecisionInput = {
  crop: string;
  quantityKg: number;
  location: string;
  quality: string;
  harvestDate: string;
  storage: string;
};

export type DecisionResult = {
  demandLevel: 'High' | 'Medium' | 'Low';
  demandScore: number;
  sellingWindowDays: string;
  buyerMatches: number;
  bulkOpportunity: 'Strong' | 'Potential' | 'Limited';
  freshnessRisk: 'Low' | 'Medium' | 'High';
  logisticsPriority: 'Low' | 'Medium' | 'High';
  reasons: string[];
  prototype: true;
};

const cropDemand: Record<string, number> = {
  tomato: 82,
  onion: 72,
  potato: 68,
  mango: 64,
  banana: 70,
  chilli: 66,
};

export function runDecisionEngine(input: DecisionInput): DecisionResult {
  const cropKey = input.crop.trim().toLowerCase();
  const quantity = Math.max(0, Number(input.quantityKg) || 0);
  const quality = input.quality.trim().toLowerCase();
  const storage = input.storage.trim().toLowerCase();

  let demandScore = cropDemand[cropKey] ?? 60;
  const reasons: string[] = [];

  if (quantity >= 1000) {
    demandScore += 6;
    reasons.push('Larger volume improves bulk-buyer suitability.');
  } else if (quantity < 250) {
    demandScore -= 4;
    reasons.push('Smaller lots may benefit from aggregation with nearby farmers/FPOs.');
  }

  if (quality.includes('grade a') || quality === 'a') {
    demandScore += 7;
    reasons.push('Higher stated quality increases buyer matching potential.');
  }

  if (storage.includes('cold')) {
    demandScore += 3;
    reasons.push('Cold storage can extend the available selling window.');
  }

  const score = Math.max(0, Math.min(100, Math.round(demandScore)));
  const demandLevel = score >= 75 ? 'High' : score >= 55 ? 'Medium' : 'Low';

  const perishable = ['tomato', 'mango', 'banana', 'chilli'].includes(cropKey);
  const window = storage.includes('cold')
    ? perishable ? '5–7 days' : '7–12 days'
    : perishable ? '2–4 days' : '4–7 days';

  const buyerMatches = Math.max(1, Math.min(6,
    Math.round(1 + score / 28 + (quantity >= 1000 ? 1 : 0) + (quality.includes('grade a') ? 1 : 0))
  ));

  const bulkOpportunity = quantity >= 2000 ? 'Strong' : quantity >= 500 ? 'Potential' : 'Limited';
  const freshnessRisk = storage.includes('cold') ? 'Low' : perishable ? 'High' : 'Medium';
  const logisticsPriority = quantity >= 2000 ? 'High' : quantity >= 500 ? 'Medium' : 'Low';

  if (input.location.trim()) reasons.push(`Location captured for future distance and route scoring: ${input.location.trim()}.`);
  if (input.harvestDate) reasons.push('Harvest date is included so the selling-window model can be upgraded with historical market data.');

  return { demandLevel, demandScore: score, sellingWindowDays: window, buyerMatches, bulkOpportunity, freshnessRisk, logisticsPriority, reasons, prototype: true };
}
