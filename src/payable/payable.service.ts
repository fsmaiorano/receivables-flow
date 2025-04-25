import { Injectable } from '@nestjs/common';
import { CreatePayableRequest } from './dtos/create-payable.request';
import { PayableMapper } from './infrastructure/mappers/payable.mapper';
import { AssignorService } from '../assignor/assignor.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payable } from './domain/entities/payable.entity';
import { CreatePayableBatchRequest } from './dtos/create-payable-batch.request';

@Injectable()
export class PayableService {
  constructor(
    private readonly assignorService: AssignorService,
    @InjectRepository(Payable)
    private readonly payableRepository: Repository<Payable>,
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
    return await this.payableRepository.findOne({ where: { id } });
  }

  async createBatchPayable(
    createPayableBatchRequest: CreatePayableBatchRequest,
  ) {
    console.log('createBatchPayable', createPayableBatchRequest.payables);
  }
}
