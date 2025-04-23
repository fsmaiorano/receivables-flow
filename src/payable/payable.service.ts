import { Injectable } from '@nestjs/common';
import { PayableRepository } from './payable.repository';
import { CreatePayableRequest } from './dtos/create-payable.request';

@Injectable()
export class PayableService {
  constructor(private payableRepository: PayableRepository) {}

  async createPayable(createPayableRequest: CreatePayableRequest) {
    console.log('Create Payable Request:', createPayableRequest);
    return await this.payableRepository.create(createPayableRequest);
  }

  async getPayableDetails(id: string) {
    return await this.payableRepository.getPayableDetails(id);
  }
}
