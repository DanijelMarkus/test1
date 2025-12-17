/**
 * Type definitions for connectors and MCP protocol
 */

export interface Connector {
  name: string;
  type: 'mcp' | 'custom';
  execute(action: string, params: Record<string, any>): Promise<any>;
}

export interface MCPConnector extends Connector {
  type: 'mcp';
  protocol: MCPProtocol;
}

export interface MCPProtocol {
  version: string;
  capabilities: string[];
}

export interface MCPRequest {
  method: string;
  params: Record<string, any>;
}

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface ConnectorAdapter {
  adapt(request: any): MCPRequest;
  parseResponse(response: MCPResponse): any;
}
