import { NextRequest, NextResponse } from 'next/server';
import { Orchestrator } from '@/lib/orchestrator';

const orchestrator = new Orchestrator();

/**
 * POST /api/orchestrator
 * Main endpoint for processing user queries through the orchestrator
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, userId, context } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    const response = await orchestrator.process({
      query,
      userId,
      context,
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
