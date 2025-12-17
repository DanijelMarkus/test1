import { Connector } from './types';
import { BaseConnector } from './baseConnector';

/**
 * Custom Connector for general-purpose actions
 */
export class CustomConnector extends BaseConnector implements Connector {
  name = 'custom';
  type: 'custom' = 'custom';

  async execute(action: string, params: Record<string, any>): Promise<any> {
    switch (action) {
      case 'fetch_calendar':
        return this.fetchCalendar(params);
      case 'fetch_news':
        return this.fetchNews(params);
      case 'fetch_tasks':
        return this.fetchTasks(params);
      case 'fetch_decisions':
        return this.fetchDecisions(params);
      case 'fetch_approvals':
        return this.fetchApprovals(params);
      case 'general_query':
        return this.handleGeneralQuery(params);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private async fetchCalendar(params: Record<string, any>): Promise<any> {
    // Mock calendar data
    return {
      events: [
        {
          id: '1',
          title: 'Team Standup',
          time: '9:00 AM',
          date: new Date().toISOString().split('T')[0],
          type: 'meeting',
        },
        {
          id: '2',
          title: 'Project Review',
          time: '2:00 PM',
          date: new Date().toISOString().split('T')[0],
          type: 'meeting',
        },
      ],
    };
  }

  private async fetchNews(params: Record<string, any>): Promise<any> {
    // Mock news data
    return {
      articles: [
        {
          id: '1',
          title: 'Company Quarterly Results Announced',
          summary: 'Strong performance across all divisions',
          date: new Date().toISOString(),
          category: 'Company News',
        },
        {
          id: '2',
          title: 'New Product Launch Next Month',
          summary: 'Exciting new features coming soon',
          date: new Date().toISOString(),
          category: 'Product',
        },
      ],
    };
  }

  private async fetchTasks(params: Record<string, any>): Promise<any> {
    // Mock task data
    return {
      tasks: [
        {
          id: '1',
          title: 'Complete Q4 Report',
          status: 'In Progress',
          priority: 'High',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        },
        {
          id: '2',
          title: 'Review Team Performance',
          status: 'Not Started',
          priority: 'Medium',
          dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        },
      ],
    };
  }

  private async fetchDecisions(params: Record<string, any>): Promise<any> {
    // Mock decision data
    return {
      decisions: [
        {
          id: '1',
          title: 'Budget Allocation for 2024',
          status: 'Pending Review',
          requester: 'Finance Team',
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        },
        {
          id: '2',
          title: 'New Vendor Selection',
          status: 'Under Discussion',
          requester: 'Procurement',
          dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        },
      ],
    };
  }

  private async fetchApprovals(params: Record<string, any>): Promise<any> {
    // Mock approval data
    return {
      approvals: [
        {
          id: '1',
          title: 'Vacation Request - John Doe',
          type: 'Time Off',
          status: 'Pending',
          requestDate: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '2',
          title: 'Equipment Purchase - $5,000',
          type: 'Purchase Order',
          status: 'Pending',
          requestDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ],
    };
  }

  private async handleGeneralQuery(params: Record<string, any>): Promise<any> {
    // Handle general queries
    return {
      query: params.query,
      response: 'This is a general response to your query. In production, this would be handled by an AI model.',
      suggestions: [
        'Try searching for specific items',
        'Use keywords like "schedule", "news", "tasks"',
        'Ask about ServiceNow incidents or Workday employees',
      ],
    };
  }
}
