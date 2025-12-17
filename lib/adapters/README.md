# Connector Adapters

This directory contains adapters that allow integrating new connectors with the MCP protocol.

## How to Add a New Connector

1. Create a new adapter class that extends `BaseAdapter`
2. Implement the `adapt()` method to convert your request format to MCP format
3. Implement the `parseResponse()` method to convert MCP responses to your format
4. Register your adapter with the connector system

## Example

```typescript
import { BaseAdapter } from './baseAdapter';
import { MCPRequest, MCPResponse } from '../connectors/types';

export class MyCustomAdapter extends BaseAdapter {
  adapt(request: any): MCPRequest {
    return {
      method: `custom.${request.action}`,
      params: request.data,
    };
  }

  parseResponse(response: MCPResponse): any {
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }
}
```

## Available Adapters

- **GenericAdapter**: For standard REST API integration
- **BaseAdapter**: Base class for creating custom adapters
