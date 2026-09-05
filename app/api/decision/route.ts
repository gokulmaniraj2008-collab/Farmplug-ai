import { NextResponse } from 'next/server';
import { runDecisionEngine, type DecisionInput } from '@/lib/decision-engine';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawQuantity = body.quantityKg ?? body.quantity ?? body.qty;
    const quantityKg = typeof rawQuantity === 'number' ? rawQuantity : Number(String(rawQuantity ?? '').trim());

    const input: DecisionInput = {
      crop: String(body.crop ?? '').trim(),
      quantityKg,
      location: String(body.location ?? '').trim(),
      quality: String(body.quality ?? 'Grade A').trim(),
      harvestDate: String(body.harvestDate ?? '').trim(),
      storage: String(body.storage ?? 'Open Storage').trim(),
    };

    if (!input.crop) {
      return NextResponse.json(
        { error: 'Crop is required.', field: 'crop' },
        { status: 400 },
      );
    }

    if (!Number.isFinite(input.quantityKg) || input.quantityKg <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number in kg.', field: 'quantityKg' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { result: runDecisionEngine(input), generatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { error: 'Invalid decision request. Please send valid JSON.' },
      { status: 400 },
    );
  }
}
