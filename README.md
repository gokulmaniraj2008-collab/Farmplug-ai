# 🌾 FarmPlug AI

> **From Farm Intelligence to the Right Market.**

Smart India Hackathon 2026 • **Problem Statement 26033** • Software • Agriculture, FoodTech & Rural Development

## What it does

FarmPlug AI is a predictive intelligence layer for Farmers and FPOs. It complements existing agricultural market infrastructure such as e-NAM rather than replacing it.

The MVP connects:

**Farmers / FPOs → FarmPlug AI → Buyers / Processors / Exporters**

Core intelligence:
- Demand forecasting
- Production decision support
- FreshLife AI selling-window intelligence
- Smart buyer matching
- Supply aggregation
- Logistics and route optimization support

## ⚡ 2-minute judge demo

The primary experience is the **FarmPlug AI Decision Center**:

1. Choose crop, location, quantity, quality and storage.
2. Click **Analyze with FarmPlug AI**.
3. Review Demand Outlook, Selling Window, Buyer Matches, Bulk Opportunity and Logistics.
4. Continue to Marketplace, aggregation and route-planning views.

The current MVP uses realistic fictional demo data. Results are explicitly labelled as **AI Demo Prediction — Prototype Demonstration** and are not scientifically validated predictions.

## Product journey

**PLAN → PREDICT → PRESERVE → MATCH → AGGREGATE → DELIVER → SELL**

## e-NAM positioning

FarmPlug AI complements existing agricultural market infrastructure. It focuses on the predictive layer around market activity: demand forecasting, production decision support, selling-window intelligence, matching, aggregation and route optimization.

## Technology

- Next.js + TypeScript
- React + responsive CSS
- Lucide React
- Recharts-ready dashboard architecture
- Supabase-ready data layer
- Python + FastAPI-ready AI service boundary
- PostgreSQL
- Scikit-learn / PyTorch for future validated models
- OR-Tools for future optimization
- OpenStreetMap-compatible mapping architecture
- Vercel deployment

## Safety and data integrity

This prototype does **not** claim:
- guaranteed income or profits
- scientifically validated predictions
- real buyer orders
- government endorsements or partnerships
- real-time GPS routing without a connected mapping service

Pilot KPIs are intentionally presented as **to be measured and validated**.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment

Designed for deployment on Vercel with Supabase available for the production data/auth layer when backend integration is enabled.

## Status

**Stage:** SIH 2026 MVP prototype

**Primary goal:** demonstrate the complete intelligence workflow clearly within 1–2 minutes, then replace simulated services with validated data and models during pilot development.
