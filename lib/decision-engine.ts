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
  const quantityRatio = Math.min(1, available / required);
  score += Math.round(quantityRatio * 25);
  reasons.push(available >= required ? 'Supply can fulfil the requested quantity.' : 'Partial supply; aggregation may be needed.');
  const reqTokens = tokens(requirement.location); const supTokens = tokens(supply.location);
  const overlap = [...reqTokens].filter(token => supTokens.has(token)).length;
  if (normalize(requirement.location) === normalize(supply.location)) { score += 15; reasons.push('Same stated location improves collection feasibility.'); }
  else if (overlap > 0) { score += 8; reasons.push('Location names partially overlap.'); }
  else reasons.push('Distance needs live route calculation before commitment.');
  if (supply.availableUntil) {
    const days = (new Date(supply.availableUntil).getTime() - Date.now()) / 86400000;
    if (days >= 3) score += 5;
    else if (days >= 0) score += 2;
    else score -= 8;
  }
  const finalScore = Math.max(0, Math.min(100, score));
  return { score: finalScore, label: finalScore >= 75 ? 'HIGH' : finalScore >= 50 ? 'MEDIUM' : 'LOW', reasons };
}

export function runDecisionEngine(input: DecisionInput): DecisionResult {
  const cropKey = normalize(input.crop); const quantity = Math.max(0, Number(input.quantityKg) || 0); const quality = normalize(input.quality); const storage = normalize(input.storage);
  let demandScore = cropDemand[cropKey] ?? 60; const reasons: string[] = [];
  if (quantity >= 2000) { demandScore += 8; reasons.push('Large lot is better positioned for bulk procurement.'); }
  else if (quantity >= 500) { demandScore += 4; reasons.push('Mid-size lot has useful buyer and aggregation potential.'); }
  else if (quantity < 250) { demandScore -= 5; reasons.push('Small lot is more likely to benefit from aggregation.'); }
  if (quality.includes('grade a') || quality === 'a') { demandScore += 7; reasons.push('Grade A quality increases direct-buyer suitability.'); }
  else if (quality.includes('mixed')) { demandScore -= 2; reasons.push('Mixed quality may reduce direct matching until grading is confirmed.'); }
  if (storage.includes('cold')) { demandScore += 4; reasons.push('Cold storage improves flexibility around the selling window.'); }
  const score = Math.max(0, Math.min(100, Math.round(demandScore)));
  const demandLevel = score >= 75 ? 'High' : score >= 55 ? 'Medium' : 'Low';
  const perishable = ['tomato', 'mango', 'banana', 'chilli'].includes(cropKey);
  const window = storage.includes('cold') ? (perishable ? '5–7 days' : '7–12 days') : (perishable ? '2–4 days' : '4–7 days');
  const buyerMatches = Math.max(1, Math.min(6, Math.round(1 + score / 30 + (quantity >= 1000 ? 1 : 0) + (quality.includes('grade a') ? 1 : 0))));
  const bulkOpportunity = quantity >= 2000 ? 'Strong' : quantity >= 500 ? 'Potential' : 'Limited';
  const freshnessRisk = storage.includes('cold') ? 'Low' : perishable ? 'High' : 'Medium';
  const logisticsPriority = quantity >= 2000 || freshnessRisk === 'High' ? 'High' : quantity >= 500 ? 'Medium' : 'Low';
  if (input.location.trim()) reasons.push(`Location captured for distance and route scoring: ${input.location.trim()}.`);
  if (input.harvestDate) reasons.push('Harvest date is included in the prototype decision context.');
  reasons.push('Prototype score should be replaced or calibrated with validated market, price and historical demand data.');
  return { demandLevel, demandScore: score, sellingWindowDays: window, buyerMatches, bulkOpportunity, freshnessRisk, logisticsPriority, reasons, prototype: true };
}
