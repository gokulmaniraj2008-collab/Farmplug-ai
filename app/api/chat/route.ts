import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `You are FarmPlug AI Assistant for SIH 2026 Problem Statement 26033, "From Farm Intelligence to the Right Market." Help Farmers and FPOs understand FarmPlug AI's prototype workflow: demand outlook, production decision support, FreshLife selling-window intelligence, buyer matching, supply aggregation and logistics planning. FarmPlug AI complements existing agricultural market infrastructure and does not replace e-NAM. Be concise, practical and easy for farmers to understand. Never invent live prices, real orders, buyer commitments, scientific accuracy, GPS data or validated predictions. When discussing prototype outputs, clearly call them "AI Demo Prediction — Prototype Demonstration". For agronomic, commercial, financial or safety-sensitive decisions, recommend verification with appropriate local experts or real market data.`;

type HistoryItem = { role?: string; text?: string };

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini is not configured on this deployment. Add GEMINI_API_KEY in the server environment.' }, { status: 503 });
    }

    const body = await request.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const history: HistoryItem[] = Array.isArray(body?.history) ? body.history.slice(-8) : [];
    if (!message) return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    if (message.length > 2000) return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });

    const contents = [
      ...history.filter(item => typeof item?.text === 'string' && item.text.trim()).map(item => ({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text!.slice(0, 3000) }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
      }),
      cache: 'no-store',
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini API error', response.status, data?.error?.message);
      return NextResponse.json({ error: 'Gemini could not answer right now. Please try again.' }, { status: 502 });
    }

    const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('').trim();
    if (!text) return NextResponse.json({ error: 'Gemini returned an empty response.' }, { status: 502 });
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Chat route error', error);
    return NextResponse.json({ error: 'Unable to process the chat request.' }, { status: 500 });
  }
}
