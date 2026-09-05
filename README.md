# 🌾 FarmPlug AI

> **From Farm Intelligence to the Right Market.**

**Smart India Hackathon 2026 • Problem Statement 26033**

FarmPlug AI is a farmer-first AgriTech platform designed to connect farm intelligence, produce aggregation, buyer matching, orders and logistics in one workflow.

## 🔗 Project Links

🌐 **FarmPlug AI Website:** https://farmplugaisxd.vercel.app

📱 **Farmer App / APK:** https://farmplugaisxd.vercel.app/download

💻 **GitHub Repository:** https://github.com/gokulmaniraj2008-collab/Farmplug-ai

## 📱 Farmer App

The Farmer experience is designed mobile-first for Android users.

- Farmer-focused interface
- Produce listing and supply information
- AI-assisted decision support
- Buyer matching
- Quote and order workflow
- Order tracking and logistics planning
- Connected to the same FarmPlug backend
- APK distribution is being prepared through the project release workflow

> **APK status:** The download page is the official entry point. The APK link should only be considered available after a GitHub release asset named `FarmPlug-AI.apk` has been successfully published.

## 🚀 Core Platform

FarmPlug AI brings the following workflow together:

**Farmer → Produce Listing → AI Decision Support → Buyer Matching → Quote → Order → Logistics**

### Key capabilities

- 🌱 **Farm Intelligence** — AI-assisted production and decision support
- 📈 **Demand Insights** — prototype demand forecasting and market signals
- 🤝 **Buyer Matching** — connect available produce with buyer requirements
- 📦 **Supply Aggregation** — combine fragmented farmer supply into buyer-ready quantities
- 🧾 **Quotes & Orders** — structured quote-to-order workflow
- 🚚 **Logistics Planning** — route and delivery planning using external routing services
- 💬 **AI Assistant** — Gemini-powered prototype assistant
- 📱 **Mobile Farmer Experience** — Android-focused Farmer app

## 🛠️ Technology Stack

- **Frontend:** Next.js + TypeScript + React
- **Backend:** Next.js API routes
- **Database:** Supabase / PostgreSQL
- **AI:** Gemini-powered prototype assistant
- **Mobile:** Android Farmer app / mobile-first web experience
- **Deployment:** Vercel
- **Version Control & CI:** GitHub

## 🏗️ Architecture

The active platform uses one Next.js application and one shared backend contract.

```text
Farmer / Buyer / Admin
          │
          ▼
   Next.js Web Platform
          │
          ├── Farmer App
          ├── Buyer Portal
          ├── Admin Dashboard
          ├── Decision Center
          └── Marketplace / Orders
          │
          ▼
     Next.js API Layer
          │
     ┌────┴────┐
     ▼         ▼
 Supabase   AI / Routing
 PostgreSQL  Services
```

The legacy Flutter/mobile implementation is not the active production architecture.

## 🔐 Security & Prototype Boundaries

- Server-side secrets must remain in deployment environment variables.
- Protected API routes perform authentication and authorization checks.
- Database access is backed by Supabase/PostgreSQL controls.
- Input validation is applied to critical API flows.
- AI recommendations and commercial decisions are advisory prototypes and require human validation.
- Logistics results depend on external geocoding/routing availability.

## 🧪 SIH Readiness

The project has been audited against an SIH-focused readiness scorecard.

**Current readiness estimate: ~8.5/10**

The highest-priority remaining validation is a real authenticated end-to-end test of:

**Farmer → Buyer → Quote → Order → Logistics**

along with real Android/PWA device testing. These are validation tasks, not claims of completed production certification.

## 📚 Documentation

- `docs/architecture.md` — system architecture and active platform boundaries
- `docs/api-contract.md` — API contracts and payload conventions
- `docs/security-checklist.md` — security review checklist
- `docs/end-to-end-test-report.md` — current E2E verification status
- `docs/demo-script.md` — SIH demonstration flow
- `docs/known-limitations.md` — prototype limitations and validation requirements

## ⚠️ Prototype Notice

FarmPlug AI is an **SIH 2026 prototype**. AI outputs, buyer matches, demand scores, logistics estimates and commercial recommendations require real-world validation before production use. The project does not claim live market prices, guaranteed AI accuracy, or real-time logistics unless explicitly connected and verified.

---

**FarmPlug AI — From Farm Intelligence to the Right Market.**

<!-- Vercel deployment trigger: corrected manifest is ready. -->
<!-- Vercel production rebuild trigger: 2026-09-05 -->
