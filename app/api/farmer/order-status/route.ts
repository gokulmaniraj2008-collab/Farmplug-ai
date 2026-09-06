import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const allowed = new Set([
  'quote_pending', 'quote_accepted', 'order_confirmed', 'collecting',
  'in_transit', 'delivered', 'completed', 'cancelled',
]);

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const orderId = String(body?.orderId ?? '');
  const nextStatus = String(body?.status ?? '').toLowerCase();
  if (!orderId || !allowed.has(nextStatus)) {
    return NextResponse.json({ error: 'orderId and a valid lowercase status are required' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('transition_farmplug_order', {
    p_order_id: orderId,
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
