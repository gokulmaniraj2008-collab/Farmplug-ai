import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function clients(request: NextRequest) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!url || !publishableKey || !secretKey) return { error: 'Supabase server configuration is incomplete.', status: 503 as const };
  if (!token) return { error: 'Sign in to calculate buyer matches.', status: 401 as const };
  const auth = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const admin = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return { auth, admin, token };
}

const score = (listing: any, req: any) => {
  const crop = String(listing.crop || '').trim().toLowerCase();
  const wanted = String(req.crop || '').trim().toLowerCase();
  const cropScore = crop && wanted && crop === wanted ? 100 : 0;
  const quantity = Number(listing.quantity_kg) || 0;
  const required = Number(req.quantity_kg) || 0;
  const quantityScore = required > 0 ? Math.min(100, (quantity / required) * 100) : 0;
  const qualityScore = !req.quality || String(req.quality).toLowerCase() === String(listing.quality || '').toLowerCase() ? 100 : 40;
  const farmerLocation = String(listing.location || '').toLowerCase();
  const buyerLocation = String(req.location || '').toLowerCase();
  const locationScore = farmerLocation && buyerLocation && (farmerLocation.includes(buyerLocation) || buyerLocation.includes(farmerLocation)) ? 100 : 60;
  const deliveryScore = 80;
  const total = Math.round(cropScore * .35 + quantityScore * .25 + qualityScore * .15 + locationScore * .15 + deliveryScore * .10);
  return { cropScore, quantityScore: Math.round(quantityScore), qualityScore, locationScore, deliveryScore, totalScore: total };
};

export async function POST(request: NextRequest) {
  const c = clients(request);
  if ('error' in c) return NextResponse.json({ error: c.error }, { status: c.status });
  const { data: { user }, error: authError } = await c.auth.auth.getUser(c.token);
  if (authError || !user) return NextResponse.json({ error: 'Your session is invalid or expired.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const listingId = String(body?.listingId || '');
  if (!listingId) return NextResponse.json({ error: 'listingId is required.' }, { status: 400 });

  const { data: listing, error: listingError } = await c.admin.from('farmplug_supply_listings').select('*').eq('id', listingId).eq('created_by', user.id).maybeSingle();
  if (listingError) return NextResponse.json({ error: listingError.message }, { status: 500 });
  if (!listing) return NextResponse.json({ error: 'Supply listing not found or not owned by you.' }, { status: 404 });

  const { data: requirements, error: reqError } = await c.admin.from('farmplug_buyer_requirements').select('id,created_by,buyer_name,crop,quantity_kg,quality,location,delivery_days,status').eq('status', 'open');
  if (reqError) return NextResponse.json({ error: reqError.message }, { status: 500 });

  const matches = (requirements || []).map(req => {
    const s = score(listing, req);
    return { supply_listing_id: listing.id, buyer_id: req.created_by, ...s, explanation: { crop: s.cropScore, quantity: s.quantityScore, quality: s.qualityScore, location: s.locationScore, delivery: s.deliveryScore }, requirement: req };
  }).filter(m => m.cropScore > 0).sort((a, b) => b.totalScore - a.totalScore);

  if (matches.length) {
    const rows = matches.map(m => ({ supply_listing_id: m.supply_listing_id, buyer_id: m.buyer_id, crop_score: m.cropScore, quantity_score: m.quantityScore, quality_score: m.qualityScore, location_score: m.locationScore, delivery_score: m.deliveryScore, total_score: m.totalScore, explanation: m.explanation }));
    const { error } = await c.admin.from('buyer_matches').upsert(rows, { onConflict: 'supply_listing_id,buyer_id' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ matches }, { headers: { 'Cache-Control': 'no-store' } });
}
