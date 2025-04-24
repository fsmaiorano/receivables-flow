import { CreateAssignorResponse } from '../../../assignor/dtos/create-assignor.response';
import { AssignorEntity } from '../entities/assignor.entity';
import { CreateAssignorRequest } from '../../../assignor/dtos/create-assignor.request';

export interface VerifyExistsParams {
  assignorId?: string;
  assignorEmail?: string;
}

export interface AssignorServiceInterface {
  verifyExists(params: VerifyExistsParams): Promise<boolean>;
  createAssignor(
    request: CreateAssignorRequest,
  ): Promise<CreateAssignorResponse>;
  getAssignorById(assignorId: string): Promise<AssignorEntity | null>;
}
