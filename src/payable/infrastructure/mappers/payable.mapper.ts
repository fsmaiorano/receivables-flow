import { PayableEntity } from 'src/payable/domain/entities/payable.entity';
import { Payable as PrismaPayable } from '../../../../generated/prisma';
import { Decimal } from 'decimal.js';
import { CreatePayableRequest } from 'src/payable/dtos/create-payable.request';

export class PayableMapper {
  static toDomain(prismaPayable: PrismaPayable): PayableEntity {
    return {
      id: prismaPayable.id,
      value: prismaPayable.value,
      emissionDate: prismaPayable.emissionDate,
      assignorId: prismaPayable.assignorId,
      createdAt: prismaPayable.createdAt,
      updatedAt: prismaPayable.updatedAt,
    };
  }

  static toPersistence(
    payable: PayableEntity | CreatePayableRequest,
  ): Omit<PrismaPayable, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      value: new Decimal(payable.value),
      emissionDate: payable.emissionDate,
      assignorId: payable.assignorId,
    };
  }
}
