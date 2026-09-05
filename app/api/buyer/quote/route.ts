import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (!url || !publishableKey || !secretKey) return NextResponse.json({ error: 'Supabase server configuration is incomplete.' }, { status: 503 });
  if (!token) return NextResponse.json({ error: 'Sign in to request a quote.' }, { status: 401 });

  const authClient = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error: authError } = await authClient.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const requirementId = body?.requirementId;
  const supplyListingId = body?.supplyListingId;
  const message = typeof body?.message === 'string' ? body.message.slice(0, 500) : null;
  if (!requirementId || !supplyListingId) return NextResponse.json({ error: 'Requirement and supply listing are required.' }, { status: 400 });

  const admin = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: requirement } = await admin.from('farmplug_buyer_requirements').select('id,status').eq('id', requirementId).maybeSingle();
  const { data: supply } = await admin.from('farmplug_supply_listings').select('id,status').eq('id', supplyListingId).maybeSingle();
  if (!requirement || requirement.status !== 'open') return NextResponse.json({ error: 'This buyer requirement is no longer open.' }, { status: 409 });
  if (!supply || supply.status !== 'available') return NextResponse.json({ error: 'This supply listing is no longer available.' }, { status: 409 });

  const { data, error } = await admin
    .from('farmplug_quote_requests')
    .insert({ requirement_id: requirementId, supply_listing_id: supplyListingId, buyer_id: user.id, message })
    .select('id,status,created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ request: data });
}
