// API Route: Get, Update, Delete Single Trace
import { NextRequest, NextResponse } from 'next/server';
import { getTrace, deleteTrace, saveTrace } from '@/lib/xray';
import type { XRayTrace } from '@/lib/xray';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const trace = await getTrace(id);
    
    if (!trace) {
      return NextResponse.json(
        { error: 'Trace not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ trace });
  } catch (error) {
    console.error('Error getting trace:', error);
    return NextResponse.json(
      { error: 'Failed to get trace' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const updates = await request.json() as Partial<XRayTrace>;
    const trace = await getTrace(id);
    
    if (!trace) {
      return NextResponse.json(
        { error: 'Trace not found' },
        { status: 404 }
      );
    }
    
    const updatedTrace = { ...trace, ...updates };
    await saveTrace(updatedTrace);
    
    return NextResponse.json({ trace: updatedTrace });
  } catch (error) {
    console.error('Error updating trace:', error);
    return NextResponse.json(
      { error: 'Failed to update trace' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const success = await deleteTrace(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Trace not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trace:', error);
    return NextResponse.json(
      { error: 'Failed to delete trace' },
      { status: 500 }
    );
  }
}
