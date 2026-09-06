import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('aggregation_members')
    .select('*, aggregation_groups(*)')
    .eq('farmer_id', user.id)
    .order('joined_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ memberships: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const groupId = String(body.groupId ?? '');
  const contributionKg = Number(body.contributionKg ?? 0);
  if (!groupId || contributionKg <= 0) {
    return NextResponse.json({ error: 'groupId and a positive contributionKg are required' }, { status: 400 });
  }

  const { data: group, error: groupError } = await supabase
    .from('aggregation_groups')
    .select('id,target_quantity_kg,current_quantity_kg,status')
    .eq('id', groupId)
    .maybeSingle();
  if (groupError) return NextResponse.json({ error: groupError.message }, { status: 500 });
  if (!group) return NextResponse.json({ error: 'Aggregation group not found' }, { status: 404 });
  if (group.status === 'COMPLETED' || group.status === 'CANCELLED') {
    return NextResponse.json({ error: 'This aggregation is no longer accepting contributions' }, { status: 409 });
  }

  const { data: existing } = await supabase
    .from('aggregation_members')
    .select('id,contribution_kg')
    .eq('aggregation_id', groupId)
    .eq('farmer_id', user.id)
    .maybeSingle();

  const nextContribution = contributionKg + Number(existing?.contribution_kg ?? 0);
  const memberPayload = { aggregation_id: groupId, farmer_id: user.id, contribution_kg: nextContribution, status: 'JOINED' };
  const { data: member, error: memberError } = existing
    ? await supabase.from('aggregation_members').update(memberPayload).eq('id', existing.id).select().single()
    : await supabase.from('aggregation_members').insert(memberPayload).select().single();
  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });

  const { data: members, error: membersError } = await supabase
    .from('aggregation_members').select('contribution_kg').eq('aggregation_id', groupId).neq('status', 'CANCELLED');
  if (membersError) return NextResponse.json({ error: membersError.message }, { status: 500 });
  const current = (members ?? []).reduce((sum, m) => sum + Number(m.contribution_kg ?? 0), 0);
  const status = current >= Number(group.target_quantity_kg) ? 'READY' : current > 0 ? 'FILLING' : 'OPEN';
  await supabase.from('aggregation_groups').update({ current_quantity_kg: current, status }).eq('id', groupId);

  return NextResponse.json({ member, currentQuantityKg: current, status });
}
