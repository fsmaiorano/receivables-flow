import { Injectable } from '@nestjs/common';

@Injectable()
export class DeduplicationService {
  // In-memory map to track processed messages
  private readonly processedMessages = new Map<string, number>();

  // Default TTL: 48 hours in milliseconds
  private readonly DEFAULT_TTL_MS = 48 * 60 * 60 * 1000;

  /**
   * Check if a message has been processed before
   * @param messageId Unique message identifier
   * @returns true if the message has been processed before
   */
  isProcessed(messageId: string): boolean {
    // Clean up expired entries every 100 checks
    if (Math.random() < 0.01) {
      this.cleanupExpiredEntries();
    }

    return this.processedMessages.has(messageId);
  }

  /**
   * Mark a message as processed
   * @param messageId Unique message identifier
   * @param ttlMs Time to live in milliseconds (how long to remember this message)
   */
  markAsProcessed(
    messageId: string,
    ttlMs: number = this.DEFAULT_TTL_MS,
  ): void {
    const expirationTime = Date.now() + ttlMs;
    this.processedMessages.set(messageId, expirationTime);
  }

  /**
   * Remove expired entries from the map
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, expirationTime] of this.processedMessages.entries()) {
      if (expirationTime < now) {
        this.processedMessages.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired message entries`);
    }
  }

  /**
   * Get the current size of the deduplication cache
   */
  getCacheSize(): number {
    return this.processedMessages.size;
  }
}
