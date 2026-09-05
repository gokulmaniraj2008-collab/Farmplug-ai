# FarmPlug AI End-to-End Test Report

**Audit date:** 2026-09-05  
**Target:** `main` / Vercel production deployment  
**Scope:** Farmer → Buyer → Quote → Order → Logistics → Admin

## Test matrix

| Test | Expected | Result |
|---|---|---|
| Decision API positive quantity | 200 response | Route validation reviewed; live authenticated execution pending |
| Decision API zero/negative quantity | 400 | Implemented and reviewed |
| Farmer listing without token | 401 | Implemented and reviewed |
| Farmer listing with valid token | Create listing | Implemented; live authenticated execution pending |
| Buyer requirement listing | Open requirements returned | Implemented; live execution pending |
| Quote request ownership | Only requirement owner can request | Implemented and reviewed |
| Quote acceptance | Reserve listing + create order | Implemented with rollback handling; live execution pending |
| Invalid order transition | 409 | Implemented and reviewed |
| Order participant authorization | 403 for non-participant | Implemented and reviewed |
| Logistics with <2 locations | 400 | Implemented and reviewed |
| Logistics provider failure | 502/422, no fabricated route | Implemented and reviewed |
| Gemini failure | Stable JSON error | Implemented; production error history reviewed |
| Mobile viewport | No clipping/horizontal overflow | Requires real-device/browser verification |

## Production deployment verification

Vercel production currently has a **READY** deployment from the latest GitHub `main` commit `726d2ce4742cee06f7087309cad764173eecadf3` (`chore: protect local environment files from Git`). The deployment build completed successfully; the inspected Vercel build log contains no build errors. The production site returns HTTP 200, and `/manifest.webmanifest` returns HTTP 200 with `display: standalone` and portrait orientation.

The inspected production runtime error window (last 6 hours at audit time) contains **no error or fatal logs**.

Previous production history contained Gemini 400 errors on `/api/chat`, including an old `max_tokens` parameter error and an input content-shape error. The current repository route uses `max_output_tokens` and sends the expected single text input shape. No new runtime errors were observed in the inspected 6-hour window.

## Evidence limitation

The connected tools can inspect source, deployment state, runtime logs, and database schema, but this audit did not have a signed-in test account/session suitable for executing the full authenticated transaction flow. Therefore the complete flow is **not claimed as passed**.

## SIH recommendation

Do not claim production readiness until the authenticated flow is executed end-to-end at least five times, including one failure-path run, and the Farmer PWA is verified on a real Android device.
