import { Memory, MemoryEntry } from './types';

/**
 * Memory Agent - Maintains conversation history and context
 */
export class MemoryAgent {
  private memories: Map<string, Memory> = new Map();

  addEntry(conversationId: string, entry: Omit<MemoryEntry, 'timestamp'>): void {
    if (!this.memories.has(conversationId)) {
      this.memories.set(conversationId, {
        conversationId,
        history: [],
      });
    }

    const memory = this.memories.get(conversationId)!;
    memory.history.push({
      ...entry,
      timestamp: new Date(),
    });

    // Keep only last 50 entries to prevent memory overflow
    if (memory.history.length > 50) {
      memory.history = memory.history.slice(-50);
    }
  }

  getMemory(conversationId: string): Memory | undefined {
    return this.memories.get(conversationId);
  }

  getContext(conversationId: string, maxEntries: number = 10): MemoryEntry[] {
    const memory = this.memories.get(conversationId);
    if (!memory) return [];

    return memory.history.slice(-maxEntries);
  }

  clearMemory(conversationId: string): void {
    this.memories.delete(conversationId);
  }

  getAllConversations(): string[] {
    return Array.from(this.memories.keys());
  }
}
