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

    const messageId = crypto.randomUUID();

    try {
      console.log(`Processing message with correlation ID: ${messageId}`, {
        dataLength: Array.isArray(data) ? data.length : 'not an array',
        headers: headers,
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
          messageId: messageId,
        };
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('Invalid data format received', data);
        channel.ack(originalMsg);
        return {
          status: 'error',
          message: 'Invalid data format',
          receivedAt: new Date(),
          messageId: messageId,
        };
      }

      for (const payableRequest of data) {
        try {
          Object.assign(payableRequest, { correlationId: messageId });
          await this.payableService.createPayable(payableRequest);

          console.log(
            `Successfully processed payable with correlation ID: ${messageId}`,
            {
              value: payableRequest.value,
              assignorId: payableRequest.assignorId,
            },
          );
        } catch (itemError) {
          console.error(`Error processing item in batch:`, {
            error: itemError.message,
            payableRequest,
            correlationId: messageId,
          });
        }
      }

      this.deduplicationService.markAsProcessed(messageId);
      channel.ack(originalMsg);

      return {
        status: 'processed',
        message: `Processed ${data.length} payable items`,
        receivedAt: new Date(),
        correlationId: messageId,
      };
    } catch (error) {
      console.error('Error in message handler:', {
        error: error.message,
        stack: error.stack,
        correlationId: messageId,
      });

      channel.nack(originalMsg, false, false);

      return {
        status: 'error',
        error: error.message,
        receivedAt: new Date(),
        correlationId: messageId,
      };
    }
  }
}
