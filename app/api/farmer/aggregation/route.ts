import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [{ data: aggregations, error }, { data: listings, error: listingError }] = await Promise.all([
    supabase.from('supply_aggregations').select('*').in('status', ['forming', 'ready', 'pickup_scheduled']).order('created_at', { ascending: false }),
    supabase.from('farmplug_supply_listings').select('id,crop,quantity_kg,quality,location,status,created_by').eq('created_by', user.id),
  ]);
  if (error || listingError) return NextResponse.json({ error: 'Unable to load aggregation data.' }, { status: 500 });

  const ownedListingIds = new Set((listings ?? []).map((listing) => listing.id));
  const memberships = (aggregations ?? []).filter((aggregation) =>
    Array.isArray(aggregation.selected_listings) && aggregation.selected_listings.some((item: unknown) => {
      if (typeof item === 'string') return ownedListingIds.has(item);
      if (item && typeof item === 'object' && 'listing_id' in item) return ownedListingIds.has(String((item as { listing_id: string }).listing_id));
      return false;
    }),
  );

  return NextResponse.json({ aggregations: aggregations ?? [], memberships });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const aggregationId = String(body?.aggregationId ?? body?.groupId ?? '');
  const listingId = String(body?.listingId ?? '');
  const contributionKg = Number(body?.contributionKg ?? 0);
  if (!aggregationId || !listingId || contributionKg <= 0) {
    return NextResponse.json({ error: 'aggregationId, listingId and a positive contributionKg are required' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('contribute_to_supply_aggregation', {
    p_aggregation_id: aggregationId,
    p_listing_id: listingId,
    p_contribution_kg: contributionKg,
  });
  if (error) {
    const message = error.message || 'Unable to contribute to aggregation.';
    const status = /not found|not owned/i.test(message) ? 404 : /closed|exceeds|available/i.test(message) ? 409 : 500;
    return NextResponse.json({ error: status === 500 ? 'Unable to contribute to aggregation.' : message }, { status });
  }

  return NextResponse.json({ aggregation: data });
}
