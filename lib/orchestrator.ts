import { IntentAgent } from './agents/intentAgent';
import { PlannerAgent } from './agents/plannerAgent';
import { ExecutorAgent } from './agents/executorAgent';
import { MemoryAgent } from './agents/memoryAgent';
import { GuardrailsAgent } from './agents/guardrailsAgent';
import { AgentRequest, AgentResponse } from './agents/types';

/**
 * Main Orchestrator that coordinates all agents
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

  async process(request: AgentRequest): Promise<AgentResponse> {
    const conversationId = request.userId || 'default';

    try {
      // Store user input in memory
      this.memoryAgent.addEntry(conversationId, {
        role: 'user',
        content: request.query,
      });

      // Step 1: Validate input with guardrails
      const guardrailCheck = await this.guardrailsAgent.validateInput(request.query, request.context);
      if (!guardrailCheck.allowed) {
        return {
          success: false,
          error: guardrailCheck.reason,
        };
      }

      // Use sanitized input
      const sanitizedQuery = guardrailCheck.sanitizedInput || request.query;

      // Step 2: Analyze intent
      const intentResponse = await this.intentAgent.process({
        ...request,
        query: sanitizedQuery,
      });

      if (!intentResponse.success) {
        return intentResponse;
      }

      // Step 3: Create execution plan
      const plan = await this.plannerAgent.createPlan(intentResponse.data);

      // Step 4: Execute plan
      const results = await this.executorAgent.executePlan(plan);

      // Step 5: Validate output with guardrails
      const outputCheck = await this.guardrailsAgent.validateOutput(results);
      if (!outputCheck.allowed) {
        return {
          success: false,
          error: outputCheck.reason,
        };
      }

      // Store assistant response in memory
      this.memoryAgent.addEntry(conversationId, {
        role: 'assistant',
        content: JSON.stringify(results),
        metadata: {
          intent: intentResponse.data,
          plan,
        },
      });

      return {
        success: true,
        data: {
          intent: intentResponse.data,
          results,
          context: this.memoryAgent.getContext(conversationId, 5),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  getMemory(conversationId: string) {
    return this.memoryAgent.getMemory(conversationId);
  }

  clearMemory(conversationId: string) {
    this.memoryAgent.clearMemory(conversationId);
  }
}
