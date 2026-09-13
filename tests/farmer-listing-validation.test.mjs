import assert from "node:assert/strict";
import test from "node:test";
import {
  validateAvailableQuantity,
  validateFarmerListingForm,
} from "../lib/farmer-listing-validation.ts";

const validForm = {
  crop_id: "crop-1",
  quantity_kg: "25",
  location: "Coimbatore",
  available_until: "2026-12-31",
};

test("requires a crop selection", () => {
  const errors = validateFarmerListingForm({ ...validForm, crop_id: "" });
  assert.equal(errors.crop_id, "Please select a produce item.");
});

test("requires a quantity", () => {
  const errors = validateFarmerListingForm({ ...validForm, quantity_kg: "" });
  assert.equal(errors.quantity_kg, "Quantity is required.");
});

test("rejects zero, negative, and non-finite quantities", () => {
  for (const quantity of ["0", "-2", "not-a-number"]) {
    const errors = validateFarmerListingForm({ ...validForm, quantity_kg: quantity });
    assert.equal(errors.quantity_kg, "Quantity must be greater than 0.");
  }
});

test("requires a location", () => {
  const errors = validateFarmerListingForm({ ...validForm, location: "   " });
  assert.equal(errors.location, "Location is required.");
});

test("accepts a valid available-until date and rejects an invalid date value", () => {
  assert.equal(validateFarmerListingForm(validForm).available_until, undefined);
  const errors = validateFarmerListingForm({ ...validForm, available_until: "not-a-date" });
  assert.equal(errors.available_until, "Please enter a valid date.");
});

test("rejects quantities above the crop's available quantity", () => {
  assert.equal(
    validateAvailableQuantity(26, { available_quantity_kg: 25 }),
    "Quantity cannot exceed 25 kg available.",
  );
});

test("allows a quantity within the crop's available quantity", () => {
  assert.equal(validateAvailableQuantity(25, { available_quantity_kg: 25 }), undefined);
  assert.equal(validateAvailableQuantity(25, { available_quantity_kg: null }), undefined);
});

test("returns no validation errors for valid input", () => {
  assert.deepEqual(validateFarmerListingForm(validForm), {});
});
