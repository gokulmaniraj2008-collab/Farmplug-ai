# FarmPlug AI Architecture

## Active platform

FarmPlug AI uses one active web platform: Next.js + TypeScript on Vercel.

The Farmer experience is delivered from the same application as a mobile-first PWA. The active backend is the Next.js API layer backed by Supabase/PostgreSQL.

## High-level flow

```text
Farmer PWA / Web UI
        ↓
Next.js pages + components
        ↓
Next.js API routes
        ↓
Supabase Auth + PostgreSQL
        ↓
Buyer / Farmer / Order / Logistics workflows

Decision Center → deterministic prototype decision engine
AI Assistant   → Gemini Interactions API (server-side key)
Logistics      → OpenStreetMap Nominatim + OSRM
```

## Domain flow

```text
Farmer
  → supply listing
  → buyer requirement match
  → quote request
  → farmer accepts quote
  → confirmed order
  → collecting
  → in_transit
  → delivered
  → buyer confirms completed
```

## Security boundary

Browser clients send Supabase access tokens to protected Next.js API routes. Server routes validate the token before using privileged Supabase access. Server-only Supabase and Gemini credentials must remain in Vercel environment variables and must never be exposed through `NEXT_PUBLIC_*` variables.

## Prototype boundaries

Demand intelligence, matching, AI assistant responses and logistics are prototype capabilities. The application must not represent simulated predictions, buyer matches or estimates as guaranteed commercial commitments.
