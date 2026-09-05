import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function clients(request: NextRequest) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!url || !publishableKey || !secretKey) return { error: 'Supabase server configuration is incomplete.', status: 503 as const };
  if (!token) return { error: 'Sign in to view quote requests.', status: 401 as const };
  const auth = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const admin = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return { auth, admin, token };
}

export async function GET(request: NextRequest) {
  const c = clients(request); if ('error' in c) return NextResponse.json({ error: c.error }, { status: c.status });
  const { data: { user }, error: authError } = await c.auth.auth.getUser(c.token);
  if (authError || !user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });

  const { data: quotes, error } = await c.admin.from('farmplug_quote_requests').select('id,requirement_id,supply_listing_id,message,status,created_at').eq('buyer_id', user.id).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const requirementIds = Array.from(new Set((quotes ?? []).map(q => q.requirement_id).filter(Boolean)));
  const supplyIds = Array.from(new Set((quotes ?? []).map(q => q.supply_listing_id).filter(Boolean)));
  const [reqResult, supplyResult] = await Promise.all([
    requirementIds.length ? c.admin.from('farmplug_buyer_requirements').select('id,buyer_name,crop,quantity_kg,quality,location,delivery_days,status').in('id', requirementIds) : Promise.resolve({ data: [], error: null }),
    supplyIds.length ? c.admin.from('farmplug_supply_listings').select('id,farmer_name,crop,quantity_kg,quality,location,status').in('id', supplyIds) : Promise.resolve({ data: [], error: null })
  ]);
  if (reqResult.error) return NextResponse.json({ error: reqResult.error.message }, { status: 500 });
  if (supplyResult.error) return NextResponse.json({ error: supplyResult.error.message }, { status: 500 });
  const reqMap = new Map((reqResult.data ?? []).map(x => [x.id, x]));
  const supplyMap = new Map((supplyResult.data ?? []).map(x => [x.id, x]));
  const enriched = (quotes ?? []).map(q => ({ ...q, requirement: reqMap.get(q.requirement_id) ?? null, supply: supplyMap.get(q.supply_listing_id) ?? null }));
  return NextResponse.json({ quotes: enriched }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  const c = clients(request); if ('error' in c) return NextResponse.json({ error: c.error }, { status: c.status });
  const { data: { user }, error: authError } = await c.auth.auth.getUser(c.token);
  if (authError || !user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const requirementId = body?.requirementId;
  const supplyListingId = body?.supplyListingId;
  const message = typeof body?.message === 'string' ? body.message.slice(0, 500) : null;
  if (!requirementId || !supplyListingId) return NextResponse.json({ error: 'Requirement and supply listing are required.' }, { status: 400 });

  const admin = c.admin;
  const { data: requirement } = await admin.from('farmplug_buyer_requirements').select('id,status').eq('id', requirementId).maybeSingle();
  const { data: supply } = await admin.from('farmplug_supply_listings').select('id,status').eq('id', supplyListingId).maybeSingle();
  if (!requirement || requirement.status !== 'open') return NextResponse.json({ error: 'This buyer requirement is no longer open.' }, { status: 409 });
  if (!supply || supply.status !== 'available') return NextResponse.json({ error: 'This supply listing is no longer available.' }, { status: 409 });

  const { data: existing } = await admin.from('farmplug_quote_requests').select('id,status').eq('requirement_id', requirementId).eq('supply_listing_id', supplyListingId).eq('buyer_id', user.id).maybeSingle();
  if (existing) return NextResponse.json({ request: existing, alreadyRequested: true });

  const { data, error } = await admin.from('farmplug_quote_requests').insert({ requirement_id: requirementId, supply_listing_id: supplyListingId, buyer_id: user.id, message }).select('id,status,created_at').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ request: data }, { status: 201 });
}
