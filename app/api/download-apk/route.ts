import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const APK_URL =
  'https://github.com/gokulmaniraj2008-collab/Farmplug-ai/releases/download/apk-v2.1.0/FarmPlug-AI.apk';

export async function GET() {
  try {
    const upstream = await fetch(APK_URL, {
      cache: 'no-store',
      redirect: 'follow',
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: 'APK is temporarily unavailable.' },
        { status: 503 },
      );
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="FarmPlug-AI.apk"',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'APK download service is temporarily unavailable.' },
      { status: 503 },
    );
  }
}
