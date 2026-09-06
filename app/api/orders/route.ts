import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getClients(request: NextRequest) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!url || !publishableKey || !secretKey) return { error: 'Supabase server configuration is incomplete.', status: 503 as const };
  if (!token) return { error: 'Sign in to manage orders.', status: 401 as const };
  const auth = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const admin = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return { auth, admin, token };
}

export async function GET(request: NextRequest) {
  const c = getClients(request); if ('error' in c) return NextResponse.json({ error: c.error }, { status: c.status });
  const { data: { user }, error: authError } = await c.auth.auth.getUser(c.token);
  if (authError || !user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
  const { data, error } = await c.admin.from('farmplug_orders')
    .select('id,quote_request_id,requirement_id,supply_listing_id,buyer_id,farmer_id,quantity_kg,unit_price,total_amount,currency,delivery_location,status,notes,created_at,updated_at')
    .or(`buyer_id.eq.${user.id},farmer_id.eq.${user.id}`)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
}

// Keep API transitions identical to the database state machine.
const transitions: Record<string, string[]> = {
  quote_pending: ['quote_accepted', 'cancelled'],
  quote_accepted: ['order_confirmed', 'cancelled'],
  order_confirmed: ['collecting', 'cancelled'],
  collecting: ['in_transit', 'cancelled'],
  in_transit: ['delivered', 'cancelled'],
  delivered: ['completed'],
  completed: [],
  cancelled: [],
};

export async function PATCH(request: NextRequest) {
  const c = getClients(request); if ('error' in c) return NextResponse.json({ error: c.error }, { status: c.status });
  const { data: { user }, error: authError } = await c.auth.auth.getUser(c.token);
  if (authError || !user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const id = String(body?.id || ''); const nextStatus = String(body?.status || '').toLowerCase();
  if (!id || !Object.prototype.hasOwnProperty.call(transitions, nextStatus)) return NextResponse.json({ error: 'Valid order id and status are required.' }, { status: 400 });
  const { data: order, error } = await c.admin.from('farmplug_orders').select('id,buyer_id,farmer_id,status,supply_listing_id').eq('id', id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  const isBuyer = order.buyer_id === user.id; const isFarmer = order.farmer_id === user.id;
  if (!isBuyer && !isFarmer) return NextResponse.json({ error: 'You do not have access to this order.' }, { status: 403 });
  const currentStatus = String(order.status || '').toLowerCase();
  if (!transitions[currentStatus]?.includes(nextStatus)) return NextResponse.json({ error: `Invalid order transition from ${currentStatus} to ${nextStatus}.` }, { status: 409 });
  if (nextStatus === 'collecting' && !isFarmer) return NextResponse.json({ error: 'Only the farmer/FPO can start collection.' }, { status: 403 });
  if (nextStatus === 'in_transit' && !isFarmer) return NextResponse.json({ error: 'Only the farmer/FPO can dispatch the order.' }, { status: 403 });
  if (nextStatus === 'delivered' && !isFarmer) return NextResponse.json({ error: 'Only the farmer/FPO can mark delivery complete.' }, { status: 403 });
  if (nextStatus === 'completed' && !isBuyer) return NextResponse.json({ error: 'Only the buyer can confirm completion.' }, { status: 403 });
  const { data: updated, error: updateError } = await c.admin.from('farmplug_orders').update({ status: nextStatus }).eq('id', id).select('*').single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  if (nextStatus === 'completed' && updated.supply_listing_id) await c.admin.from('farmplug_supply_listings').update({ status: 'sold' }).eq('id', updated.supply_listing_id).eq('created_by', user.id);
  if (nextStatus === 'cancelled' && updated.supply_listing_id) await c.admin.from('farmplug_supply_listings').update({ status: 'available' }).eq('id', updated.supply_listing_id).eq('created_by', user.id).eq('status', 'reserved');
  return NextResponse.json({ order: updated });
}
