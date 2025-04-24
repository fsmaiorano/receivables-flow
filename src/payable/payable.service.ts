import { Injectable } from '@nestjs/common';
import { CreatePayableRequest } from './dtos/create-payable.request';
import { PayableMapper } from './infrastructure/mappers/payable.mapper';
import { AssignorService } from '../assignor/assignor.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PayableService {
  constructor(
    private readonly assignorService: AssignorService,
    private readonly prismaService: PrismaService,
  ) {}

  async createPayable(createPayableRequest: CreatePayableRequest) {
    const assignor = await this.assignorService.verifyExists({
      assignorId: createPayableRequest.assignorId,
    });

    if (!assignor) {
      throw new Error('Assignor not found');
    }

    const prismaPayable = PayableMapper.toPersistence(createPayableRequest);

    return await this.prismaService.payable.create({ data: prismaPayable });
  }

  async getById(id: string) {
    return await this.prismaService.payable.findFirst({ where: { id } });
  }
}
