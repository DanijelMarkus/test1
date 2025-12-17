import { ExecutionPlan, ExecutionStep } from '@/lib/types';
import axios from 'axios';

/**
 * Agent C: Executor
 * Executes the planned actions using the appropriate connectors
 */
export class ExecutorAgent {
  async execute(plan: ExecutionPlan, accessToken: string): Promise<any> {
    const results: any[] = [];

    for (const step of plan.steps) {
      try {
        step.status = 'running';
        const result = await this.executeStep(step, accessToken);
        step.status = 'completed';
        step.result = result;
        results.push(result);
      } catch (error) {
        step.status = 'failed';
        step.result = { error: error instanceof Error ? error.message : 'Unknown error' };
        throw error;
      }
    }

    return results[results.length - 1]; // Return final result
  }

  private async executeStep(step: ExecutionStep, accessToken: string): Promise<any> {
    switch (step.action) {
      case 'validate-intent':
        return this.validateIntent(step.parameters);
      
      case 'fetch-calendar-events':
        return this.fetchCalendarEvents(accessToken, step.parameters);
      
      case 'create-calendar-event':
        return this.createCalendarEvent(accessToken, step.parameters);
      
      case 'fetch-news-items':
        return this.fetchNewsItems(accessToken);
      
      case 'fetch-action-items':
        return this.fetchActionItems(accessToken);
      
      case 'complete-action-item':
        return this.completeActionItem(step.parameters);
      
      case 'fetch-decisions':
        return this.fetchDecisions(accessToken);
      
      case 'process-decision':
        return this.processDecision(step.parameters);
      
      case 'fetch-approvals':
        return this.fetchApprovals(accessToken);
      
      case 'process-approval':
        return this.processApproval(step.parameters);
      
      case 'create-servicenow-ticket':
        return this.executeConnector('/api/connectors/servicenow/tickets', step.parameters, accessToken);
      
      case 'request-time-off':
        return this.executeConnector('/api/connectors/workday/timeoff', step.parameters, accessToken);
      
      case 'submit-expense':
        return this.executeConnector('/api/connectors/workday/expenses', step.parameters, accessToken);
      
      case 'format-response':
        return this.formatResponse(step.parameters);
      
      default:
        throw new Error(`Unknown action: ${step.action}`);
    }
  }

  private validateIntent(parameters: any): any {
    return { valid: true, intent: parameters.intent };
  }

  private async fetchCalendarEvents(accessToken: string, parameters: any): Promise<any> {
    // Mock implementation - in production, would call Microsoft Graph
    return [
      {
        id: '1',
        title: 'Team Standup',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 30 * 60000).toISOString(),
        location: 'Teams Meeting',
      },
      {
        id: '2',
        title: 'Project Review',
        startTime: new Date(Date.now() + 2 * 60 * 60000).toISOString(),
        endTime: new Date(Date.now() + 3 * 60 * 60000).toISOString(),
        location: 'Conference Room A',
      },
    ];
  }

  private async createCalendarEvent(accessToken: string, parameters: any): Promise<any> {
    // Mock implementation
    return {
      id: 'new-event-1',
      title: 'New Meeting',
      status: 'created',
    };
  }

  private async fetchNewsItems(accessToken: string): Promise<any> {
    // Mock implementation
    return [
      {
        id: '1',
        title: 'Q4 Company Results Announced',
        summary: 'Company exceeds expectations with strong Q4 performance...',
        publishedAt: new Date().toISOString(),
        source: 'Corporate News',
      },
      {
        id: '2',
        title: 'New Product Launch Next Month',
        summary: 'Exciting new product features coming in the next release...',
        publishedAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
        source: 'Product Team',
      },
    ];
  }

  private async fetchActionItems(accessToken: string): Promise<any> {
    // Mock implementation
    return [
      {
        id: '1',
        title: 'Complete quarterly review',
        description: 'Submit quarterly performance review',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60000).toISOString(),
        status: 'pending',
      },
      {
        id: '2',
        title: 'Update project documentation',
        description: 'Update technical documentation for project',
        priority: 'medium',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60000).toISOString(),
        status: 'in_progress',
      },
    ];
  }

  private completeActionItem(parameters: any): any {
    return {
      id: parameters.actionId,
      status: 'completed',
    };
  }

  private async fetchDecisions(accessToken: string): Promise<any> {
    // Mock implementation
    return [
      {
        id: '1',
        title: 'Approve new vendor contract',
        description: 'Review and approve the proposed vendor contract',
        options: ['Approve', 'Reject', 'Request Changes'],
        requester: 'John Doe',
        requestedAt: new Date().toISOString(),
        status: 'pending',
      },
    ];
  }

  private processDecision(parameters: any): any {
    return {
      id: parameters.decisionId,
      decision: parameters.choice,
      status: 'processed',
    };
  }

  private async fetchApprovals(accessToken: string): Promise<any> {
    // Mock implementation
    return [
      {
        id: '1',
        title: 'Expense Report - Travel',
        description: 'Approve travel expenses for conference',
        type: 'expense',
        requester: 'Jane Smith',
        requestedAt: new Date().toISOString(),
        status: 'pending',
        amount: 1250.00,
      },
      {
        id: '2',
        title: 'Time Off Request',
        description: 'Vacation request for next month',
        type: 'time_off',
        requester: 'Bob Johnson',
        requestedAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
        status: 'pending',
      },
    ];
  }

  private processApproval(parameters: any): any {
    return {
      id: parameters.approvalId,
      decision: parameters.decision,
      status: 'processed',
    };
  }

  private async executeConnector(endpoint: string, parameters: any, accessToken: string): Promise<any> {
    try {
      const response = await axios.post(endpoint, parameters, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Connector error: ${error.message}`);
      }
      throw error;
    }
  }

  private formatResponse(parameters: any): any {
    return { formatted: true, format: parameters.format };
  }
}
