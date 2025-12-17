import { Connector } from './types';
import { ServiceNowConnector } from './servicenowConnector';
import { WorkdayConnector } from './workdayConnector';
import { CustomConnector } from './customConnector';

/**
 * Connector Registry - Manages available connectors
 */
export class ConnectorRegistry {
  private connectors: Map<string, Connector> = new Map();

  constructor() {
    this.registerDefaultConnectors();
  }

  private registerDefaultConnectors(): void {
    this.register(new ServiceNowConnector());
    this.register(new WorkdayConnector());
    this.register(new CustomConnector());
  }

  register(connector: Connector): void {
    this.connectors.set(connector.name, connector);
  }

  getConnector(name: string): Connector {
    const connector = this.connectors.get(name);
    if (!connector) {
      throw new Error(`Connector not found: ${name}`);
    }
    return connector;
  }

  listConnectors(): string[] {
    return Array.from(this.connectors.keys());
  }

  hasConnector(name: string): boolean {
    return this.connectors.has(name);
  }
}
