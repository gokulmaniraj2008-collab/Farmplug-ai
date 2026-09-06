import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role,full_name').eq('id', user.id).maybeSingle();
  const role = String(profile?.role ?? 'farmer').toLowerCase();

  const [requirements, listings, groups, orders] = await Promise.all([
    supabase.from('farmplug_buyer_requirements').select('*').eq('created_by', user.id).order('created_at', { ascending: false }).limit(50),
    supabase.from('farmplug_supply_listings').select('*').order('created_at', { ascending: false }).limit(100),
    supabase.from('aggregation_groups').select('*').order('created_at', { ascending: false }).limit(50),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100),
  ]);

  if (requirements.error) return NextResponse.json({ error: requirements.error.message }, { status: 500 });
  if (listings.error) return NextResponse.json({ error: listings.error.message }, { status: 500 });
  if (groups.error) return NextResponse.json({ error: groups.error.message }, { status: 500 });
  if (orders.error) return NextResponse.json({ error: orders.error.message }, { status: 500 });

  return NextResponse.json({ role, profile, requirements: requirements.data ?? [], listings: listings.data ?? [], groups: groups.data ?? [], orders: orders.data ?? [] });
}
