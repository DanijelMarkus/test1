import { GuardrailResult } from './types';

/**
 * Guardrails Agent - Validates and sanitizes inputs/outputs for security and compliance
 */
export class GuardrailsAgent {
  async validateInput(input: string, context?: Record<string, any>): Promise<GuardrailResult> {
    // Check for sensitive data patterns
    if (this.containsSensitiveData(input)) {
      return {
        allowed: false,
        reason: 'Input contains potentially sensitive data',
      };
    }

    // Check for malicious patterns
    if (this.containsMaliciousPatterns(input)) {
      return {
        allowed: false,
        reason: 'Input contains potentially malicious patterns',
      };
    }

    // Sanitize input
    const sanitizedInput = this.sanitize(input);

    return {
      allowed: true,
      sanitizedInput,
    };
  }

  async validateOutput(output: any, context?: Record<string, any>): Promise<GuardrailResult> {
    // Ensure output doesn't contain sensitive data
    const outputStr = typeof output === 'string' ? output : JSON.stringify(output);

    if (this.containsSensitiveData(outputStr)) {
      return {
        allowed: false,
        reason: 'Output contains potentially sensitive data',
      };
    }

    return {
      allowed: true,
    };
  }

  private containsSensitiveData(text: string): boolean {
    // Check for common sensitive data patterns
    const sensitivePatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{16}\b/, // Credit card
      /password/i,
      /api[_-]?key/i,
      /secret/i,
    ];

    return sensitivePatterns.some(pattern => pattern.test(text));
  }

  private containsMaliciousPatterns(text: string): boolean {
    // Check for common injection patterns
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /onerror=/i,
      /onclick=/i,
      /union\s+select/i,
      /drop\s+table/i,
    ];

    return maliciousPatterns.some(pattern => pattern.test(text));
  }

  private sanitize(input: string): string {
    // Basic sanitization - remove HTML tags and trim
    return input
      .replace(/<[^>]*>/g, '')
      .trim();
  }
}
