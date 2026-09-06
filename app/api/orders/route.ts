import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('farmplug_orders')
    .select('id,quote_request_id,requirement_id,supply_listing_id,buyer_id,farmer_id,quantity_kg,unit_price,total_amount,currency,delivery_location,status,notes,created_at,updated_at')
    .or(`buyer_id.eq.${user.id},farmer_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Unable to load orders.' }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = String(body?.id || '');
  const nextStatus = String(body?.status || '').toLowerCase();
  const allowed = new Set([
    'quote_pending', 'quote_accepted', 'order_confirmed', 'collecting',
    'in_transit', 'delivered', 'completed', 'cancelled',
  ]);

  if (!id || !allowed.has(nextStatus)) {
    return NextResponse.json({ error: 'Valid order id and status are required.' }, { status: 400 });
  }

  // The database function is the single source of truth for authorization and
  // legal state transitions. Do not update farmplug_orders.status directly.
  const { data, error } = await supabase.rpc('transition_farmplug_order', {
    p_order_id: id,
    p_next_status: nextStatus,
  });

  if (error) {
    const message = error.message || 'Order transition failed.';
    const status = /not authorized/i.test(message) ? 403
      : /not found/i.test(message) ? 404
      : /invalid order transition/i.test(message) ? 409
      : 500;
    return NextResponse.json({ error: status === 500 ? 'Order transition failed.' : message }, { status });
  }

  return NextResponse.json({ order: data });
}
