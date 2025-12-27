// API Route: List and Create Traces
import { NextRequest, NextResponse } from 'next/server';
import { listTraces, saveTrace } from '@/lib/xray';
import type { XRayTrace } from '@/lib/xray';

export async function GET() {
  try {
    const traces = await listTraces();
    return NextResponse.json({ traces });
  } catch (error) {
    console.error('Error listing traces:', error);
    return NextResponse.json(
      { error: 'Failed to list traces' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const trace = await request.json() as XRayTrace;
    await saveTrace(trace);
    return NextResponse.json({ success: true, id: trace.id });
  } catch (error) {
    console.error('Error saving trace:', error);
    return NextResponse.json(
      { error: 'Failed to save trace' },
      { status: 500 }
    );
  }
}
