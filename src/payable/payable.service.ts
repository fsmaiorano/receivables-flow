import { Injectable } from '@nestjs/common';
import { PayableRepository } from './payable.repository';
import { CreatePayableRequest } from './dtos/create-payable.request';
import { PayableMapper } from './infrastructure/mappers/payable.mapper';
import { AssignorService } from '../assignor/assignor.service';

@Injectable()
export class PayableService {
  constructor(
    private readonly payableRepository: PayableRepository,
    private readonly assignorService: AssignorService,
  ) {}

  async createPayable(createPayableRequest: CreatePayableRequest) {
    await this.assignorService.verifyExists({
      assignorId: createPayableRequest.assignorId,
    });

    const prismaPayable = PayableMapper.toPersistence(createPayableRequest);

    return await this.payableRepository.create(prismaPayable);
  }

  async getById(id: string) {
    return await this.payableRepository.getById(id);
  }
}
