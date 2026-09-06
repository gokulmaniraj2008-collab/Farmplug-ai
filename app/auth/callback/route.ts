// File location: app/auth/callback/route.ts
//
// Google OAuth callback: exchange code -> ensure profile -> route to
// role selection/profile completion/workspace. Workspace roles live in
// profiles.farm_role; profiles.role is reserved for user/admin authority.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const next = searchParams.get("next") ?? "/";

  if (oauthError) {
    return NextResponse.redirect(`${origin}/signin?error=oauth_${encodeURIComponent(oauthError)}`);
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
    .select("id, role, farm_role, profile_complete")
    .eq("id", user.id)
    .maybeSingle();

  if (profileFetchError) {
    return NextResponse.redirect(`${origin}/signin?error=profile_lookup_failed`);
  }

  if (!profile) {
    // The live schema requires both role and farm_role. Use the least-privileged
    // temporary workspace value until the user explicitly chooses their role.
    // profile_complete=false guarantees onboarding is required before dashboard access.
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      auth_provider: "google",
      role: "user",
      farm_role: "farmer",
      profile_complete: false,
    });

    if (insertError) {
      return NextResponse.redirect(`${origin}/signin?error=profile_create_failed`);
    }

    return NextResponse.redirect(`${origin}/onboarding/role-selection`);
  }

  if (!profile.farm_role || profile.role === "user" && !profile.profile_complete) {
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

  const effectiveRole = profile.role === "admin" ? "admin" : profile.farm_role;
  const destination = roleWorkspace[effectiveRole] ?? next;
  return NextResponse.redirect(`${origin}${destination}`);
}
