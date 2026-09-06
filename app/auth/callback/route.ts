// File location: app/auth/callback/route.ts
//
// Implements: OAuth code exchange -> profile lookup/create -> role check
// -> profile completion check -> redirect to correct workspace.
// Preserves existing email/password flow; this route only handles the
// OAuth (Google) redirect leg.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // adjust to your existing server client path

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const next = searchParams.get("next") ?? "/";

  if (oauthError) {
    return NextResponse.redirect(
      `${origin}/signin?error=oauth_${encodeURIComponent(oauthError)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/signin?error=oauth_missing_code`);
  }

  const supabase = await createClient();
  const { data: sessionData, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !sessionData?.user) {
    return NextResponse.redirect(`${origin}/signin?error=oauth_exchange_failed`);
  }

  const user = sessionData.user;
  const { data: profile, error: profileFetchError } = await supabase
    .from("profiles")
    .select("id, role, profile_complete")
    .eq("id", user.id)
    .maybeSingle();

  if (profileFetchError) {
    return NextResponse.redirect(`${origin}/signin?error=profile_lookup_failed`);
  }

  if (!profile) {
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      auth_provider: "google",
      role: null,
      profile_complete: false,
    });

    if (insertError) {
      return NextResponse.redirect(`${origin}/signin?error=profile_create_failed`);
    }
    return NextResponse.redirect(`${origin}/onboarding/role-selection`);
  }

  if (!profile.role) {
    return NextResponse.redirect(`${origin}/onboarding/role-selection`);
  }

  if (!profile.profile_complete) {
    return NextResponse.redirect(`${origin}/onboarding/complete-profile`);
  }

  const roleWorkspace: Record<string, string> = {
    farmer: "/dashboard/farmer",
    buyer: "/dashboard/buyer",
    fpo: "/dashboard/fpo",
    admin: "/dashboard/admin",
  };

  const destination = roleWorkspace[profile.role] ?? next;
  return NextResponse.redirect(`${origin}${destination}`);
}
