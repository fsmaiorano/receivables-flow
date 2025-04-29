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
import * as crypto from 'crypto';

@Injectable()
export class PayableService {
  constructor(
    private readonly assignorService: AssignorService,
    @InjectRepository(Payable)
    private readonly payableRepository: Repository<Payable>,
    @Inject('ReceivablesFlow') private client: ClientProxy,
  ) {}

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

      for (const payableRequest of batch) {
        try {
          const correlationId = crypto.randomUUID();
          const record = new RmqRecordBuilder(payableRequest)
            .setOptions({
              headers: {
                ['x-version']: '1.0.0',
                ['x-correlation-id']: correlationId,
              },
              priority: 3,
            })
            .build();

          try {
            const response = await firstValueFrom(
              this.client.send('payable', record),
            );

            console.log('Batch notification sent successfully', response);

            results.push({
              id: response.id,
              value: payableRequest.value,
              emissionDate: payableRequest.emissionDate,
              assignorId: payableRequest.assignorId,
              status: 'created',
            });
          } catch (sendError) {
            console.error('Error sending batch notification', sendError);
            results.push({
              value: payableRequest.value,
              assignorId: payableRequest.assignorId,
              status: 'error',
              error: `Failed to queue message: ${sendError.message}`,
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
