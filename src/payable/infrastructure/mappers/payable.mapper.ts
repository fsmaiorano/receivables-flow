import { Payable } from '../../domain/entities/payable.entity';
import { CreatePayableRequest } from '../../dtos/create-payable.request';

export class PayableMapper {
  static toDomain(entity: Payable): Payable {
    return entity;
  }

  static toPersistence(
    payable: Partial<Payable> | CreatePayableRequest,
  ): Partial<Payable> {
    return {
      value:
        typeof payable.value === 'string'
          ? parseFloat(payable.value)
          : payable.value,
      emissionDate: payable.emissionDate,
      assignorId: payable.assignorId,
    };
  }
}
