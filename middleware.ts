import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ROLE_PREFIX: Record<string,string> = { farmer:"/dashboard/farmer", buyer:"/dashboard/buyer", fpo:"/dashboard/fpo", admin:"/dashboard/admin" };

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: (cookiesToSet) => cookiesToSet.forEach(({name,value,options}) => response.cookies.set(name,value,options)) }
  });
  const { data:{user} } = await supabase.auth.getUser();
  const path=request.nextUrl.pathname; const isDashboardRoute=path.startsWith("/dashboard"); const isOnboardingRoute=path.startsWith("/onboarding");
  if(!user && (isDashboardRoute||isOnboardingRoute)){const u=new URL("/signin",request.url);u.searchParams.set("error","session_expired");u.searchParams.set("next",path);return NextResponse.redirect(u);}
  if(user&&(isDashboardRoute||isOnboardingRoute)){
    const {data:profile}=await supabase.from("profiles").select("role, profile_complete").eq("id",user.id).maybeSingle();
    if(!profile)return NextResponse.redirect(new URL("/onboarding/role-selection",request.url));
    if(!profile.role){if(path!=="/onboarding/role-selection")return NextResponse.redirect(new URL("/onboarding/role-selection",request.url));return response;}
    if(!profile.profile_complete){if(path!=="/onboarding/complete-profile")return NextResponse.redirect(new URL("/onboarding/complete-profile",request.url));return response;}
    if(isOnboardingRoute)return NextResponse.redirect(new URL(ROLE_PREFIX[profile.role]??"/",request.url));
    if(isDashboardRoute){const allowedPrefix=ROLE_PREFIX[profile.role];if(allowedPrefix&&!path.startsWith(allowedPrefix))return NextResponse.redirect(new URL("/forbidden",request.url));}
  }
  return response;
}
export const config={matcher:["/dashboard/:path*","/onboarding/:path*"]};
