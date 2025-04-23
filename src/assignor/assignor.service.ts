import { Inject, Injectable } from '@nestjs/common';
import { AssignorRepositoryInterface } from './domain/interfaces/assignor-repository.interface';
import { AssignorServiceInterface } from './domain/interfaces/assignor-service.interface';
import { AssignorEntity } from './domain/entities/assignor.entity';

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

  async verifyExists(assignorId: string): Promise<boolean> {
    const assignor = await this.assignorRepository.findById(assignorId);
    return assignor !== null;
  }

  async createAssignor(assignorData: any): Promise<void> {
    await this.assignorRepository.create(assignorData);
  }
}
