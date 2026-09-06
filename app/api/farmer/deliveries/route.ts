import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('deliveries')
    .select('*, orders(*)')
    .eq('farmer_id', user.id)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deliveries: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const orderId = String(body.orderId ?? '');
  if (!orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 });

  const { data: order } = await supabase.from('orders').select('id,status').eq('id', orderId).eq('farmer_id', user.id).maybeSingle();
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const payload = {
    order_id: orderId,
    farmer_id: user.id,
    pickup_address: body.pickupAddress ?? null,
    collection_center_id: body.collectionCenterId ?? null,
    vehicle_number: body.vehicleNumber ?? null,
    vehicle_capacity_kg: body.vehicleCapacityKg ? Number(body.vehicleCapacityKg) : null,
    distance_km: body.distanceKm ? Number(body.distanceKm) : null,
    estimated_cost: body.estimatedCost ? Number(body.estimatedCost) : null,
    pickup_time: body.pickupTime ?? null,
    eta: body.eta ?? null,
    status: 'PENDING',
  };

  const { data, error } = await supabase.from('deliveries').upsert(payload, { onConflict: 'order_id' }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ delivery: data });
}
