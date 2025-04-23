import { CreateAssignorResponse } from 'src/assignor/dtos/create-assignor.response';
import { AssignorEntity } from '../entities/assignor.entity';

export interface AssignorServiceInterface {
  verifyExists(assignorId: string): Promise<boolean>;
  createAssignor(assignorData: any): Promise<CreateAssignorResponse>;
  getAssignorById(assignorId: string): Promise<AssignorEntity | null>;
}
