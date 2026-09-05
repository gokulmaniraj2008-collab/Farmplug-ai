# 🌾 FarmPlug AI

> **Right Market. Right Buyer. Right Time.**

FarmPlug AI is a decision-to-market AgriTech platform connecting market intelligence, AI decision support, buyer discovery, supply aggregation, logistics and transparent transactions.

## Production foundation
- Next.js + TypeScript mobile-first Farmer experience
- Supabase Auth sessions; no password storage in localStorage
- Supabase PostgreSQL with RLS
- Farmer, FPO and buyer profile foundations
- Farms, crops, markets, prices, arrivals and demand
- Price/demand forecast storage with model + dataset versioning
- Explainable buyer matching and multi-farmer aggregation schema
- Logistics routes and delivery events
- Payment and escrow simulation storage
- Notifications, disputes and audit logs
- Strict quote/order lifecycle with a protected PostgreSQL transition function
- Reproducible Python/scikit-learn ML baseline in `ml/train.py`

## Data honesty
**DEMO DATA**, **Prototype Forecast**, and **Payment Simulation** are explicitly labelled. FarmPlug AI does not claim live prices, verified buyers, real payments, GPS or validated AI accuracy without the corresponding real service/data.

## Development
`npm install && npm run typecheck && npm run build`

Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel. Never commit server secrets.

## Deployment
The `main` branch is the source of truth for the connected Vercel project.

**FarmPlug AI — Right Market. Right Buyer. Right Time.**
