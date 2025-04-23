import { Assignor as PrismaAssignor } from '../../../../generated/prisma';
import { AssignorEntity } from '../../domain/entities/assignor.entity';

export class AssignorMapper {
  static toDomain(prismaAssignor: PrismaAssignor): AssignorEntity {
    return {
      id: prismaAssignor.id,
      document: prismaAssignor.document,
      email: prismaAssignor.email,
      phone: prismaAssignor.phone,
      name: prismaAssignor.name,
      createdAt: prismaAssignor.createdAt,
      updatedAt: prismaAssignor.updatedAt,
    };
  }

  static toPersistence(
    assignor: AssignorEntity,
  ): Omit<PrismaAssignor, 'id' | 'createdAt' | 'updatedAt' | 'Payable'> {
    return {
      document: assignor.document,
      email: assignor.email,
      phone: assignor.phone,
      name: assignor.name,
    };
  }
}
