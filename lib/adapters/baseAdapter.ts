import { ConnectorAdapter, MCPRequest, MCPResponse } from '../connectors/types';

/**
 * Base Adapter class for creating custom connector adapters
 */
export abstract class BaseAdapter implements ConnectorAdapter {
  abstract adapt(request: any): MCPRequest;
  abstract parseResponse(response: MCPResponse): any;

  protected validateRequest(request: any): void {
    if (!request) {
      throw new Error('Request cannot be null or undefined');
    }
  }

  protected validateResponse(response: MCPResponse): void {
    if (!response) {
      throw new Error('Response cannot be null or undefined');
    }
    if (!response.success && !response.error) {
      throw new Error('Invalid response format');
    }
  }
}
