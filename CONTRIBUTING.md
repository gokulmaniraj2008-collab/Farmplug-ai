# Contributing to FarmPlug AI

FarmPlug AI is a farmer-to-market intelligence platform. Contributions should improve reliability, usability, security, or maintainability without introducing unverified claims about production integrations.

## Before opening a pull request

1. Keep the change focused and explain the user or engineering problem it solves.
2. Do not commit API keys, service-role credentials, passwords, private keys, or `.env` files.
3. Preserve existing Supabase Row Level Security and authentication boundaries.
4. Add or update tests when behavior changes.
5. Run the relevant checks locally when available:
   - `npm test`
   - `npm run typecheck`
   - `npm run build`

## Pull request checklist

- [ ] The change has a clear purpose.
- [ ] No secrets or credentials are included.
- [ ] Existing behavior is preserved unless intentionally changed.
- [ ] Tests cover important behavior changes.
- [ ] Documentation is updated when setup or user-facing behavior changes.
- [ ] Production/demo status is described accurately.

## Review standard

Prefer small, reviewable pull requests. Explain trade-offs and verification results in the PR description. Security-sensitive changes should receive careful review before deployment.
