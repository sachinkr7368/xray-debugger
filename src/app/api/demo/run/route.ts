// Demo API: Run competitor selection pipeline
import { NextResponse } from 'next/server';
import { runCompetitorSelectionPipeline } from '@/lib/demo/pipeline';

export async function POST() {
  try {
    const result = await runCompetitorSelectionPipeline();
    
    return NextResponse.json({
      success: true,
      traceId: result.traceId,
      selectedCompetitor: result.selectedCompetitor,
    });
  } catch (error) {
    console.error('Error running pipeline:', error);
    return NextResponse.json(
      { error: 'Failed to run pipeline', details: String(error) },
      { status: 500 }
    );
  }
}
