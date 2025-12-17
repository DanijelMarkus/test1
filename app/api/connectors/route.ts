import { NextRequest, NextResponse } from 'next/server';
import { ConnectorRegistry } from '@/lib/connectors/registry';

const registry = new ConnectorRegistry();

/**
 * GET /api/connectors
 * List available connectors
 */
export async function GET(request: NextRequest) {
  try {
    const connectors = registry.listConnectors();
    return NextResponse.json({
      success: true,
      data: connectors,
    });
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

/**
 * POST /api/connectors
 * Execute a connector action
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { connector, action, params } = body;

    if (!connector || !action) {
      return NextResponse.json(
        { success: false, error: 'Connector and action are required' },
        { status: 400 }
      );
    }

    const connectorInstance = registry.getConnector(connector);
    const result = await connectorInstance.execute(action, params || {});

    return NextResponse.json({
      success: true,
      data: result,
    });
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
