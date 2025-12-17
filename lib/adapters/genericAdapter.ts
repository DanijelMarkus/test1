import { BaseAdapter } from './baseAdapter';
import { MCPRequest, MCPResponse } from '../connectors/types';

/**
 * Generic Adapter for standard REST API integration
 */
export class GenericAdapter extends BaseAdapter {
  adapt(request: any): MCPRequest {
    this.validateRequest(request);

    return {
      method: request.action || 'execute',
      params: {
        endpoint: request.endpoint,
        method: request.httpMethod || 'GET',
        body: request.body,
        headers: request.headers,
        ...request.params,
      },
    };
  }

  parseResponse(response: MCPResponse): any {
    this.validateResponse(response);

    if (!response.success) {
      throw new Error(response.error || 'Request failed');
    }

    return response.data;
  }
}
