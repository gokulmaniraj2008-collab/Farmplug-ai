import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [groups, orders] = await Promise.all([
    supabase.from('supply_aggregations').select('*').in('status', ['forming', 'ready', 'pickup_scheduled']).order('created_at', { ascending: false }).limit(30),
    supabase.from('farmplug_orders').select('*').eq('farmer_id', user.id).order('created_at', { ascending: false }).limit(30),
  ]);
  if (groups.error) return NextResponse.json({ error: 'Unable to load aggregations.' }, { status: 500 });
  if (orders.error) return NextResponse.json({ error: 'Unable to load orders.' }, { status: 500 });

  const orderIds = (orders.data ?? []).map((order) => order.id);
  const { data: deliveries, error: deliveryError } = orderIds.length
    ? await supabase.from('delivery_events').select('*').in('order_id', orderIds).order('occurred_at', { ascending: false }).limit(100)
    : { data: [], error: null };
  if (deliveryError) return NextResponse.json({ error: 'Unable to load delivery events.' }, { status: 500 });

  return NextResponse.json({
    groups: groups.data ?? [],
    orders: orders.data ?? [],
    deliveries: deliveries ?? [],
  });
}
