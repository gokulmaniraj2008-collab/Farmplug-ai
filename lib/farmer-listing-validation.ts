export type FarmerListingForm = {
  crop_id: string;
  quantity_kg: string;
  location: string;
  available_until: string;
};

export type FarmerListingFormErrors = {
  crop_id?: string;
  quantity_kg?: string;
  location?: string;
  available_until?: string;
};

export type CropAvailability = {
  available_quantity_kg: number | null;
};

export function validateFarmerListingForm(form: FarmerListingForm): FarmerListingFormErrors {
  const errors: FarmerListingFormErrors = {};
  const quantity = Number(form.quantity_kg);

  if (!form.crop_id) {
    errors.crop_id = "Please select a produce item.";
  }

  if (!form.quantity_kg.trim()) {
    errors.quantity_kg = "Quantity is required.";
  } else if (!Number.isFinite(quantity) || quantity <= 0) {
    errors.quantity_kg = "Quantity must be greater than 0.";
  }

  if (!form.location.trim()) {
    errors.location = "Location is required.";
  }

  if (form.available_until) {
    const parsedDate = new Date(`${form.available_until}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.available_until = "Please enter a valid date.";
    }
  }

  return errors;
}

export function validateAvailableQuantity(
  quantityKg: number,
  crop: CropAvailability,
): string | undefined {
  if (crop.available_quantity_kg != null && quantityKg > crop.available_quantity_kg) {
    return `Quantity cannot exceed ${crop.available_quantity_kg} kg available.`;
  }

  return undefined;
}
