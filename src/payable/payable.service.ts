import { Injectable } from '@nestjs/common';
import { PayableRepository } from './payable.repository';
import { CreatePayableRequest } from './dtos/create-payable.request';
import { AssignorService } from '../assignor/assignor.service';
import { PayableMapper } from './infrastructure/mappers/payable.mapper';

@Injectable()
export class PayableService {
  constructor(
    private payableRepository: PayableRepository,
    private assignorService: AssignorService,
  ) {}

  async createPayable(createPayableRequest: CreatePayableRequest) {
    const assignor = await this.assignorService.verifyExists(
      createPayableRequest.assignorId,
    );

    if (!assignor) {
      throw new Error('Assignor not found');
    }

    const mapped = PayableMapper.toPersistence(createPayableRequest);

    return await this.payableRepository.create(mapped);
  }

  async getById(id: string) {
    return await this.payableRepository.getById(id);
  }
}
