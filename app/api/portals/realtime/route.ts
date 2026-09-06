import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const table = req.nextUrl.searchParams.get('table');
  const allowed = ['orders', 'aggregation_groups', 'aggregation_members', 'deliveries', 'farmplug_buyer_requirements', 'farmplug_supply_listings', 'buyer_matches'];
  if (!table || !allowed.includes(table)) return NextResponse.json({ error: 'Unsupported table' }, { status: 400 });
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ table, rows: data ?? [] });
}
