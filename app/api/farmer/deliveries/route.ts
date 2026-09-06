import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: orders, error: orderError } = await supabase
    .from('farmplug_orders')
    .select('id,farmer_id,buyer_id,status,delivery_location,created_at,updated_at')
    .eq('farmer_id', user.id)
    .order('created_at', { ascending: false });
  if (orderError) return NextResponse.json({ error: 'Unable to load delivery orders.' }, { status: 500 });

  const orderIds = (orders ?? []).map((o) => o.id);
  const { data: events, error: eventError } = orderIds.length
    ? await supabase.from('delivery_events').select('*').in('order_id', orderIds).order('occurred_at', { ascending: false })
    : { data: [], error: null };
  if (eventError) return NextResponse.json({ error: 'Unable to load delivery events.' }, { status: 500 });

  const grouped = (orders ?? []).map((order) => ({
    order,
    events: (events ?? []).filter((event) => event.order_id === order.id),
  }));

  return NextResponse.json({ deliveries: grouped });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const orderId = String(body?.orderId ?? '');
  if (!orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 });

  const { data: order, error: orderError } = await supabase
    .from('farmplug_orders')
    .select('id,status,farmer_id')
    .eq('id', orderId)
    .eq('farmer_id', user.id)
    .maybeSingle();
  if (orderError) return NextResponse.json({ error: 'Unable to load order.' }, { status: 500 });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const eventType = String(body.eventType ?? 'pickup_requested').trim().toLowerCase();
  const { data, error } = await supabase.from('delivery_events').insert({
    order_id: order.id,
    event_type: eventType,
    location: body.location ?? null,
    notes: body.notes ?? null,
  }).select().single();

  if (error) return NextResponse.json({ error: 'Unable to create delivery event.' }, { status: 500 });
  return NextResponse.json({ deliveryEvent: data }, { status: 201 });
}
