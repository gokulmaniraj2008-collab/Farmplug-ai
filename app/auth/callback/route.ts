// Authentication callback for email confirmation and OAuth providers.
// New accounts are routed through the same profile/onboarding flow.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const authError = searchParams.get("error");
  const next = searchParams.get("next") ?? "/";

  if (authError) {
    return NextResponse.redirect(`${origin}/signin?error=auth_${encodeURIComponent(authError)}`);
  }
  if (!code) {
    return NextResponse.redirect(`${origin}/signin?error=auth_missing_code`);
  }

  const supabase = await createClient();
  const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError || !sessionData?.user) {
    return NextResponse.redirect(`${origin}/signin?error=auth_exchange_failed`);
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
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      auth_provider: user.app_metadata?.provider ?? "email",
      role: "user",
      farm_role: "farmer",
      profile_complete: false,
    });
    if (insertError) {
      return NextResponse.redirect(`${origin}/signin?error=profile_create_failed`);
    }
    return NextResponse.redirect(`${origin}/onboarding/role-selection`);
  }

  if (!profile.farm_role || (profile.role === "user" && !profile.profile_complete)) {
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
  return NextResponse.redirect(`${origin}${roleWorkspace[effectiveRole] ?? next}`);
}
