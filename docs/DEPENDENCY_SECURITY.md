# Dependency Security Checks

FarmPlug AI runs automated dependency security checks for pull requests and pushes to `main`.

## Checks

- `npm audit --omit=dev --audit-level=high` checks production dependencies for high or critical advisories.
- GitHub Dependency Review checks dependency changes introduced by pull requests.

The checks are currently non-blocking (`continue-on-error: true`) so existing dependency findings can be reviewed and remediated without unexpectedly blocking delivery.

## Response process

1. Read the advisory and identify the affected package and version range.
2. Prefer upgrading to a supported patched version.
3. Review the changelog for breaking changes before upgrading.
4. Run the project's typecheck/build checks after the update.
5. Do not commit credentials, API keys, or other secrets while resolving findings.

Once the repository has a clean baseline, these checks can be made required by removing the non-blocking configuration.