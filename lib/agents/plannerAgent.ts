import { Intent, Agent, ExecutionPlan, ExecutionStep, AgentCapability } from '@/lib/types';

/**
 * Agent B: Planner/Router
 * Maps intents to candidate agents/tools and creates execution plans
 */
export class PlannerAgent {
  private agentRegistry: Map<string, Agent>;

  constructor() {
    this.agentRegistry = new Map();
    this.initializeAgentRegistry();
  }

  private initializeAgentRegistry() {
    // Register available agents and their capabilities
    const agents: Agent[] = [
      {
        id: 'graph-calendar',
        name: 'Microsoft Graph Calendar Agent',
        type: 'executor',
        capabilities: [
          {
            name: 'calendar-management',
            description: 'View and manage calendar events',
            requiredScopes: ['Calendars.Read', 'Calendars.ReadWrite'],
            supportedIntents: ['schedule.view', 'schedule.create'],
          },
        ],
      },
      {
        id: 'graph-news',
        name: 'Microsoft Graph News Agent',
        type: 'executor',
        capabilities: [
          {
            name: 'news-aggregation',
            description: 'Fetch news and updates from SharePoint',
            requiredScopes: ['Sites.Read.All'],
            supportedIntents: ['news.view'],
          },
        ],
      },
      {
        id: 'servicenow-agent',
        name: 'ServiceNow Now Assist Agent',
        type: 'executor',
        capabilities: [
          {
            name: 'ticket-management',
            description: 'Create and manage ServiceNow tickets',
            requiredScopes: ['servicenow.incidents'],
            supportedIntents: ['servicenow.ticket'],
          },
        ],
        endpoint: '/api/connectors/servicenow',
      },
      {
        id: 'workday-agent',
        name: 'Workday Integration Agent',
        type: 'executor',
        capabilities: [
          {
            name: 'hr-operations',
            description: 'Handle HR operations via Workday',
            requiredScopes: ['workday.timeoff', 'workday.expenses'],
            supportedIntents: ['workday.timeoff', 'workday.expense'],
          },
        ],
        endpoint: '/api/connectors/workday',
      },
      {
        id: 'custom-mcp-agent',
        name: 'Custom MCP Tool Agent',
        type: 'executor',
        capabilities: [
          {
            name: 'custom-operations',
            description: 'Execute custom MCP tools',
            requiredScopes: ['custom.mcp'],
            supportedIntents: ['action.view', 'action.complete', 'decision.view', 'decision.make'],
          },
        ],
        endpoint: '/api/connectors/custom-mcp',
      },
    ];

    agents.forEach(agent => this.agentRegistry.set(agent.id, agent));
  }

  async createPlan(intent: Intent): Promise<ExecutionPlan> {
    // Find agents that support this intent
    const candidateAgents = this.findCandidateAgents(intent);
    
    if (candidateAgents.length === 0) {
      throw new Error(`No agent found for intent: ${intent.type}`);
    }

    // Select the best agent (first match for simplicity)
    const selectedAgent = candidateAgents[0];

    // Create execution steps
    const steps = this.generateExecutionSteps(intent, selectedAgent);

    return {
      intent,
      selectedAgent,
      steps,
      estimatedDuration: steps.length * 1000, // 1 second per step
    };
  }

  private findCandidateAgents(intent: Intent): Agent[] {
    const candidates: Agent[] = [];

    for (const agent of this.agentRegistry.values()) {
      for (const capability of agent.capabilities) {
        if (capability.supportedIntents.includes(intent.type)) {
          candidates.push(agent);
          break;
        }
      }
    }

    return candidates;
  }

  private generateExecutionSteps(intent: Intent, agent: Agent): ExecutionStep[] {
    const steps: ExecutionStep[] = [];

    // Add validation step
    steps.push({
      id: `step-1-validate`,
      action: 'validate-intent',
      parameters: { intent: intent.type },
      status: 'pending',
    });

    // Add execution step based on intent
    steps.push({
      id: `step-2-execute`,
      action: this.getActionForIntent(intent.type),
      parameters: {
        ...intent.entities,
        intentType: intent.type,
      },
      connector: agent.endpoint,
      status: 'pending',
    });

    // Add response formatting step
    steps.push({
      id: `step-3-format`,
      action: 'format-response',
      parameters: { format: 'json' },
      status: 'pending',
    });

    return steps;
  }

  private getActionForIntent(intentType: string): string {
    const actionMap: Record<string, string> = {
      'schedule.view': 'fetch-calendar-events',
      'schedule.create': 'create-calendar-event',
      'news.view': 'fetch-news-items',
      'action.view': 'fetch-action-items',
      'action.complete': 'complete-action-item',
      'decision.view': 'fetch-decisions',
      'decision.make': 'process-decision',
      'approval.view': 'fetch-approvals',
      'approval.process': 'process-approval',
      'servicenow.ticket': 'create-servicenow-ticket',
      'workday.timeoff': 'request-time-off',
      'workday.expense': 'submit-expense',
    };

    return actionMap[intentType] || 'unknown-action';
  }

  getAgent(agentId: string): Agent | undefined {
    return this.agentRegistry.get(agentId);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agentRegistry.values());
  }
}
