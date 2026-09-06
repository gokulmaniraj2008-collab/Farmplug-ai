import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [groups, orders, deliveries] = await Promise.all([
    supabase.from('aggregation_groups').select('*').in('status', ['OPEN', 'FILLING', 'READY']).order('created_at', { ascending: false }).limit(30),
    supabase.from('orders').select('*').eq('farmer_id', user.id).order('created_at', { ascending: false }).limit(30),
    supabase.from('deliveries').select('*').eq('farmer_id', user.id).order('created_at', { ascending: false }).limit(30),
  ]);
  if (groups.error) return NextResponse.json({ error: groups.error.message }, { status: 500 });
  if (orders.error) return NextResponse.json({ error: orders.error.message }, { status: 500 });
  if (deliveries.error) return NextResponse.json({ error: deliveries.error.message }, { status: 500 });
  return NextResponse.json({ groups: groups.data ?? [], orders: orders.data ?? [], deliveries: deliveries.data ?? [] });
}
