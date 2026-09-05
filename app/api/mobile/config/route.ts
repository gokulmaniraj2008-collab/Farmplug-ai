import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    return NextResponse.json({ error: 'Mobile configuration is unavailable.' }, { status: 503 });
  }
  return NextResponse.json({ url, publishableKey }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
