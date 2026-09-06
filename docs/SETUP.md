# Google Login — Configuration Required (not code, must be done manually)

These files implement the code side. Google Login will not work until this
configuration exists — do not mark it "done" until you've verified each step.

## 1. Google Cloud Console
- Create OAuth 2.0 Client ID (Web application)
- Authorized redirect URI: `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
- Note the Client ID and Client Secret

## 2. Supabase Dashboard
Authentication → Providers → Google
- Paste Client ID + Client Secret
- Authentication → URL Configuration:
  - Site URL: your production URL (e.g. `https://farmplug.vercel.app`)
  - Redirect URLs: add both
    - `https://farmplug.vercel.app/auth/callback`
    - `http://localhost:3000/auth/callback` (local dev)

## 3. Environment variables (no secrets in frontend)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```
Google Client Secret lives ONLY in Supabase's dashboard — never in your repo
or frontend env vars.

## 4. Files in this folder → where they go in your repo
| File | Destination |
|---|---|
| `GoogleSignInButton.tsx` | `components/auth/GoogleSignInButton.tsx` |
| `route.ts` | `app/auth/callback/route.ts` |
| `migration_google_auth_fields.sql` | your migrations folder, review column names first |

## 5. Acceptance test (from the spec) — verify manually
/signin → Continue with Google → Google OAuth → Supabase session →
callback → profile created/retrieved → role checked → correct workspace →
session survives refresh → logout works.

Test both a brand-new Google user and an existing email/password user who
later signs in with Google using the same email (decide: link accounts or
treat as separate — this is not decided in the code above and needs your call).
