import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function requireAdmin(request: NextRequest) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!url || !publishableKey) return { ok: false as const, status: 503, error: 'Supabase authentication is not configured.' };
  if (!token) return { ok: false as const, status: 401, error: 'Authentication required.' };
  const client = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error } = await client.auth.getUser(token);
  if (error || !user) return { ok: false as const, status: 401, error: 'Invalid or expired session.' };
  if (user.app_metadata?.role !== 'admin') return { ok: false as const, status: 403, error: 'Administrator permission required.' };
  return { ok: true as const, user };
}
