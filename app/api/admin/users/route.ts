import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!url || !publishableKey || !secretKey) return NextResponse.json({ error: 'Supabase server configuration is incomplete.' }, { status: 503 });
  if (!token) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const authClient = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error: authError } = await authClient.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });

  const adminClient = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const users = data.users.map((item) => ({
    id: item.id,
    email: item.email ?? '',
    name: item.user_metadata?.full_name || item.user_metadata?.name || '',
    provider: item.app_metadata?.provider || item.identities?.[0]?.provider || 'email',
    created_at: item.created_at,
    last_sign_in_at: item.last_sign_in_at ?? null,
    email_confirmed_at: item.email_confirmed_at ?? null,
  }));
  return NextResponse.json({ users }, { headers: { 'Cache-Control': 'no-store' } });
}
