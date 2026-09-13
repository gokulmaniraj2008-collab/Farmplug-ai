# Security Policy

## Supported versions

Security fixes are currently targeted at the `main` branch and the latest published application build.

## Reporting a vulnerability

Please do **not** open a public GitHub issue for a suspected security vulnerability.

Report it privately through the repository owner's GitHub security contact / private vulnerability reporting when available. Include:

- a clear description of the issue;
- affected route, component, or API surface;
- reproduction steps or a minimal proof of concept;
- the potential impact; and
- any suggested mitigation, if known.

Do not include passwords, API keys, access tokens, personal data, payment credentials, or other secrets in the report.

## What to report

Examples include:

- authentication or authorization bypasses;
- accidental exposure of Supabase credentials or service-role access;
- insecure server-side API handling;
- cross-site scripting or injection vulnerabilities;
- insecure direct object references or broken role isolation; and
- sensitive information disclosed through logs, error responses, or client bundles.

## Secrets

Never commit production secrets to Git. Browser-visible configuration must use only values intended to be public. Server-only credentials must remain in the deployment environment and must not be copied into client components.

If a secret is accidentally committed, treat it as compromised: revoke or rotate it first, then remove it from the repository history as appropriate.

## Disclosure

Please allow time for investigation and remediation before publicly disclosing a vulnerability. We will document security fixes in release notes when appropriate.