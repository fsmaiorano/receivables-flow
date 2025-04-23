import { Inject, Injectable } from '@nestjs/common';
import { AssignorRepositoryInterface } from './domain/interfaces/assignor-repository.interface';
import {
  AssignorServiceInterface,
  VerifyExistsParams,
} from './domain/interfaces/assignor-service.interface';
import { AssignorEntity } from './domain/entities/assignor.entity';
import { CreateAssignorResponse } from './dtos/create-assignor.response';
import { CreateAssignorRequest } from './dtos/create-assignor.request';

@Injectable()
export class AssignorService implements AssignorServiceInterface {
  constructor(
    @Inject('AssignorRepository')
    private assignorRepository: AssignorRepositoryInterface,
  ) {}
  async getAssignorById(assignorId: string): Promise<AssignorEntity | null> {
    const assignor = await this.assignorRepository.findById(assignorId);
    return assignor;
  }

  async verifyExists({
    assignorId,
    assignorEmail,
  }: VerifyExistsParams = {}): Promise<boolean> {
    if (assignorId) {
      const assignor = await this.assignorRepository.findById(assignorId);
      return assignor !== null;
    }
    if (assignorEmail) {
      const assignor = await this.assignorRepository.findByEmail(assignorEmail);
      return assignor !== null;
    }
    return false;
  }

  async createAssignor(
    request: CreateAssignorRequest,
  ): Promise<CreateAssignorResponse> {
    const assignorExists = await this.verifyExists({
      assignorEmail: request.email,
    });

    if (assignorExists) {
      throw new Error('Assignor already exists');
    }

    const assignor = await this.assignorRepository.create(request);
    return assignor;
  }
}
