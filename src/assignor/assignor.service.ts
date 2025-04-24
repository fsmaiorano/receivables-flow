import {
  AssignorServiceInterface,
  VerifyExistsParams,
} from './domain/interfaces/assignor-service.interface';
import { AssignorEntity } from './domain/entities/assignor.entity';
import { CreateAssignorResponse } from './dtos/create-assignor.response';
import { CreateAssignorRequest } from './dtos/create-assignor.request';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssignorService implements AssignorServiceInterface {
  constructor(private prismaService: PrismaService) {}
  async getAssignorById(assignorId: string): Promise<AssignorEntity | null> {
    const assignor = await this.prismaService.assignor.findUnique({
      where: { id: assignorId },
    });
    return assignor;
  }

  async verifyExists({
    assignorId,
    assignorEmail,
  }: VerifyExistsParams = {}): Promise<boolean> {
    if (assignorId) {
      const assignor = await this.prismaService.assignor.findUnique({
        where: { id: assignorId },
      });
      return assignor !== null;
    }
    if (assignorEmail) {
      const assignor = await this.prismaService.assignor.findFirst({
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

    const assignor = await this.prismaService.assignor.create({
      data: request,
    });
    return assignor;
  }
}
