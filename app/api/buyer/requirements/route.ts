import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Supabase server configuration is incomplete.' }, { status: 503 });

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase
    .from('farmplug_buyer_requirements')
    .select('id,buyer_name,crop,quantity_kg,quality,location,delivery_days,status,created_at,is_verified')
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const requirements = (data ?? []).map(item => ({ ...item, buyer_name: item.is_verified ? `✓ Verified · ${item.buyer_name}` : item.buyer_name }));
  return NextResponse.json({ requirements }, { headers: { 'Cache-Control': 'no-store' } });
}
