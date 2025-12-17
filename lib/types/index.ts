// Core types for the Friday application

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  jobTitle?: string;
  department?: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url?: string;
  publishedAt: string;
  source?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  options: string[];
  requester?: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Approval {
  id: string;
  title: string;
  description: string;
  type: 'expense' | 'time_off' | 'document' | 'other';
  requester: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  amount?: number;
}

// Agent types
export interface Intent {
  type: string;
  confidence: number;
  entities: Record<string, any>;
  utterance: string;
}

export interface AgentCapability {
  name: string;
  description: string;
  requiredScopes: string[];
  supportedIntents: string[];
}

export interface Agent {
  id: string;
  name: string;
  type: 'intent' | 'planner' | 'executor' | 'memory' | 'guardrails';
  capabilities: AgentCapability[];
  endpoint?: string;
}

export interface ExecutionPlan {
  intent: Intent;
  selectedAgent: Agent;
  steps: ExecutionStep[];
  estimatedDuration?: number;
}

export interface ExecutionStep {
  id: string;
  action: string;
  parameters: Record<string, any>;
  connector?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
}

export interface UserContext {
  userId: string;
  profile: UserProfile;
  recentActivity: string[];
  preferences: Record<string, any>;
  sessionId: string;
}

export interface ComplianceCheck {
  passed: boolean;
  violations: string[];
  warnings: string[];
  auditLogId?: string;
}

// Connector types
export interface ConnectorConfig {
  name: string;
  type: 'servicenow' | 'workday' | 'custom-mcp';
  endpoint: string;
  authType: 'oauth2' | 'api-key' | 'bearer';
  scopes?: string[];
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  connector: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface OrchestratorRequest {
  utterance: string;
  context?: Partial<UserContext>;
  accessToken: string;
}

export interface OrchestratorResponse {
  intent: Intent;
  plan: ExecutionPlan;
  result: any;
  compliance: ComplianceCheck;
  executionTime: number;
}
