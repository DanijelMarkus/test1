import { Intent, Plan, PlanStep } from './types';

/**
 * Planner Agent - Creates execution plans based on intents
 */
export class PlannerAgent {
  async createPlan(intent: Intent): Promise<Plan> {
    const steps: PlanStep[] = [];

    switch (intent.action) {
      case 'schedule':
        steps.push({
          id: 'step-1',
          action: 'fetch_calendar',
          connector: 'custom',
          params: { type: 'calendar' },
        });
        break;

      case 'news':
        steps.push({
          id: 'step-1',
          action: 'fetch_news',
          connector: 'custom',
          params: { type: 'news' },
        });
        break;

      case 'actions':
        steps.push({
          id: 'step-1',
          action: 'fetch_tasks',
          connector: 'custom',
          params: { type: 'tasks' },
        });
        break;

      case 'decisions':
        steps.push({
          id: 'step-1',
          action: 'fetch_decisions',
          connector: 'custom',
          params: { type: 'decisions' },
        });
        break;

      case 'approvals':
        steps.push({
          id: 'step-1',
          action: 'fetch_approvals',
          connector: 'custom',
          params: { type: 'approvals' },
        });
        break;

      case 'servicenow_query':
        steps.push({
          id: 'step-1',
          action: 'query',
          connector: 'servicenow',
          params: intent.entities,
        });
        break;

      case 'workday_query':
        steps.push({
          id: 'step-1',
          action: 'query',
          connector: 'workday',
          params: intent.entities,
        });
        break;

      default:
        steps.push({
          id: 'step-1',
          action: 'general_query',
          connector: 'custom',
          params: { query: intent.entities.rawQuery },
        });
    }

    return {
      steps,
      estimatedDuration: steps.length * 1000, // 1 second per step estimate
    };
  }
}
