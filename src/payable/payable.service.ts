import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreatePayableRequest } from './dtos/create-payable.request';
import { PayableMapper } from './infrastructure/mappers/payable.mapper';
import { AssignorService } from '../assignor/assignor.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Payable } from './domain/entities/payable.entity';
import { CreatePayableBatchRequest } from './dtos/create-payable-batch.request';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { CreatePayableBatchResponse } from './dtos/create-payable-batch.response';
import { firstValueFrom } from 'rxjs';
import { CorrelationIdService } from '../shared/services/correlation-id.service';

@Injectable()
export class PayableService {
  constructor(
    private readonly assignorService: AssignorService,
    @InjectRepository(Payable)
    private readonly payableRepository: Repository<Payable>,
    @Inject('ReceivablesFlow') private client: ClientProxy,
    private readonly correlationIdService: CorrelationIdService,
  ) {}

  async getAllPayables(page: number, pageSize: number, filter: string = '') {
    const skipCount = page * pageSize;
    let queryBuilder = this.payableRepository.createQueryBuilder('payable');

    if (filter) {
      // Apply filter if provided - this is a simple implementation
      // You might want to expand this to filter by assignorId, value ranges, date ranges, etc.
      queryBuilder = queryBuilder
        .where('CAST(payable.value AS TEXT) LIKE :filter', {
          filter: `%${filter}%`,
        })
        .orWhere('CAST(payable.emissionDate AS TEXT) LIKE :filter', {
          filter: `%${filter}%`,
        });
    }

    const [items, total] = await queryBuilder
      .skip(skipCount)
      .take(pageSize)
      .orderBy('payable.createdAt', 'DESC')
      .getManyAndCount();

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: pageSize,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
      },
    };
  }

  async createPayable(createPayableRequest: CreatePayableRequest) {
    const existingPayable = await this.payableRepository.findOne({
      where: {
        value: createPayableRequest.value,
        emissionDate: createPayableRequest.emissionDate,
        assignorId: createPayableRequest.assignorId,
      },
    });

    if (!!existingPayable) {
      console.log('Duplicate payable detected, fetching existing record');
      return existingPayable;
    }

    const assignor = await this.assignorService.verifyExists({
      assignorId: createPayableRequest.assignorId,
    });

    if (!assignor) {
      throw new Error('Assignor not found');
    }

    const payableData = PayableMapper.toPersistence(createPayableRequest);
    const newPayable = this.payableRepository.create(payableData);

    return await this.payableRepository.save(newPayable);
  }

  async getById(id: string) {
    const payable = await this.payableRepository.findOne({ where: { id } });
    if (!payable) {
      throw new NotFoundException(`Payable with id ${id} not found`);
    }
    return payable;
  }

  async updatePayable(id: string, updatePayableRequest: CreatePayableRequest) {
    const payable = await this.getById(id);

    // Verify the assignor exists
    await this.assignorService.verifyExists({
      assignorId: updatePayableRequest.assignorId,
    });

    // Update the entity
    Object.assign(payable, {
      value: updatePayableRequest.value,
      emissionDate: updatePayableRequest.emissionDate,
      assignorId: updatePayableRequest.assignorId,
    });

    const updatedPayable = await this.payableRepository.save(payable);
    return updatedPayable;
  }

  async deletePayable(id: string) {
    const payable = await this.getById(id);
    const result = await this.payableRepository.remove(payable);
    return { success: true, id };
  }

  async createBatchPayableFromCsv(
    buffer: Buffer,
  ): Promise<CreatePayableBatchResponse[]> {
    const csvString = buffer.toString('utf-8');

    const lines = csvString.split('\n');
    const headers = lines[0].split(',');

    const valueIndex = headers.findIndex((h) => h.trim() === 'value');
    const emissionDateIndex = headers.findIndex(
      (h) => h.trim() === 'emissionDate',
    );
    const assignorIdIndex = headers.findIndex((h) => h.trim() === 'assignorId');

    if (valueIndex === -1 || assignorIdIndex === -1) {
      throw new Error('CSV is missing required fields (value, assignorId)');
    }

    const payableRequests: CreatePayableRequest[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',');

      const payableRequest = new CreatePayableRequest();
      payableRequest.value = parseFloat(values[valueIndex].trim());

      if (emissionDateIndex !== -1 && values[emissionDateIndex]) {
        const dateString = values[emissionDateIndex].replace(/"/g, '').trim();
        payableRequest.emissionDate = new Date(dateString);
      } else {
        payableRequest.emissionDate = new Date();
      }

      payableRequest.assignorId = values[assignorIdIndex]
        .replace(/"/g, '')
        .trim();

      payableRequests.push(payableRequest);
    }

    const createdPayableBatches = await this.createBatchPayable({
      payables: payableRequests,
    });

    return createdPayableBatches;
  }

  async createBatchPayable(
    createPayableBatchRequest: CreatePayableBatchRequest,
  ): Promise<CreatePayableBatchResponse[]> {
    console.log(
      'Processing batch of',
      createPayableBatchRequest.payables.length,
      'payables',
    );

    const results: CreatePayableBatchResponse[] = [];
    const batchSize = 10;

    for (
      let i = 0;
      i < createPayableBatchRequest.payables.length;
      i += batchSize
    ) {
      const batch = createPayableBatchRequest.payables.slice(i, i + batchSize);

      try {
        await this.sendToQueue(batch);
      } catch (sendError) {
        console.error('Error sending batch notification:', {
          error: sendError.message,
        });
      }
    }

    return results;
  }

  /**
   * Send a batch of payable requests to the RabbitMQ queue
   * @param payableBatchRequest Array of payable requests to send
   * @returns Response from the message broker
   */
  private async sendToQueue(
    payableBatchRequest: CreatePayableRequest[],
  ): Promise<any> {
    const correlationId = this.correlationIdService.getCorrelationId();
    const messageId = crypto.randomUUID();

    const record = new RmqRecordBuilder(payableBatchRequest)
      .setOptions({
        headers: {
          ['x-version']: '1.0.0',
          ['x-correlation-id']: correlationId,
          ['x-message-id']: messageId,
        },
        priority: 3,
        messageId: messageId,
      })
      .build();

    try {
      console.log(
        `Sending batch of ${payableBatchRequest.length} items with correlation ID: ${correlationId}`,
      );
      const response = await firstValueFrom(
        this.client.send('payable', record),
      );
      console.log('Batch notification sent successfully', {
        correlationId,
        messageId,
        response,
      });
      return {
        ...response,
        receivedAt: new Date(),
        correlationId,
        messageId,
      };
    } catch (error) {
      console.error('Error sending batch notification:', {
        error: error.message,
        stack: error.stack,
        correlationId,
        timestamp: new Date().toISOString(),
        batchSize: payableBatchRequest.length,
        connectionState: this.client?.status ? 'connected' : 'disconnected',
      });
      throw new Error(
        `Failed to send batch notification: ${error.message}. Correlation ID: ${correlationId}`,
      );
    }
  }
}
