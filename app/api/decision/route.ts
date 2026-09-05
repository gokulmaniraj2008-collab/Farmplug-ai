import { NextResponse } from 'next/server';
import { runDecisionEngine, type DecisionInput } from '../../../..//lib/decision-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input: DecisionInput = {
      crop: String(body.crop ?? '').trim(),
      quantityKg: Number(body.quantityKg ?? 0),
      location: String(body.location ?? '').trim(),
      quality: String(body.quality ?? 'Grade A').trim(),
      harvestDate: String(body.harvestDate ?? '').trim(),
      storage: String(body.storage ?? 'Open Storage').trim(),
    };

    if (!input.crop || !Number.isFinite(input.quantityKg) || input.quantityKg <= 0) {
      return NextResponse.json({ error: 'Crop and a positive quantity are required.' }, { status: 400 });
    }

    return NextResponse.json({ result: runDecisionEngine(input), generatedAt: new Date().toISOString() }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Invalid decision request.' }, { status: 400 });
  }
}
