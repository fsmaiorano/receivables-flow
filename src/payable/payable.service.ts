import { Injectable } from '@nestjs/common';
import { PayableRepository } from './payable.repository';
import { CreatePayableRequest } from './dtos/create-payable.request';
import { AssignorService } from 'src/assignor/assignor.service';

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

    return await this.payableRepository.create(createPayableRequest);
  }

  async getPayableDetails(id: string) {
    return await this.payableRepository.getById(id);
  }
}
