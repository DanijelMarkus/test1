import { Connector } from './types';

/**
 * Base Connector class that all connectors extend
 */
export abstract class BaseConnector implements Connector {
  abstract name: string;
  abstract type: 'mcp' | 'custom';

  abstract execute(action: string, params: Record<string, any>): Promise<any>;

  protected async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Connector request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
