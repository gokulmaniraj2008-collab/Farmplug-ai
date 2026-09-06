import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ROLE_PREFIX: Record<string, string> = {
  farmer: "/dashboard/farmer",
  buyer: "/dashboard/buyer",
  fpo: "/dashboard/fpo",
  admin: "/dashboard/admin",
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const protectedRoute = path.startsWith("/dashboard") || path.startsWith("/onboarding");

  if (!user && protectedRoute) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("error", "session_expired");
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && protectedRoute) {
    const { data: profile } = await supabase.from("profiles").select("role, farm_role, profile_complete").eq("id", user.id).maybeSingle();
    if (!profile) return NextResponse.redirect(new URL("/onboarding/role-selection", request.url));

    const effectiveRole = profile.role === "admin" ? "admin" : profile.farm_role;
    if (!effectiveRole) {
      if (path !== "/onboarding/role-selection") return NextResponse.redirect(new URL("/onboarding/role-selection", request.url));
      return response;
    }
    if (!profile.profile_complete) {
      if (path !== "/onboarding/complete-profile") return NextResponse.redirect(new URL("/onboarding/complete-profile", request.url));
      return response;
    }
    if (path.startsWith("/onboarding")) return NextResponse.redirect(new URL(ROLE_PREFIX[effectiveRole] ?? "/", request.url));
    const allowed = ROLE_PREFIX[effectiveRole];
    if (allowed && !path.startsWith(allowed)) return NextResponse.redirect(new URL("/forbidden", request.url));
  }
  return response;
}

export const config = { matcher: ["/dashboard/:path*", "/onboarding/:path*"] };
