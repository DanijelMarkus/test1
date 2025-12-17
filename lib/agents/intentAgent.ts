import { Intent } from '@/lib/types';

/**
 * Agent A: Intent Understanding
 * Analyzes user utterances to extract intent and entities
 */
export class IntentAgent {
  private intentPatterns: Map<string, RegExp[]>;

  constructor() {
    // Define intent patterns (simplified NLU)
    this.intentPatterns = new Map([
      ['schedule.view', [/show.*schedule/i, /what.*meetings/i, /calendar/i]],
      ['schedule.create', [/create.*meeting/i, /schedule.*appointment/i, /book.*time/i]],
      ['news.view', [/show.*news/i, /latest.*updates/i, /what.*new/i]],
      ['action.view', [/show.*actions/i, /my.*tasks/i, /what.*to.*do/i]],
      ['action.complete', [/complete.*action/i, /finish.*task/i, /mark.*done/i]],
      ['decision.view', [/show.*decisions/i, /pending.*decisions/i]],
      ['decision.make', [/approve/i, /reject/i, /decide/i]],
      ['approval.view', [/show.*approvals/i, /pending.*approvals/i]],
      ['approval.process', [/approve.*request/i, /reject.*request/i]],
      ['servicenow.ticket', [/create.*ticket/i, /open.*incident/i, /report.*issue/i]],
      ['workday.timeoff', [/request.*time.*off/i, /vacation/i, /leave.*request/i]],
      ['workday.expense', [/submit.*expense/i, /expense.*report/i]],
      ['help', [/help/i, /what.*can.*you.*do/i]],
    ]);
  }

  async understand(utterance: string): Promise<Intent> {
    // Simple pattern matching for intent classification
    for (const [intentType, patterns] of this.intentPatterns.entries()) {
      for (const pattern of patterns) {
        if (pattern.test(utterance)) {
          return {
            type: intentType,
            confidence: this.calculateConfidence(utterance, pattern),
            entities: this.extractEntities(utterance, intentType),
            utterance,
          };
        }
      }
    }

    // Default intent
    return {
      type: 'unknown',
      confidence: 0.1,
      entities: {},
      utterance,
    };
  }

  private calculateConfidence(utterance: string, pattern: RegExp): number {
    // Simplified confidence scoring
    const matches = utterance.match(pattern);
    if (!matches) return 0.5;
    
    // Higher confidence for longer matches
    const matchLength = matches[0].length;
    const utteranceLength = utterance.length;
    return Math.min(0.95, 0.6 + (matchLength / utteranceLength) * 0.35);
  }

  private extractEntities(utterance: string, intentType: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // Extract dates
    const datePattern = /\b(today|tomorrow|next week|monday|tuesday|wednesday|thursday|friday)\b/i;
    const dateMatch = utterance.match(datePattern);
    if (dateMatch) {
      entities.date = dateMatch[0];
    }

    // Extract numbers (for expenses, amounts, etc.)
    const numberPattern = /\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/;
    const numberMatch = utterance.match(numberPattern);
    if (numberMatch) {
      entities.amount = numberMatch[1];
    }

    // Extract person names (simple capitalized words)
    const namePattern = /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/;
    const nameMatch = utterance.match(namePattern);
    if (nameMatch) {
      entities.person = nameMatch[1];
    }

    return entities;
  }
}
