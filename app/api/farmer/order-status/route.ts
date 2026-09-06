import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const allowed: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['AGGREGATING', 'CANCELLED'],
  AGGREGATING: ['PICKUP', 'CANCELLED'],
  PICKUP: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: ['DELIVERED'],
  DELIVERED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const orderId = String(body.orderId ?? '');
  const nextStatus = String(body.status ?? '').toUpperCase();
  if (!orderId || !nextStatus) return NextResponse.json({ error: 'orderId and status are required' }, { status: 400 });

  const { data: order, error: readError } = await supabase
    .from('orders').select('id,status').eq('id', orderId).eq('farmer_id', user.id).maybeSingle();
  if (readError) return NextResponse.json({ error: readError.message }, { status: 500 });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (!allowed[String(order.status)]?.includes(nextStatus)) {
    return NextResponse.json({ error: `Invalid transition from ${order.status} to ${nextStatus}` }, { status: 409 });
  }

  const { data, error } = await supabase.from('orders').update({ status: nextStatus, updated_at: new Date().toISOString() }).eq('id', orderId).eq('farmer_id', user.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ order: data });
}
