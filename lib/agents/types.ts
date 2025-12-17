/**
 * Type definitions for orchestrator agents
 */

export interface AgentRequest {
  query: string;
  context?: Record<string, any>;
  userId?: string;
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
}

export interface Intent {
  action: string;
  entities: Record<string, any>;
  confidence: number;
}

export interface Plan {
  steps: PlanStep[];
  estimatedDuration?: number;
}

export interface PlanStep {
  id: string;
  action: string;
  connector?: string;
  params: Record<string, any>;
  dependencies?: string[];
}

export interface ExecutionResult {
  stepId: string;
  success: boolean;
  data?: any;
  error?: string;
}

export interface Memory {
  conversationId: string;
  history: MemoryEntry[];
}

export interface MemoryEntry {
  timestamp: Date;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
}

export interface GuardrailResult {
  allowed: boolean;
  reason?: string;
  sanitizedInput?: string;
}
