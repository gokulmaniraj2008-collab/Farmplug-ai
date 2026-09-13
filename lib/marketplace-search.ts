export function escapeIlikeSearchTerm(value: string): string {
  return value.replace(/[%_,]/g, "\\$&");
}

export function buildMarketplaceSearchFilter(query: string): string | null {
  const normalized = query.trim();
  if (!normalized) return null;

  const escaped = escapeIlikeSearchTerm(normalized);
  return `crop_name.ilike.%${escaped}%,location_text.ilike.%${escaped}%,quality_grade.ilike.%${escaped}%`;
}
