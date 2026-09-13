import assert from "node:assert/strict";
import test from "node:test";
import { buildMarketplaceSearchFilter, escapeIlikeSearchTerm } from "../lib/marketplace-search.ts";

test("escapes ILIKE wildcard characters", () => {
  assert.equal(escapeIlikeSearchTerm("rice%_grade,1"), "rice\\%\\_grade\\,1");
});

test("builds the three-field marketplace filter", () => {
  assert.equal(
    buildMarketplaceSearchFilter("  paddy  "),
    "crop_name.ilike.%paddy%,location_text.ilike.%paddy%,quality_grade.ilike.%paddy%",
  );
});

test("returns null for an empty search", () => {
  assert.equal(buildMarketplaceSearchFilter("   "), null);
});
