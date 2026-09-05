# 🌾 FarmPlug AI

> **Right Market. Right Buyer. Right Time.**

FarmPlug AI is a decision-to-market AgriTech platform that connects market intelligence, AI decision support, verified buyer discovery, supply aggregation, logistics and transparent digital transactions in one workflow.

## Product flow

**Farm/FPO → Market Data → Forecast → Selling Window → Buyer Match → Aggregation → Logistics → Quote → Order → Payment → Delivery → Impact**

## Current architecture

- **Web:** Next.js + TypeScript + mobile-first UI
- **Auth:** Supabase Auth
- **Database:** Supabase PostgreSQL with RLS
- **AI/ML:** Python/pandas/numpy/scikit-learn reference pipeline in `ml/`; forecasts are labelled Prototype Forecast until validated
- **Logistics:** routing/optimization data model ready for OpenStreetMap-compatible routing and OR-Tools integration
- **Mobile:** PWA/Android-compatible Farmer experience using the same backend
- **Deployment:** Vercel + GitHub

## Security

The Farmer app no longer stores passwords in localStorage. Authentication uses Supabase Auth sessions. Database mutations are protected by ownership/RLS policies, and critical order progression is exposed through a server-side PostgreSQL state-transition function.

## Data honesty

FarmPlug AI does not invent live prices, buyers, payments, GPS positions or model accuracy. Data that is illustrative is explicitly marked **DEMO DATA**. Unvalidated forecasts are **Prototype Forecast**. Escrow/payment demonstrations are **Payment Simulation** until a real provider is integrated.

## Database foundation

The version-controlled migrations cover:

- Farmer, FPO and buyer profiles
- Farms and crops
- Markets, prices, arrivals and demand
- Price and demand forecasts
- AI predictions and recommendations
- Explainable buyer matches
- Multi-farmer supply aggregation
- Logistics routes and delivery events
- Payments and escrow simulation
- Notifications, disputes and audit logs
- Strict order lifecycle: `quote_pending → quote_accepted → order_confirmed → collecting → in_transit → delivered → completed`

## ML foundation

`ml/train.py` implements a real, reproducible baseline regression pipeline with chronological holdout evaluation and records MAE/RMSE/MAPE plus model and dataset versions. It intentionally refuses undersized datasets instead of manufacturing an accuracy claim.

## Demo vs production

The interface is production-oriented, but live market ingestion, trained forecasting models, verified buyer onboarding, routing-provider credentials and payment-provider integration still require their respective real data/services before commercial launch. No unsupported integration is represented as complete.

## Development

```bash
npm install
npm run typecheck
npm run build
```

Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the deployment environment. Never commit service-role keys or other secrets.

---

**FarmPlug AI — Right Market. Right Buyer. Right Time.**
