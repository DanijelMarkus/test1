import { AgentRequest, AgentResponse, Intent } from './types';

/**
 * Intent Agent - Analyzes user input to determine intent and extract entities
 */
export class IntentAgent {
  async process(request: AgentRequest): Promise<AgentResponse> {
    try {
      const intent = await this.analyzeIntent(request.query);
      
      return {
        success: true,
        data: intent,
        metadata: {
          agent: 'IntentAgent',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async analyzeIntent(query: string): Promise<Intent> {
    // Simple intent classification - in production, this would use AI/ML models
    const queryLower = query.toLowerCase();
    
    // Detect action based on keywords
    let action = 'unknown';
    let confidence = 0.5;
    const entities: Record<string, any> = {};

    if (queryLower.includes('schedule') || queryLower.includes('meeting') || queryLower.includes('calendar')) {
      action = 'schedule';
      confidence = 0.85;
      entities.type = 'calendar';
    } else if (queryLower.includes('news') || queryLower.includes('announcement')) {
      action = 'news';
      confidence = 0.85;
      entities.type = 'information';
    } else if (queryLower.includes('action') || queryLower.includes('task') || queryLower.includes('todo')) {
      action = 'actions';
      confidence = 0.85;
      entities.type = 'task';
    } else if (queryLower.includes('decision') || queryLower.includes('approve') || queryLower.includes('decide')) {
      action = 'decisions';
      confidence = 0.85;
      entities.type = 'decision';
    } else if (queryLower.includes('approval') || queryLower.includes('pending')) {
      action = 'approvals';
      confidence = 0.85;
      entities.type = 'approval';
    } else if (queryLower.includes('servicenow') || queryLower.includes('incident')) {
      action = 'servicenow_query';
      confidence = 0.9;
      entities.connector = 'servicenow';
    } else if (queryLower.includes('workday') || queryLower.includes('hr') || queryLower.includes('employee')) {
      action = 'workday_query';
      confidence = 0.9;
      entities.connector = 'workday';
    }

    entities.rawQuery = query;

    return {
      action,
      entities,
      confidence,
    };
  }
}
