import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePayableRequest } from './dtos/create-payable.request';
import { PayableMapper } from './infrastructure/mappers/payable.mapper';
import { AssignorService } from '../assignor/assignor.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payable } from './domain/entities/payable.entity';
import { CreatePayableBatchRequest } from './dtos/create-payable-batch.request';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { CreatePayableBatchResponse } from './dtos/create-payable-batch.response';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PayableService {
  constructor(
    private readonly assignorService: AssignorService,
    @InjectRepository(Payable)
    private readonly payableRepository: Repository<Payable>,
    @Inject('ReceivablesFlow') private client: ClientProxy,
  ) {}

  async createPayable(createPayableRequest: CreatePayableRequest) {
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

  async createBatchPayable(
    createPayableBatchRequest: CreatePayableBatchRequest,
  ): Promise<CreatePayableBatchResponse[]> {
    console.log(
      'Processing batch of',
      createPayableBatchRequest.payables.length,
      'payables',
    );

    const results: CreatePayableBatchResponse[] = [];
    const batchSize = 10; // Process in smaller batches to avoid overloading RabbitMQ

    // Process in smaller batches
    for (
      let i = 0;
      i < createPayableBatchRequest.payables.length;
      i += batchSize
    ) {
      const batch = createPayableBatchRequest.payables.slice(i, i + batchSize);

      // Process each payable in the batch sequentially
      for (const payableRequest of batch) {
        try {
          // First save the payable to database
          const payable = await this.createPayable(payableRequest);

          // Create a record with proper priority and metadata
          const record = new RmqRecordBuilder(payableRequest)
            .setOptions({
              headers: {
                ['x-version']: '1.0.0',
                ['x-correlation-id']: payable.id, // Add correlation ID for tracing
              },
              priority: 3,
            })
            .build();

          // Use firstValueFrom to wait for the message to be delivered
          try {
            const response = await firstValueFrom(
              this.client.send('payable', record),
            );

            console.log('Batch notification sent successfully', response);

            results.push({
              id: payable.id,
              value: payable.value,
              emissionDate: payable.emissionDate,
              assignorId: payable.assignorId,
              createdAt: payable.createdAt,
              updatedAt: payable.updatedAt,
              status: 'created',
            });
          } catch (sendError) {
            console.error('Error sending batch notification', sendError);
            results.push({
              id: payable.id,
              value: payable.value,
              emissionDate: payable.emissionDate,
              assignorId: payable.assignorId,
              status: 'error',
              error: `Saved to database but failed to queue: ${sendError.message}`,
            });
          }
        } catch (error) {
          console.error('Error creating payable:', error);
          results.push({
            value: payableRequest.value,
            assignorId: payableRequest.assignorId,
            status: 'error',
            error: error.message,
          });
        }
      }

      // Add a small delay between batches to avoid overloading RabbitMQ
      if (i + batchSize < createPayableBatchRequest.payables.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return results;
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

    return this.createBatchPayable({ payables: payableRequests });
  }
}
