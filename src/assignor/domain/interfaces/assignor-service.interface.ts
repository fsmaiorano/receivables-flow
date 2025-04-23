import { AssignorEntity } from '../entities/assignor.entity';

export interface AssignorServiceInterface {
  verifyExists(assignorId: string): Promise<boolean>;
  createAssignor(assignorData: any): Promise<void>;
  getAssignorById(assignorId: string): Promise<AssignorEntity | null>;
}
