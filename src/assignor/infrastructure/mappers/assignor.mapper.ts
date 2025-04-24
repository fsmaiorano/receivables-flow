import { CreateAssignorRequest } from '../../../assignor/dtos/create-assignor.request';
import { Assignor } from '../../domain/entities/assignor.entity';

export class AssignorMapper {
  static toDomain(entity: Assignor): Assignor {
    return entity;
  }

  static toPersistence(
    assignor: Partial<Assignor> | CreateAssignorRequest,
  ): Partial<Assignor> {
    return {
      document: assignor.document,
      email: assignor.email,
      phone: assignor.phone,
      name: assignor.name,
    };
  }
}
