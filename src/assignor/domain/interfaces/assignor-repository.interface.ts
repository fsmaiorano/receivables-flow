import { AssignorEntity } from '../entities/assignor.entity';

export interface AssignorRepositoryInterface {
  create(
    assignorData: Omit<AssignorEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AssignorEntity>;
  findById(id: string): Promise<AssignorEntity | null>;
}
