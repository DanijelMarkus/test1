import { UserContext, UserProfile } from '@/lib/types';

/**
 * Agent D: Memory & Context
 * Manages user profile, recent activity, and session context
 */
export class MemoryAgent {
  private contextStore: Map<string, UserContext>;

  constructor() {
    this.contextStore = new Map();
  }

  async getContext(userId: string): Promise<UserContext> {
    let context = this.contextStore.get(userId);

    if (!context) {
      // Initialize new context
      context = await this.initializeContext(userId);
      this.contextStore.set(userId, context);
    }

    return context;
  }

  async updateContext(userId: string, updates: Partial<UserContext>): Promise<UserContext> {
    const context = await this.getContext(userId);
    const updatedContext = { ...context, ...updates };
    this.contextStore.set(userId, updatedContext);
    return updatedContext;
  }

  async addActivity(userId: string, activity: string): Promise<void> {
    const context = await this.getContext(userId);
    context.recentActivity.unshift(activity);
    
    // Keep only last 50 activities
    if (context.recentActivity.length > 50) {
      context.recentActivity = context.recentActivity.slice(0, 50);
    }

    this.contextStore.set(userId, context);
  }

  async updatePreferences(userId: string, preferences: Record<string, any>): Promise<void> {
    const context = await this.getContext(userId);
    context.preferences = { ...context.preferences, ...preferences };
    this.contextStore.set(userId, context);
  }

  async getRecentActivity(userId: string, limit: number = 10): Promise<string[]> {
    const context = await this.getContext(userId);
    return context.recentActivity.slice(0, limit);
  }

  private async initializeContext(userId: string): Promise<UserContext> {
    // In production, this would fetch from a database
    return {
      userId,
      profile: await this.fetchUserProfile(userId),
      recentActivity: [],
      preferences: this.getDefaultPreferences(),
      sessionId: this.generateSessionId(),
    };
  }

  private async fetchUserProfile(userId: string): Promise<UserProfile> {
    // Mock implementation - in production, would fetch from Graph API
    return {
      id: userId,
      email: `${userId}@company.com`,
      name: 'User Name',
      jobTitle: 'Employee',
      department: 'Department',
    };
  }

  private getDefaultPreferences(): Record<string, any> {
    return {
      theme: 'light',
      language: 'en',
      notifications: true,
      cardOrder: ['schedule', 'actions', 'approvals', 'news', 'decisions'],
    };
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  clearContext(userId: string): void {
    this.contextStore.delete(userId);
  }
}
