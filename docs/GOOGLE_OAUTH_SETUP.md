# FarmPlug AI — Google Login Setup

FarmPlug AI uses Supabase Auth for Google OAuth. The application code includes a `Continue with Google` flow on `/signin` and `/signup` and completes the session at `/auth/callback`.

## 1. Google Cloud

Create an OAuth 2.0 Web Client in Google Cloud Console.

Add the Supabase OAuth callback URL shown by your Supabase project under Authentication → Providers → Google. Do not commit the Google client secret.

## 2. Supabase

Open:

Authentication → Providers → Google

Enable Google and enter:

- Google Client ID
- Google Client Secret

Then configure the Supabase Auth URL settings:

- Site URL: production FarmPlug URL
- Additional Redirect URLs: local development URL and production callback URL as required by the Supabase project

The application callback is:

`/auth/callback`

For local development this normally becomes:

`http://localhost:3000/auth/callback`

For production it becomes:

`https://YOUR-PRODUCTION-DOMAIN/auth/callback`

Use the exact production domain configured for the deployed FarmPlug application.

## 3. Application environment

Set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Server-only secrets such as `SUPABASE_SECRET_KEY` must never be exposed through `NEXT_PUBLIC_*` variables.

## 4. Authentication flow

`/signin` or `/signup`
→ Continue with Google
→ Google
→ Supabase Auth
→ `/auth/callback`
→ session
→ profile/role
→ correct workspace

New accounts without a role are sent to `/role-select`.

Admin is never offered as a public self-selected signup role.

## 5. Verification checklist

- [ ] Google provider enabled in Supabase
- [ ] Google Client ID configured
- [ ] Google Client Secret configured
- [ ] Supabase redirect URL added to Google Cloud
- [ ] Production Site URL configured
- [ ] Production callback URL configured
- [ ] `/signin` Google button tested
- [ ] `/signup` Google button tested
- [ ] OAuth callback tested
- [ ] New Google user tested
- [ ] Existing Google user tested
- [ ] Session refresh tested
- [ ] Logout tested

Google Login must not be described as production-ready until the complete end-to-end flow has been tested with the actual configured provider.
