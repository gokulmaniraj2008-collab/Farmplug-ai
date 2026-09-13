# FarmPlug AI

**Your Farm's Plug to Every Market.**

FarmPlug AI is an agriculture market-intelligence platform designed to strengthen market linkages and price discovery for farmers, FPOs, buyers, processors, and exporters.

## What it does

FarmPlug AI is designed around the farm-to-market decision loop:

- **Demand intelligence** — understand what markets and buyers need.
- **Production planning** — connect expected demand with farm decisions.
- **Selling-window intelligence** — help users evaluate when to sell.
- **Buyer matching** — connect suitable produce with relevant buyers.
- **Aggregation** — support bulk-order opportunities for farmers and FPOs.
- **Market operations** — provide a foundation for order, payment-status, and delivery workflows.

The project is intentionally built so that live integrations and simulated/demo flows are clearly distinguished rather than presented as real services when they are not connected.

## Technology

- Next.js 15
- React 19
- TypeScript 5
- Supabase (`@supabase/ssr` and `@supabase/supabase-js`)
- Tailwind CSS 4
- Lucide React
- Android farmer-app code in `android/` and `farmer_app/`

The web application currently requires **Node.js >= 20.9.0**. The repository's main development scripts are `dev`, `build`, `start`, `lint`, and `typecheck`.

## Repository map

```text
app/                 Next.js application routes and UI entry points
components/          Reusable React components
lib/                 Shared application utilities and integrations
migrations/          Database migration files
android/             Android application project
farmer_app/          Farmer-app related source
.github/             CI and security automation
docs/                Project and engineering documentation
SECURITY.md          Security reporting policy
MANIFEST.md          Consolidated build/verification notes
```

## Local development

1. Install Node.js 20.9+.
2. Install dependencies with `npm install`.
3. Configure the environment variables required by the application using your local `.env.local` file.
4. Start the development server:

```bash
npm run dev
```

For a production-style verification:

```bash
npm run typecheck
npm run build
npm run start
```

**Never commit API keys, service-role keys, OAuth secrets, or other credentials.** See `SECURITY.md` for reporting and handling guidance.

## Quality and security automation

FarmPlug AI uses GitHub Actions for repository-level engineering checks. Pull requests and `main` pushes are covered by dependency/security checks and a quality gate for TypeScript typechecking and the Next.js production build.

These checks are verification mechanisms, not proof that external services such as payments, GPS, AI providers, or live market feeds are connected. Integration status must be evaluated separately.

## Engineering principles

1. **No fake integrations** — simulated/demo behavior must be labeled.
2. **Security first** — secrets stay outside Git history.
3. **Production-minded changes** — prefer small, reviewable pull requests.
4. **Evidence over claims** — CI results and runtime verification should support release claims.
5. **Farmer-first UX** — technical complexity should not obscure the farm-to-market outcome.

## Documentation

- `FARMPLUG_AI_MASTER_PROMPT.md` — consolidated project/product direction.
- `MANIFEST.md` — current consolidated build and verification notes.
- `SECURITY.md` — vulnerability reporting and security policy.
- `docs/` — engineering documentation.

## Status

FarmPlug AI is an active development project. Features that depend on external providers, credentials, real-world data, payment gateways, or device integrations should be treated as integration-dependent until verified in the target environment.
