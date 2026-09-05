# FarmPlug AI API Contract

SIH 2026 prototype contract for the active Next.js backend.

## Authentication

Authenticated farmer/buyer/order endpoints expect:

`Authorization: Bearer <Supabase access token>`

Server-only Supabase secret keys are never sent to the browser.

## Decision Center

`POST /api/decision`

Request:

```json
{
  "crop": "Tomato",
  "quantityKg": 500,
  "location": "Coimbatore",
  "quality": "Grade A",
  "harvestDate": "2026-09-10",
  "storage": "Cold Storage"
}
```

`quantityKg` must be a finite positive number. The route also accepts the legacy aliases `quantity` and `qty` for compatibility.

## Farmer supply listing

`GET /api/farmer/listings` — lists the signed-in farmer's listings.

`POST /api/farmer/listings`

Required: `crop`, `quantityKg`, `location`.

Optional: `farmerName`, `quality`, `availableUntil`.

Quantity must be finite and greater than zero.

## Buyer requirements

`GET /api/buyer/requirements` — returns open buyer requirements.

The database contract uses `quantity_kg`, with a database check requiring a value greater than zero.

## Quote request

`POST /api/buyer/quote`

Request:

```json
{
  "requirementId": "<uuid>",
  "supplyListingId": "<uuid>",
  "message": "Optional note"
}
```

Only the owner of the buyer requirement can create its quote request. The requirement must be open and the supply listing must be available.

## Quote response and order creation

`PATCH /api/farmer/quotes`

Request:

```json
{
  "id": "<quote-request-uuid>",
  "status": "accepted"
}
```

Accepting a valid pending quote reserves the listing and creates a confirmed order. The operation is rolled back when order creation fails.

## Orders

`GET /api/orders` — returns orders where the signed-in user is buyer or farmer.

`PATCH /api/orders`

Allowed lifecycle:

`confirmed → collecting → in_transit → delivered → completed`

Cancellation is allowed from `confirmed`, `collecting`, and `in_transit`.

Role rules are enforced server-side: the farmer starts collection/dispatch and marks delivery; the buyer confirms completion.

## Logistics

`POST /api/logistics/route`

Request:

```json
{
  "locations": ["Coimbatore", "Chennai"]
}
```

Requires at least two non-empty locations. The prototype geocodes with OpenStreetMap Nominatim and routes with OSRM. External-service failures return an explicit error instead of a fabricated route.

## Error contract

Errors are JSON objects with an `error` message. AI errors additionally include a stable `code` such as `GEMINI_NOT_CONFIGURED`, `GEMINI_INVALID_REQUEST`, or `GEMINI_SERVICE_ERROR`.

## Prototype limitation

This contract describes the current SIH prototype. It does not claim live market prices, guaranteed buyer commitments, production-grade demand forecasts, or production logistics SLAs.
