import { Controller } from '@nestjs/common';
import { DeduplicationService } from 'src/shared/services/deduplication.service';
import { PayableService } from './payable.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreatePayableRequest } from './dtos/create-payable.request';
import { CorrelationIdService } from '../shared/services/correlation-id.service';
import * as crypto from 'crypto';

@Controller('payable')
export class PayableMessaging {
  constructor(
    private payableService: PayableService,
    private deduplicationService: DeduplicationService,
    private correlationIdService: CorrelationIdService,
  ) {}

  @MessagePattern('payable')
  async handlePayableMessage(
    @Payload() data: CreatePayableRequest[],
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    const properties = originalMsg.properties || {};
    const headers = properties.headers || {};
    const retryCount = headers['x-retry-count'] || 0;

    const messageId = headers['x-message-id'] || crypto.randomUUID();
    const correlationId =
      headers['x-correlation-id'] ||
      this.correlationIdService.getCorrelationId();

    try {
      console.log(`Processing message with correlation ID: ${correlationId}`, {
        dataLength: Array.isArray(data) ? data.length : 'not an array',
        headers,
        retryCount,
      });

      if (this.deduplicationService.isProcessed(messageId)) {
        console.log(
          `Duplicate message detected with ID: ${messageId}. Skipping processing.`,
        );
        channel.ack(originalMsg);
        return {
          status: 'skipped',
          message: 'Duplicate message detected and skipped',
          receivedAt: new Date(),
          messageId,
        };
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('Invalid data format received', data);

        // Move to dead letter queue for invalid format
        if (retryCount >= 4) {
          await this.handleDeadLetter(
            data,
            retryCount,
            messageId,
            correlationId,
          );
          channel.ack(originalMsg);
          return {
            status: 'error',
            message: 'Invalid data format, moved to dead letter queue',
            receivedAt: new Date(),
            messageId,
            retryCount,
          };
        } else {
          await this.handleRetry(data, retryCount, messageId, correlationId);
          channel.ack(originalMsg);
          return {
            status: 'retrying',
            message: `Invalid data format, moving to retry queue ${retryCount + 1}`,
            receivedAt: new Date(),
            messageId,
            retryCount,
          };
        }
      }

      let hasErrors = false;
      for (const payableRequest of data) {
        try {
          Object.assign(payableRequest, { correlationId });
          const result =
            await this.payableService.createPayable(payableRequest);

          if (!result.isSuccess) {
            hasErrors = true;
            console.error(`Failed to process payable:`, {
              error: '',
              payableRequest,
              correlationId,
            });
          } else {
            console.log(
              `Successfully processed payable with correlation ID: ${correlationId}`,
              {
                value: payableRequest.value,
                assignorId: payableRequest.assignorId,
              },
            );
          }
        } catch (itemError) {
          hasErrors = true;
          console.error(`Error processing item in batch:`, {
            error: itemError.message,
            payableRequest,
            correlationId,
          });
        }
      }

      if (hasErrors) {
        // If there were errors, use the retry mechanism
        if (retryCount >= 4) {
          await this.handleDeadLetter(
            data,
            retryCount,
            messageId,
            correlationId,
          );
          console.log(`Maximum retries reached, moved to dead letter queue`, {
            correlationId,
            messageId,
          });
        } else {
          await this.handleRetry(data, retryCount, messageId, correlationId);
          console.log(`Retrying with next queue`, {
            correlationId,
            messageId,
            currentRetry: retryCount,
            nextRetry: retryCount + 1,
          });
        }
      } else {
        // If all items processed successfully, mark as processed
        this.deduplicationService.markAsProcessed(messageId);
      }

      channel.ack(originalMsg);

      return {
        status: hasErrors ? 'partial' : 'processed',
        message: hasErrors
          ? `Processed with errors, retrying (attempt ${retryCount + 1})`
          : `Successfully processed ${data.length} payable items`,
        receivedAt: new Date(),
        correlationId,
        messageId,
        retryCount,
      };
    } catch (error) {
      console.error('Error in message handler:', {
        error: error.message,
        stack: error.stack,
        correlationId,
        retryCount,
      });

      try {
        if (retryCount >= 4) {
          await this.handleDeadLetter(
            data,
            retryCount,
            messageId,
            correlationId,
          );
        } else {
          await this.handleRetry(data, retryCount, messageId, correlationId);
        }
      } catch (retryError) {
        console.error('Failed to handle retry/dead letter:', {
          error: retryError.message,
          correlationId,
          messageId,
        });
      }

      channel.ack(originalMsg);

      return {
        status: 'error',
        error: error.message,
        receivedAt: new Date(),
        correlationId,
        messageId,
        retryCount,
        nextAction: retryCount >= 4 ? 'dead_letter' : `retry_${retryCount + 1}`,
      };
    }
  }

  /**
   * Handle retrying a failed message by sending to the next retry queue
   */
  private async handleRetry(
    data: CreatePayableRequest[],
    currentRetryCount: number,
    messageId: string,
    correlationId: string,
  ): Promise<void> {
    console.log(`Handling retry for message`, {
      messageId,
      correlationId,
      currentRetryCount,
      nextRetryCount: currentRetryCount + 1,
    });

    await this.payableService.retryPayable(data, currentRetryCount);
  }

  /**
   * Handle sending a message to the dead letter queue after all retries have failed
   */
  private async handleDeadLetter(
    data: CreatePayableRequest[],
    currentRetryCount: number,
    messageId: string,
    correlationId: string,
  ): Promise<void> {
    console.log(`Sending to dead letter queue`, {
      messageId,
      correlationId,
      retryCount: currentRetryCount,
    });

    // The retryPayable method will handle sending to dead letter when retryCount + 1 > 4
    await this.payableService.retryPayable(data, currentRetryCount);
  }
}
