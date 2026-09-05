export type DecisionInput = {
  crop: string;
  quantityKg: number;
  location: string;
  quality: string;
  harvestDate: string;
  storage: string;
};

export type MatchInput = { crop: string; quantityKg: number; quality: string; location: string; availableUntil?: string | null };
export type MatchResult = { score: number; label: 'HIGH' | 'MEDIUM' | 'LOW'; reasons: string[] };
export type DecisionBreakdown = { market: number; quantity: number; quality: number; freshness: number; logistics: number };
export type DecisionResult = {
  demandLevel: 'High' | 'Medium' | 'Low';
  demandScore: number;
  sellingWindowDays: string;
  buyerMatches: number;
  bulkOpportunity: 'Strong' | 'Potential' | 'Limited';
  freshnessRisk: 'Low' | 'Medium' | 'High';
  logisticsPriority: 'Low' | 'Medium' | 'High';
  breakdown: DecisionBreakdown;
  reasons: string[];
  prototype: true;
};

// Prototype priors only. Replace/calibrate with validated market, price,
// arrivals, seasonality and historical demand data during pilot deployment.
const cropDemand: Record<string, number> = { tomato: 82, onion: 72, potato: 68, mango: 64, banana: 70, chilli: 66, rice: 62, wheat: 60 };
const normalize = (value: string) => value.trim().toLowerCase();
const tokens = (value: string) => new Set(normalize(value).split(/[^a-z0-9]+/).filter(Boolean));

export function scoreSupplyMatch(requirement: MatchInput, supply: MatchInput): MatchResult {
  const reasons: string[] = [];
  let score = 0;
  if (normalize(requirement.crop) === normalize(supply.crop)) { score += 35; reasons.push('Crop matches buyer requirement.'); } else return { score: 0, label: 'LOW', reasons: ['Crop does not match.'] };
  if (normalize(requirement.quality) === normalize(supply.quality)) { score += 20; reasons.push('Quality grade matches.'); }
  else if (normalize(supply.quality).includes('mixed')) { score += 8; reasons.push('Mixed grade can be considered with buyer approval.'); }
  const required = Math.max(1, Number(requirement.quantityKg) || 1);
  const available = Math.max(0, Number(supply.quantityKg) || 0);
  score += Math.round(Math.min(1, available / required) * 25);
  reasons.push(available >= required ? 'Supply can fulfil the requested quantity.' : 'Partial supply; aggregation may be needed.');
  const reqTokens = tokens(requirement.location); const supTokens = tokens(supply.location);
  const overlap = [...reqTokens].filter(token => supTokens.has(token)).length;
  if (normalize(requirement.location) === normalize(supply.location)) { score += 15; reasons.push('Same stated location improves collection feasibility.'); }
  else if (overlap > 0) { score += 8; reasons.push('Location names partially overlap.'); }
  else reasons.push('Distance needs live route calculation before commitment.');
  if (supply.availableUntil) {
    const days = (new Date(supply.availableUntil).getTime() - Date.now()) / 86400000;
    if (days >= 3) score += 5; else if (days >= 0) score += 2; else score -= 8;
  }
  const finalScore = Math.max(0, Math.min(100, score));
  return { score: finalScore, label: finalScore >= 75 ? 'HIGH' : finalScore >= 50 ? 'MEDIUM' : 'LOW', reasons };
}

export function runDecisionEngine(input: DecisionInput): DecisionResult {
  const cropKey = normalize(input.crop);
  const quantity = Math.max(0, Number(input.quantityKg) || 0);
  const quality = normalize(input.quality);
  const storage = normalize(input.storage);
  const market = cropDemand[cropKey] ?? 60;
  const reasons: string[] = [];
  if (input.location.trim()) reasons.push(`Location captured for distance and route scoring: ${input.location.trim()}.`);

  let quantityScore = 2;
  if (quantity >= 2000) { quantityScore = 10; reasons.push('Large lot is better positioned for bulk procurement.'); }
  else if (quantity >= 500) { quantityScore = 6; reasons.push('Mid-size lot has useful buyer and aggregation potential.'); }
  else reasons.push('Small lot is more likely to benefit from aggregation.');

  let qualityScore = 4;
  if (quality.includes('grade a') || quality === 'a') { qualityScore = 7; reasons.push('Grade A quality increases direct-buyer suitability.'); }
  else if (quality.includes('mixed')) { qualityScore = 2; reasons.push('Mixed quality may reduce direct matching until grading is confirmed.'); }

  const perishable = ['tomato', 'mango', 'banana', 'chilli'].includes(cropKey);
  const coldStorage = storage.includes('cold');
  const freshnessRisk: 'Low' | 'Medium' | 'High' = coldStorage ? 'Low' : perishable ? 'High' : 'Medium';
  const sellingWindowDays = coldStorage ? (perishable ? '5–7 days' : '7–12 days') : (perishable ? '2–4 days' : '4–7 days');
  const freshnessScore = coldStorage ? 10 : perishable ? 2 : 6;
  if (coldStorage) reasons.push('Cold storage improves flexibility around the selling window.');
  else if (perishable) reasons.push('Perishable crop without cold storage should be prioritized for faster sale.');

  let harvestUrgency = 0;
  if (input.harvestDate) {
    const daysToHarvest = (new Date(input.harvestDate).getTime() - Date.now()) / 86400000;
    if (daysToHarvest <= 1) harvestUrgency = perishable ? -8 : -3;
    else if (daysToHarvest <= 3) harvestUrgency = perishable ? -4 : -1;
    else if (daysToHarvest <= 14) harvestUrgency = 1;
    else harvestUrgency = 2;
    reasons.push('Harvest timing is included as a bounded freshness/urgency signal.');
  }

  const logistics = quantity >= 2000 ? 9 : quantity >= 500 ? 6 : 3;
  const logisticsPriority: 'Low' | 'Medium' | 'High' = quantity >= 2000 || freshnessRisk === 'High' ? 'High' : quantity >= 500 ? 'Medium' : 'Low';
  const demandScore = Math.max(0, Math.min(100, Math.round((market * 0.60) + (quantityScore * 0.12) + (qualityScore * 0.10) + (freshnessScore * 0.10) + (logistics * 0.08) + harvestUrgency)));
  const demandLevel = demandScore >= 75 ? 'High' : demandScore >= 55 ? 'Medium' : 'Low';
  const buyerMatches = Math.max(1, Math.min(6, Math.round(1 + demandScore / 30 + (quantity >= 1000 ? 1 : 0) + (qualityScore >= 7 ? 1 : 0))));
  const bulkOpportunity = quantity >= 2000 ? 'Strong' : quantity >= 500 ? 'Potential' : 'Limited';

  reasons.push('Route feasibility should be confirmed with live road distance before commitment.');
  reasons.push('Prototype score must be replaced or calibrated with validated market prices, arrivals, seasonality and historical demand data.');
  return {
    demandLevel,
    demandScore,
    sellingWindowDays,
    buyerMatches,
    bulkOpportunity,
    freshnessRisk,
    logisticsPriority,
    breakdown: { market, quantity: quantityScore * 10, quality: qualityScore * 10, freshness: freshnessScore * 10, logistics: logistics * 10 },
    reasons,
    prototype: true,
  };
}
