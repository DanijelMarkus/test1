import { Plan, ExecutionResult } from './types';
import { ConnectorRegistry } from '../connectors/registry';

/**
 * Executor Agent - Executes plans by calling appropriate connectors
 */
export class ExecutorAgent {
  private connectorRegistry: ConnectorRegistry;

  constructor() {
    this.connectorRegistry = new ConnectorRegistry();
  }

  async executePlan(plan: Plan): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];

    for (const step of plan.steps) {
      try {
        const result = await this.executeStep(step);
        results.push(result);

        if (!result.success) {
          // Stop execution on failure
          break;
        }
      } catch (error) {
        results.push({
          stepId: step.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        break;
      }
    }

    return results;
  }

  private async executeStep(step: any): Promise<ExecutionResult> {
    try {
      const connector = this.connectorRegistry.getConnector(step.connector || 'custom');
      const data = await connector.execute(step.action, step.params);

      return {
        stepId: step.id,
        success: true,
        data,
      };
    } catch (error) {
      return {
        stepId: step.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
