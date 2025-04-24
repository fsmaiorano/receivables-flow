import { Assignor } from './domain/entities/assignor.entity';
import { CreateAssignorResponse } from './dtos/create-assignor.response';
import { CreateAssignorRequest } from './dtos/create-assignor.request';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface VerifyExistsParams {
  assignorId?: string;
  assignorEmail?: string;
}

@Injectable()
export class AssignorService {
  constructor(
    @InjectRepository(Assignor)
    private assignorRepository: Repository<Assignor>,
  ) {}

  async getAssignorById(assignorId: string): Promise<Assignor | null> {
    return this.assignorRepository.findOne({
      where: { id: assignorId },
    });
  }

  async verifyExists({
    assignorId,
    assignorEmail,
  }: VerifyExistsParams = {}): Promise<boolean> {
    if (assignorId) {
      const assignor = await this.assignorRepository.findOne({
        where: { id: assignorId },
      });
      return assignor !== null;
    }
    if (assignorEmail) {
      const assignor = await this.assignorRepository.findOne({
        where: { email: assignorEmail },
      });
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

    const newAssignor = this.assignorRepository.create(request);
    const assignor = await this.assignorRepository.save(newAssignor);
    return assignor;
  }
}
