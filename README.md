# 🌾 FarmPlug AI

> **From Farm Intelligence to the Right Market.**

Smart India Hackathon 2026 • **Problem Statement 26033** • Software • Agriculture, FoodTech & Rural Development

## The problem

Farmers and FPOs can have produce ready without knowing the strongest available demand, the most suitable buyer, whether their own lot is large enough for a bulk requirement, or how the collection and delivery journey should be coordinated.

SIH26033 asks for a digital marketplace that connects farmers/FPOs with consumers and bulk buyers, provides logistics support, and uses AI for demand forecasting and route optimization.

## What FarmPlug AI adds

FarmPlug is positioned as an **intelligence + fulfillment layer around agricultural market activity**, not as a replacement for e-NAM or existing mandis.

**PLAN → PREDICT → PRESERVE → MATCH → AGGREGATE → QUOTE → ORDER → DELIVER**

The platform helps answer five practical questions:

1. **What market signal should I consider?** — demand outlook.
2. **When should I prioritize selling?** — FreshLife selling-window intelligence.
3. **Who can absorb my quantity and quality?** — explainable buyer matching.
4. **Can several small lots fulfil one bulk requirement?** — supply aggregation.
5. **How should the produce move?** — route and collection planning.

## SIH differentiation

A generic marketplace only lists produce and buyers. FarmPlug connects the decision chain around the transaction:

**Farmer/FPO input → explainable decision score → buyer fit → aggregation → quote → order lifecycle → logistics**

The Decision Center exposes component signals for market, quantity/aggregation, quality, freshness/storage and logistics readiness. This makes the prototype explainable instead of presenting a black-box number.

## e-NAM positioning

FarmPlug AI **complements rather than replaces** e-NAM. e-NAM already provides digital agricultural trading, price discovery and FPO participation. FarmPlug focuses on the surrounding predictive and fulfillment workflow: demand-oriented planning, selling-window prioritization, buyer-fit scoring, fragmented-supply aggregation and route planning.

## 2-minute judge demo

1. Open **Decision Center**.
2. Choose crop, location, quantity, quality, harvest date and storage.
3. Run the analysis.
4. Show the demand score and explainable component breakdown.
5. Move to Marketplace / Buyer Command Center.
6. Demonstrate a farmer supply listing and buyer requirement.
7. Request a quote → farmer accepts → order lifecycle begins.
8. Open Orders and show collection/transit/delivery states.
9. Demonstrate route planning with live road routing when locations are supplied.

## Core modules

- Farmer/FPO onboarding and produce listings
- Buyer requirements and matching
- Explainable AI Decision Center
- Demand outlook prototype
- FreshLife selling-window intelligence
- Buyer matching
- Multi-farmer supply aggregation
- Quote request and acceptance
- Order lifecycle tracking
- Logistics and route optimization support
- Admin monitoring and role-based authorization
- Gemini-powered prototype assistant

## AI and validation status

The current decision engine is a **transparent prototype scoring system**, not a trained ML model. It intentionally avoids claiming guaranteed prices, income, demand accuracy or scientific validation.

### Pilot upgrade path

Validated production intelligence should be trained/calibrated from:

- historical mandi/market prices and arrivals
- crop and location seasonality
- buyer requirements and fulfilment outcomes
- harvest and post-harvest timing
- weather/market signals where legally and technically available
- actual route distance, time and collection outcomes

Candidate production models can use time-series/gradient-boosting methods for demand and price signals, with offline validation and drift monitoring before farmer-facing deployment.

## Logistics

FarmPlug has a server-side routing boundary designed around OpenStreetMap-compatible geocoding and OSRM road routing. Route results should be treated as planning estimates and rechecked before operational dispatch.

## Impact KPIs

No fabricated success percentages are used. A pilot should measure:

- buyer match rate
- quote-to-order conversion
- fulfilment rate
- aggregated kilograms fulfilled
- time from listing to buyer commitment
- selling-window utilization
- route distance/time per delivered kilogram
- farmer/FPO market-access outcomes

## Technology

- Next.js + TypeScript
- React + responsive CSS
- Lucide React
- Supabase / PostgreSQL-ready data layer
- Secure server APIs with role-based authorization
- Gemini prototype assistant
- OpenStreetMap-compatible geocoding
- OSRM-compatible road routing
- Python + FastAPI-ready AI service boundary
- Scikit-learn / PyTorch for future validated models
- OR-Tools for future collection optimization
- Vercel deployment

## Data integrity and safety

This prototype does **not** claim:

- guaranteed income or profits
- scientifically validated AI predictions
- fake or pre-completed real-world transactions
- government endorsements or partnerships
- real-time GPS tracking unless a live GPS source is connected

Demo data is clearly labelled. Pilot KPIs are presented as **to be measured and validated**.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Status

**Stage:** SIH 2026 MVP prototype

**Target:** demonstrate a complete farm-to-market intelligence and fulfillment workflow in approximately two minutes, while keeping every prototype claim transparent and leaving clear boundaries for validated data/model integration.
