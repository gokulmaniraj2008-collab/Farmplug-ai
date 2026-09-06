import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role,full_name,farm_role')
    .eq('id', user.id)
    .maybeSingle();

  const role = String(profile?.role ?? profile?.farm_role ?? 'farmer').toLowerCase();
  const admin = ['admin', 'super_admin'].includes(role);
  const buyer = ['buyer', 'buyer_admin'].includes(role);
  const fpo = ['fpo', 'aggregator'].includes(role);

  const requirementsQuery = buyer || admin
    ? supabase.from('farmplug_buyer_requirements').select('*').order('created_at', { ascending: false }).limit(100)
    : supabase.from('farmplug_buyer_requirements').select('*').eq('created_by', user.id).order('created_at', { ascending: false }).limit(50);

  const listingsQuery = admin || fpo || buyer
    ? supabase.from('farmplug_supply_listings').select('*').order('created_at', { ascending: false }).limit(100)
    : supabase.from('farmplug_supply_listings').select('*').eq('created_by', user.id).order('created_at', { ascending: false }).limit(50);

  const groupsQuery = supabase.from('aggregation_groups').select('*').order('created_at', { ascending: false }).limit(100);

  let ordersQuery = supabase.from('farmplug_orders').select('*').order('created_at', { ascending: false }).limit(100);
  if (buyer) ordersQuery = supabase.from('farmplug_orders').select('*').eq('buyer_id', user.id).order('created_at', { ascending: false }).limit(100);
  else if (fpo) ordersQuery = supabase.from('farmplug_orders').select('*').order('created_at', { ascending: false }).limit(100);
  else if (!admin) ordersQuery = supabase.from('farmplug_orders').select('*').eq('farmer_id', user.id).order('created_at', { ascending: false }).limit(100);

  const [requirements, listings, groups, orders] = await Promise.all([
    requirementsQuery,
    listingsQuery,
    groupsQuery,
    ordersQuery,
  ]);

  if (requirements.error) return NextResponse.json({ error: requirements.error.message }, { status: 500 });
  if (listings.error) return NextResponse.json({ error: listings.error.message }, { status: 500 });
  if (groups.error) return NextResponse.json({ error: groups.error.message }, { status: 500 });
  if (orders.error) return NextResponse.json({ error: orders.error.message }, { status: 500 });

  return NextResponse.json({
    role,
    profile,
    requirements: requirements.data ?? [],
    listings: listings.data ?? [],
    groups: groups.data ?? [],
    orders: orders.data ?? [],
  });
}
