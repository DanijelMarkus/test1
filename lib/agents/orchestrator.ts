import { IntentAgent } from './intentAgent';
import { PlannerAgent } from './plannerAgent';
import { ExecutorAgent } from './executorAgent';
import { MemoryAgent } from './memoryAgent';
import { GuardrailsAgent } from './guardrailsAgent';
import { OrchestratorRequest, OrchestratorResponse } from '@/lib/types';

/**
 * Main Orchestrator
 * Coordinates all agents to process user requests
 */
export class Orchestrator {
  private intentAgent: IntentAgent;
  private plannerAgent: PlannerAgent;
  private executorAgent: ExecutorAgent;
  private memoryAgent: MemoryAgent;
  private guardrailsAgent: GuardrailsAgent;

  constructor() {
    this.intentAgent = new IntentAgent();
    this.plannerAgent = new PlannerAgent();
    this.executorAgent = new ExecutorAgent();
    this.memoryAgent = new MemoryAgent();
    this.guardrailsAgent = new GuardrailsAgent();
  }

  async process(request: OrchestratorRequest): Promise<OrchestratorResponse> {
    const startTime = Date.now();

    try {
      // Extract user ID from context or token
      const userId = request.context?.userId || 'anonymous';

      // Step 1: Get user context (Agent D)
      const userContext = await this.memoryAgent.getContext(userId);

      // Step 2: Understand intent (Agent A)
      const intent = await this.intentAgent.understand(request.utterance);

      // Log activity
      await this.memoryAgent.addActivity(userId, `Intent: ${intent.type}`);

      // Step 3: Create execution plan (Agent B)
      const plan = await this.plannerAgent.createPlan(intent);

      // Step 4: Check compliance (Agent E)
      const compliance = await this.guardrailsAgent.checkCompliance(
        intent,
        plan,
        userId
      );

      if (!compliance.passed) {
        throw new Error(`Compliance check failed: ${compliance.violations.join(', ')}`);
      }

      // Step 5: Execute plan (Agent C)
      const result = await this.executorAgent.execute(plan, request.accessToken);

      // Log successful execution
      this.guardrailsAgent.logAudit({
        userId,
        action: 'orchestrator-execution',
        intent: intent.type,
        success: true,
      });

      await this.memoryAgent.addActivity(userId, `Executed: ${intent.type}`);

      const executionTime = Date.now() - startTime;

      return {
        intent,
        plan,
        result,
        compliance,
        executionTime,
      };
    } catch (error) {
      // Log error
      this.guardrailsAgent.logAudit({
        userId: request.context?.userId || 'anonymous',
        action: 'orchestrator-execution',
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      });

      throw error;
    }
  }

  async getAgents() {
    return this.plannerAgent.getAllAgents();
  }

  async getUserContext(userId: string) {
    return this.memoryAgent.getContext(userId);
  }

  async getAuditLogs(userId?: string) {
    return this.guardrailsAgent.getAuditLogs(userId);
  }
}

// Singleton instance
let orchestratorInstance: Orchestrator | null = null;

export function getOrchestrator(): Orchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new Orchestrator();
  }
  return orchestratorInstance;
}
