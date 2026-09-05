import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function clients(request: NextRequest) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!url || !publishableKey || !secretKey) return { error: 'Supabase server configuration is incomplete.', status: 503 as const };
  if (!token) return { error: 'Sign in to manage your supply listings.', status: 401 as const };
  const auth = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const admin = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return { auth, admin, token };
}

export async function GET(request: NextRequest) {
  const c = clients(request); if ('error' in c) return NextResponse.json({ error: c.error }, { status: c.status });
  const { data: { user }, error: authError } = await c.auth.auth.getUser(c.token);
  if (authError || !user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
  const { data, error } = await c.admin.from('farmplug_supply_listings').select('id,farmer_name,crop,quantity_kg,quality,location,available_until,status,created_at').eq('created_by', user.id).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ listings: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  const c = clients(request); if ('error' in c) return NextResponse.json({ error: c.error }, { status: c.status });
  const { data: { user }, error: authError } = await c.auth.auth.getUser(c.token);
  if (authError || !user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const farmerName = String(body?.farmerName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Farmer').trim().slice(0, 120);
  const crop = String(body?.crop || '').trim().slice(0, 80);
  const quantity = Number(body?.quantityKg);
  const quality = String(body?.quality || 'Grade A').trim().slice(0, 40);
  const location = String(body?.location || '').trim().slice(0, 120);
  const availableUntil = body?.availableUntil ? String(body.availableUntil) : null;
  if (!crop || !location || !Number.isFinite(quantity) || quantity <= 0) return NextResponse.json({ error: 'Crop, quantity and location are required.' }, { status: 400 });
  const { data, error } = await c.admin.from('farmplug_supply_listings').insert({ farmer_name: farmerName, crop, quantity_kg: quantity, quality, location, available_until: availableUntil, created_by: user.id }).select('id,farmer_name,crop,quantity_kg,quality,location,available_until,status,created_at').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ listing: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const c = clients(request); if ('error' in c) return NextResponse.json({ error: c.error }, { status: c.status });
  const { data: { user }, error: authError } = await c.auth.auth.getUser(c.token);
  if (authError || !user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const id = String(body?.id || ''); const status = String(body?.status || '');
  if (!id || !['available', 'reserved', 'sold'].includes(status)) return NextResponse.json({ error: 'Valid listing id and status are required.' }, { status: 400 });
  const { data, error } = await c.admin.from('farmplug_supply_listings').update({ status }).eq('id', id).eq('created_by', user.id).select('id,status').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Listing not found or not owned by you.' }, { status: 404 });
  return NextResponse.json({ listing: data });
}
