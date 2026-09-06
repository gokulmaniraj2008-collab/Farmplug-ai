# Google Login — Configuration Required (not code, must be done manually)

These files implement the code side. Google Login will not work until this configuration exists — do not mark it done until verified.

## 1. Google Cloud Console
- Create OAuth 2.0 Client ID (Web application)
- Authorized redirect URI: `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
- Note the Client ID and Client Secret

## 2. Supabase Dashboard
Authentication → Providers → Google
- Paste Client ID + Client Secret
- Authentication → URL Configuration:
  - Site URL: your production URL
  - Redirect URLs: add production and local `/auth/callback`

## 3. Environment variables
```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```
Google Client Secret lives only in Supabase dashboard — never in repo/frontend env vars.

## 4. Acceptance test
/signin → Continue with Google → Google OAuth → Supabase session → callback → profile created/retrieved → role checked → correct workspace → session survives refresh → logout works.
