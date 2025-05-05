import { Assignor } from 'src/assignor/domain/entities/assignor.entity';

export interface GetPayableResponse {
  id: string;
  value: number;
  emissionDate: Date;
  assignorId: string;
  assignor: Assignor | null;
  createdAt: Date;
  updatedAt: Date;
}
