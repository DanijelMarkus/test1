import { ComplianceCheck, Intent, ExecutionPlan } from '@/lib/types';

/**
 * Agent E: Guardrails & Compliance
 * Enforces policies, consent, and audit logging
 */
export class GuardrailsAgent {
  private auditLogs: Array<{
    timestamp: string;
    userId: string;
    action: string;
    details: any;
  }>;

  constructor() {
    this.auditLogs = [];
  }

  async checkCompliance(
    intent: Intent,
    plan: ExecutionPlan,
    userId: string
  ): Promise<ComplianceCheck> {
    const violations: string[] = [];
    const warnings: string[] = [];

    // Check data access policies
    const dataAccessCheck = this.checkDataAccessPolicy(intent, userId);
    if (!dataAccessCheck.passed && dataAccessCheck.violations) {
      violations.push(...dataAccessCheck.violations);
    }
    if (dataAccessCheck.warnings) {
      warnings.push(...dataAccessCheck.warnings);
    }

    // Check sensitive operations
    const sensitiveOpCheck = this.checkSensitiveOperations(plan);
    if (!sensitiveOpCheck.passed && sensitiveOpCheck.violations) {
      violations.push(...sensitiveOpCheck.violations);
    }
    if (sensitiveOpCheck.warnings) {
      warnings.push(...sensitiveOpCheck.warnings);
    }

    // Check rate limits
    const rateLimitCheck = this.checkRateLimits(userId);
    if (!rateLimitCheck.passed && rateLimitCheck.violations) {
      violations.push(...rateLimitCheck.violations);
    }

    // Log the compliance check
    const auditLogId = this.logAudit({
      userId,
      action: 'compliance-check',
      intent: intent.type,
      plan: plan.selectedAgent.name,
      passed: violations.length === 0,
    });

    return {
      passed: violations.length === 0,
      violations,
      warnings,
      auditLogId,
    };
  }

  private checkDataAccessPolicy(intent: Intent, userId: string): Partial<ComplianceCheck> {
    const violations: string[] = [];
    const warnings: string[] = [];

    // Define restricted intent types
    const restrictedIntents = ['approval.process', 'decision.make'];
    
    if (restrictedIntents.includes(intent.type)) {
      // In production, check user role/permissions
      warnings.push(`Intent ${intent.type} requires manager role verification`);
    }

    // Check for PII access
    if (intent.entities.person || intent.entities.email) {
      warnings.push('Intent involves personal information - ensure GDPR compliance');
    }

    return { passed: violations.length === 0, violations, warnings };
  }

  private checkSensitiveOperations(plan: ExecutionPlan): Partial<ComplianceCheck> {
    const violations: string[] = [];
    const warnings: string[] = [];

    // Check for financial operations
    const financialActions = ['submit-expense', 'process-approval'];
    const hasFinancialOp = plan.steps.some(step => 
      financialActions.includes(step.action)
    );

    if (hasFinancialOp) {
      warnings.push('Financial operation detected - ensure proper authorization');
    }

    // Check for external system access
    const externalConnectors = ['servicenow', 'workday'];
    const hasExternalAccess = plan.steps.some(step =>
      step.connector && externalConnectors.some(c => step.connector?.includes(c))
    );

    if (hasExternalAccess) {
      warnings.push('External system access detected - ensure token scope compliance');
    }

    return { passed: violations.length === 0, violations, warnings };
  }

  private checkRateLimits(userId: string): Partial<ComplianceCheck> {
    const violations: string[] = [];
    
    // Check recent audit logs for this user
    const recentLogs = this.auditLogs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      return log.userId === userId && logTime > fiveMinutesAgo;
    });

    // Limit to 100 requests per 5 minutes
    if (recentLogs.length > 100) {
      violations.push('Rate limit exceeded: Maximum 100 requests per 5 minutes');
    }

    return { passed: violations.length === 0, violations, warnings: [] };
  }

  logAudit(details: any): string {
    const auditLogId = `audit-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    this.auditLogs.push({
      timestamp: new Date().toISOString(),
      userId: details.userId,
      action: details.action,
      details: { ...details, auditLogId },
    });

    // In production, persist to database/audit service
    console.log(`[AUDIT] ${auditLogId}:`, details);

    return auditLogId;
  }

  async getAuditLogs(userId?: string, limit: number = 100): Promise<any[]> {
    let logs = this.auditLogs;
    
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }

    return logs.slice(-limit);
  }

  async enforceConsent(userId: string, operation: string): Promise<boolean> {
    // In production, check user consent records
    // For now, return true (consent assumed)
    this.logAudit({
      userId,
      action: 'consent-check',
      operation,
      consentGranted: true,
    });

    return true;
  }
}
