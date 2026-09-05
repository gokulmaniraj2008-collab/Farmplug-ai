import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const USER_AGENT = 'FarmPlug-AI-SIH26033/1.0 (prototype)';

type Point = { label: string; query: string; lat: number; lon: number };

async function geocode(query: string): Promise<Point | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' }, next: { revalidate: 3600 } });
  if (!response.ok) return null;
  const rows = await response.json() as Array<{ lat: string; lon: string; display_name: string }>;
  const row = rows[0];
  return row ? { label: row.display_name, query, lat: Number(row.lat), lon: Number(row.lon) } : null;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const locations = Array.isArray(body?.locations) ? body.locations.filter((x: unknown) => typeof x === 'string').map((x: string) => x.trim()).filter(Boolean).slice(0, 5) : [];
  if (locations.length < 2) return NextResponse.json({ error: 'At least two locations are required.' }, { status: 400 });
  try {
    const points: Point[] = [];
    for (const query of locations) {
      const point = await geocode(query);
      if (!point) return NextResponse.json({ error: `Could not locate: ${query}` }, { status: 422 });
      points.push(point);
    }
    const coordinates = points.map(p => `${p.lon},${p.lat}`).join(';');
    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true`;
    const response = await fetch(routeUrl, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' }, next: { revalidate: 300 } });
    if (!response.ok) return NextResponse.json({ error: 'Routing service is temporarily unavailable.' }, { status: 502 });
    const result = await response.json();
    if (result.code !== 'Ok' || !result.routes?.[0]) return NextResponse.json({ error: result.message || 'No road route found for these locations.' }, { status: 422 });
    const route = result.routes[0];
    return NextResponse.json({
      provider: 'OpenStreetMap + OSRM',
      points,
      distanceKm: Math.round(route.distance / 100) / 10,
      durationMinutes: Math.max(1, Math.round(route.duration / 60)),
      geometry: route.geometry,
      steps: (route.legs ?? []).flatMap((leg: { steps?: Array<{ name?: string; distance?: number; duration?: number }> }) => leg.steps ?? []).slice(0, 30).map(step => ({ name: step.name || 'Road segment', distanceKm: Math.round((step.distance || 0) / 100) / 10, durationMinutes: Math.max(1, Math.round((step.duration || 0) / 60)) })),
      attribution: '© OpenStreetMap contributors • Routing via OSRM',
    }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });
  } catch {
    return NextResponse.json({ error: 'Could not generate a live route right now.' }, { status: 502 });
  }
}
