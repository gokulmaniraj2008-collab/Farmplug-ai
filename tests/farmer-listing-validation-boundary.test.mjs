import assert from "node:assert/strict";
import test from "node:test";
import { validateAvailableQuantity } from "../lib/farmer-listing-validation.ts";

test("accepts a quantity exactly equal to the crop availability", () => {
  assert.equal(
    validateAvailableQuantity(25, { available_quantity_kg: 25 }),
    undefined,
  );
});
