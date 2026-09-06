import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/app-v2';

  if (!code) {
    return NextResponse.redirect(`${origin}/signin?error=oauth_callback_missing_code`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/signin?error=oauth_callback_failed`);
  }

  const user = data.user;
  const fullName =
    String(user.user_metadata?.full_name || user.user_metadata?.name || '').trim() || 'Farmer';

  await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email ?? null,
    farm_role: 'farmer',
  });

  await supabase.from('farmer_profiles').upsert({
    id: user.id,
    full_name: fullName,
  });

  return NextResponse.redirect(`${origin}${safeNext}`);
}
