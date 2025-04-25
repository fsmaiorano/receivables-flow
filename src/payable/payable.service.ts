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

    // Process each payable in the batch
    for (const payableRequest of createPayableBatchRequest.payables) {
      try {
        const payable = await this.createPayable(payableRequest);

        results.push({
          id: payable.id,
          value: payable.value,
          emissionDate: payable.emissionDate,
          assignorId: payable.assignorId,
          createdAt: payable.createdAt,
          updatedAt: payable.updatedAt,
          status: 'created',
        });
      } catch (error) {
        // If an individual payable fails, add error to results but continue processing
        results.push({
          value: payableRequest.value,
          assignorId: payableRequest.assignorId,
          status: 'error',
          error: error.message,
        });
      }
    }

    // Optionally notify via RabbitMQ that a batch was processed
    const message = `Processed batch of ${results.length} payables`;
    const record = new RmqRecordBuilder(message)
      .setOptions({
        headers: {
          ['x-version']: '1.0.0',
        },
        priority: 3,
      })
      .build();

    this.client.send('payable-batch-processed', record).subscribe({
      next: (response) => {
        console.log('Batch notification sent successfully', response);
      },
      error: (error) => {
        console.error('Error sending batch notification', error);
      },
    });

    return results;
  }

  async createBatchPayableFromCsv(
    buffer: Buffer,
  ): Promise<CreatePayableBatchResponse[]> {
    // Convert CSV buffer to string
    const csvString = buffer.toString('utf-8');

    // Split by lines and extract headers and data rows
    const lines = csvString.split('\n');
    const headers = lines[0].split(',');

    // Find index positions for the required fields
    const valueIndex = headers.findIndex((h) => h.trim() === 'value');
    const emissionDateIndex = headers.findIndex(
      (h) => h.trim() === 'emissionDate',
    );
    const assignorIdIndex = headers.findIndex((h) => h.trim() === 'assignorId');

    // Check if required fields are present
    if (valueIndex === -1 || assignorIdIndex === -1) {
      throw new Error('CSV is missing required fields (value, assignorId)');
    }

    // Parse data rows into payable requests
    const payableRequests: CreatePayableRequest[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines

      // Handle CSV parsing (this is a simple version, might need to be more robust)
      const values = line.split(',');

      // Create payable request from CSV data
      const payableRequest = new CreatePayableRequest();
      payableRequest.value = parseFloat(values[valueIndex].trim());

      // Handle emission date if present
      if (emissionDateIndex !== -1 && values[emissionDateIndex]) {
        const dateString = values[emissionDateIndex].replace(/"/g, '').trim();
        payableRequest.emissionDate = new Date(dateString);
      } else {
        payableRequest.emissionDate = new Date();
      }

      // Get assignor ID, trimming any quotes
      payableRequest.assignorId = values[assignorIdIndex]
        .replace(/"/g, '')
        .trim();

      payableRequests.push(payableRequest);
    }

    // Process the payable requests as a batch
    return this.createBatchPayable({ payables: payableRequests });
  }
}
