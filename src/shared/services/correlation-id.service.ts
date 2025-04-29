import { Injectable, Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

/**
 * A request-scoped service to manage correlation IDs throughout the application
 */
@Injectable({ scope: Scope.REQUEST })
export class CorrelationIdService {
  private correlationId: string;

  constructor() {
    // Generate a default correlation ID
    this.correlationId = uuidv4();
  }

  /**
   * Set the correlation ID
   */
  setCorrelationId(correlationId: string): void {
    this.correlationId = correlationId;
  }

  /**
   * Get the current correlation ID
   */
  getCorrelationId(): string {
    return this.correlationId;
  }
}
