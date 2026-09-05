import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

type BuyerUser = { id: string; email?: string | null; user_metadata?: Record<string, unknown> | null };
type BuyerResult = { data: BuyerUser[]; error: { message: string } | null };

function clients(request: NextRequest) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!url || !publishableKey || !secretKey) return { error: 'Supabase server configuration is incomplete.', status: 503 as const };
  if (!token) return { error: 'Sign in to manage buyer requests.', status: 401 as const };
  const auth = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const admin = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return { auth, admin, token };
}

export async function GET(request: NextRequest) {
  const c = clients(request); if ('error' in c) return NextResponse.json({ error: c.error }, { status: c.status });
  const { data: { user }, error: authError } = await c.auth.auth.getUser(c.token);
  if (authError || !user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
  const { data: listings, error: listingError } = await c.admin.from('farmplug_supply_listings').select('id,farmer_name,crop,quantity_kg,quality,location,created_at').eq('created_by', user.id);
  if (listingError) return NextResponse.json({ error: listingError.message }, { status: 500 });
  const listingMap = new Map((listings ?? []).map(x => [x.id, x]));
  const ids = Array.from(listingMap.keys());
  if (!ids.length) return NextResponse.json({ quotes: [] }, { headers: { 'Cache-Control': 'no-store' } });
  const { data: quotes, error } = await c.admin.from('farmplug_quote_requests').select('id,requirement_id,supply_listing_id,buyer_id,message,status,created_at').in('supply_listing_id', ids).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const requirementIds = Array.from(new Set((quotes ?? []).map(x => x.requirement_id).filter(Boolean)));
  const buyerIds = Array.from(new Set((quotes ?? []).map(x => x.buyer_id).filter(Boolean)));
  const [reqResult, buyerResult]: [{ data: Array<{ id: string; buyer_name: string | null; crop: string; quantity_kg: number; quality: string; location: string; delivery_days: number | null; status: string }> | null; error: { message: string } | null }, BuyerResult] = await Promise.all([
    requirementIds.length ? c.admin.from('farmplug_buyer_requirements').select('id,buyer_name,crop,quantity_kg,quality,location,delivery_days,status').in('id', requirementIds) : Promise.resolve({ data: [], error: null }),
    Promise.all(buyerIds.map(id => c.admin.auth.admin.getUserById(id))).then(results => ({ data: results.map(r => r.data.user).filter((u): u is BuyerUser => Boolean(u)), error: results.find(r => r.error)?.error ? { message: results.find(r => r.error)!.error!.message } : null }))
  ]);
  if (reqResult.error) return NextResponse.json({ error: reqResult.error.message }, { status: 500 });
  if (buyerResult.error) return NextResponse.json({ error: buyerResult.error.message }, { status: 500 });
  const reqMap = new Map((reqResult.data ?? []).map(x => [x.id, x]));
  const buyerMap = new Map(buyerResult.data.map(x => [x.id, x]));
  const enriched = (quotes ?? []).map(q => {
    const buyer = buyerMap.get(q.buyer_id);
    const requirement = reqMap.get(q.requirement_id);
    const fullName = buyer?.user_metadata?.full_name;
    return { ...q, supply: listingMap.get(q.supply_listing_id) ?? null, requirement: requirement ?? null, buyer_email: buyer?.email ?? null, buyer_name: typeof fullName === 'string' ? fullName : requirement?.buyer_name ?? buyer?.email?.split('@')[0] ?? 'Buyer' };
  });
  return NextResponse.json({ quotes: enriched }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(request: NextRequest) {
  const c = clients(request); if ('error' in c) return NextResponse.json({ error: c.error }, { status: c.status });
  const { data: { user }, error: authError } = await c.auth.auth.getUser(c.token);
  if (authError || !user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const id = String(body?.id || ''); const status = String(body?.status || '');
  if (!id || !['accepted', 'rejected', 'pending'].includes(status)) return NextResponse.json({ error: 'Valid request id and status are required.' }, { status: 400 });
  const { data: quote, error: quoteError } = await c.admin.from('farmplug_quote_requests').select('id,supply_listing_id,status').eq('id', id).maybeSingle();
  if (quoteError) return NextResponse.json({ error: quoteError.message }, { status: 500 });
  if (!quote) return NextResponse.json({ error: 'Buyer request not found.' }, { status: 404 });
  const { data: listing } = await c.admin.from('farmplug_supply_listings').select('id,status').eq('id', quote.supply_listing_id).eq('created_by', user.id).maybeSingle();
  if (!listing) return NextResponse.json({ error: 'You do not own this supply listing.' }, { status: 403 });
  if (status === 'accepted') {
    if (quote.status === 'accepted') return NextResponse.json({ request: { id: quote.id, status: 'accepted' }, alreadyAccepted: true });
    if (listing.status !== 'available') return NextResponse.json({ error: 'This supply listing is already reserved or sold. Release it before accepting another buyer request.' }, { status: 409 });
    const { data: reserved, error: reserveError } = await c.admin.from('farmplug_supply_listings').update({ status: 'reserved' }).eq('id', listing.id).eq('created_by', user.id).eq('status', 'available').select('id').maybeSingle();
    if (reserveError) return NextResponse.json({ error: reserveError.message }, { status: 500 });
    if (!reserved) return NextResponse.json({ error: 'This supply listing was just reserved by another request. Refresh the page.' }, { status: 409 });
    const { data, error } = await c.admin.from('farmplug_quote_requests').update({ status: 'accepted' }).eq('id', id).eq('status', 'pending').select('id,status').maybeSingle();
    if (error) { await c.admin.from('farmplug_supply_listings').update({ status: 'available' }).eq('id', listing.id).eq('created_by', user.id).eq('status', 'reserved'); return NextResponse.json({ error: error.message }, { status: 500 }); }
    if (!data) { await c.admin.from('farmplug_supply_listings').update({ status: 'available' }).eq('id', listing.id).eq('created_by', user.id).eq('status', 'reserved'); return NextResponse.json({ error: 'This request is no longer pending. Refresh and try again.' }, { status: 409 }); }
    return NextResponse.json({ request: data });
  }
  const { data, error } = await c.admin.from('farmplug_quote_requests').update({ status }).eq('id', id).eq('supply_listing_id', listing.id).select('id,status').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'This request could not be updated. Refresh and try again.' }, { status: 409 });
  if (status === 'rejected') {
    const { data: accepted } = await c.admin.from('farmplug_quote_requests').select('id').eq('supply_listing_id', listing.id).eq('status', 'accepted').limit(1).maybeSingle();
    if (!accepted) await c.admin.from('farmplug_supply_listings').update({ status: 'available' }).eq('id', listing.id).eq('created_by', user.id).eq('status', 'reserved');
  }
  return NextResponse.json({ request: data });
}
