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
import { getOrchestrator } from '@/lib/agents/orchestrator';
import { OrchestratorRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Extract access token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);

    // Parse request body
    const body = await request.json();
    const { utterance, context } = body;

    if (!utterance) {
      return NextResponse.json(
        { success: false, error: 'Utterance is required' },
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
    // Create orchestrator request
    const orchestratorRequest: OrchestratorRequest = {
      utterance,
      context,
      accessToken,
    };

    // Process request through orchestrator
    const orchestrator = getOrchestrator();
    const response = await orchestrator.process(orchestratorRequest);

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Orchestrator error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const orchestrator = getOrchestrator();
    const agents = await orchestrator.getAgents();

    return NextResponse.json({
      success: true,
      data: { agents },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
