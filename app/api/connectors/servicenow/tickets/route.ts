import { NextRequest, NextResponse } from 'next/server';
import { ServiceNowConnector } from '@/lib/connectors/servicenow';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const body = await request.json();

    const connector = new ServiceNowConnector();
    const result = await connector.createTicket(accessToken, body);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('ServiceNow connector error:', error);
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
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('id');
    const query = searchParams.get('query');

    const connector = new ServiceNowConnector();
    
    let result;
    if (ticketId) {
      result = await connector.getTicket(accessToken, ticketId);
    } else if (query) {
      result = await connector.searchTickets(accessToken, query);
    } else {
      throw new Error('Either id or query parameter is required');
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('ServiceNow connector error:', error);
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
