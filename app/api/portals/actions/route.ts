import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const normalize = (v: unknown) => String(v ?? '').toLowerCase();
const orderTransitions: Record<string, string[]> = {
  quote_pending: ['quote_accepted', 'cancelled'],
  quote_accepted: ['order_confirmed', 'cancelled'],
  order_confirmed: ['collecting', 'cancelled'],
  collecting: ['in_transit', 'cancelled'],
  in_transit: ['delivered', 'cancelled'],
  delivered: ['completed'],
  completed: [],
  cancelled: [],
};
const validOrderStatuses = Object.keys(orderTransitions);

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: profile } = await supabase.from('profiles').select('role,farm_role').eq('id', user.id).maybeSingle();
  const role = normalize(profile?.role);
  const farmRole = normalize(profile?.farm_role);
  const isAdmin = ['admin', 'super_admin'].includes(role);
  const isBuyer = ['buyer', 'buyer_admin'].includes(role);
  const isFpo = ['fpo', 'aggregator'].includes(role) || ['fpo', 'aggregator'].includes(farmRole);
  const body = await req.json().catch(() => ({}));
  const action = normalize(body.action);

  if (action === 'update_requirement') {
    if (!isBuyer && !isAdmin) return NextResponse.json({ error: 'Buyer or admin access required' }, { status: 403 });
    const id = String(body.id || '');
    const status = String(body.status || '').toUpperCase();
    if (!id || !['OPEN', 'PAUSED', 'CLOSED', 'CANCELLED'].includes(status)) return NextResponse.json({ error: 'Invalid requirement update' }, { status: 400 });
    const query = supabase.from('farmplug_buyer_requirements').update({ status }).eq('id', id);
    const { data, error } = isAdmin ? await query.select('*').maybeSingle() : await query.eq('created_by', user.id).select('*').maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Requirement not found or not owned by this account' }, { status: 404 });
    return NextResponse.json({ data });
  }

  if (action === 'update_order') {
    const id = String(body.id || '');
    const next = normalize(body.status);
    if (!id || !validOrderStatuses.includes(next)) return NextResponse.json({ error: 'Order id and a valid order status are required' }, { status: 400 });
    if (!isAdmin && !isBuyer && !isFpo) return NextResponse.json({ error: 'Portal action not allowed for this role' }, { status: 403 });
    const { data: order, error: findError } = await supabase.from('farmplug_orders').select('id,buyer_id,farmer_id,status').eq('id', id).maybeSingle();
    if (findError) return NextResponse.json({ error: findError.message }, { status: 500 });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (isBuyer && order.buyer_id !== user.id) return NextResponse.json({ error: 'You can only update your own buyer orders' }, { status: 403 });
    const current = normalize(order.status);
    if (!validOrderStatuses.includes(current)) return NextResponse.json({ error: `Order has unsupported status: ${current}` }, { status: 409 });
    if (!isAdmin && !orderTransitions[current]?.includes(next)) return NextResponse.json({ error: `Invalid transition: ${current} → ${next}` }, { status: 409 });
    const { data, error } = await supabase.from('farmplug_orders').update({ status: next }).eq('id', id).select('*').maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === 'create_aggregation') {
    if (!isFpo && !isAdmin) return NextResponse.json({ error: 'FPO/Aggregator or admin access required' }, { status: 403 });
    const requirementId = String(body.requirement_id || '');
    if (!requirementId) return NextResponse.json({ error: 'Requirement is required' }, { status: 400 });
    const { data: requirement, error: reqError } = await supabase.from('farmplug_buyer_requirements').select('id,quantity_kg,status').eq('id', requirementId).maybeSingle();
    if (reqError) return NextResponse.json({ error: reqError.message }, { status: 500 });
    if (!requirement) return NextResponse.json({ error: 'Requirement not found' }, { status: 404 });
    const { data, error } = await supabase.from('supply_aggregations').insert({ requirement_id: requirement.id, total_quantity_kg: 0, status: 'forming', selected_listings: [] }).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === 'update_aggregation') {
    if (!isFpo && !isAdmin) return NextResponse.json({ error: 'FPO/Aggregator or admin access required' }, { status: 403 });
    const id = String(body.id || '');
    const status = normalize(body.status);
    if (!id || !['forming', 'ready', 'pickup_scheduled', 'completed', 'cancelled'].includes(status)) return NextResponse.json({ error: 'Invalid aggregation update' }, { status: 400 });
    const { data, error } = await supabase.from('supply_aggregations').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select('*').maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Aggregation not found' }, { status: 404 });
    return NextResponse.json({ data });
  }

  if (action === 'add_delivery_event') {
    if (!isFpo && !isAdmin) return NextResponse.json({ error: 'FPO/Aggregator or admin access required' }, { status: 403 });
    const orderId = String(body.order_id || '');
    const eventType = String(body.event_type || '').trim();
    if (!orderId || !eventType) return NextResponse.json({ error: 'Order and event type are required' }, { status: 400 });
    const { data, error } = await supabase.from('delivery_events').insert({ order_id: orderId, event_type: eventType, location: body.location || null, notes: body.notes || null }).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error: 'Unknown portal action' }, { status: 400 });
}
