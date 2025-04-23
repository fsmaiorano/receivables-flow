import { Injectable, NotFoundException } from '@nestjs/common';
import { Assignor } from 'generated/prisma';
import { PrismaService } from '../prisma.service';
import { AssignorRepositoryInterface } from './domain/interfaces/assignor-repository.interface';
import { AssignorEntity } from './domain/entities/assignor.entity';

@Injectable()
export class AssignorRepository implements AssignorRepositoryInterface {
  constructor(private prismaService: PrismaService) {}
  async findById(id: string): Promise<AssignorEntity | null> {
    const assignor = await this.prismaService.assignor.findUnique({
      where: { id },
    });

    if (!assignor) {
      return null;
    }

    return assignor;
  }

  async findByEmail(email: string): Promise<AssignorEntity | null> {
    const assignor = await this.prismaService.assignor.findFirst({
      where: { email },
    });

    if (!assignor) {
      throw new NotFoundException(`Assignor with email ${email} not found`);
    }

    return assignor;
  }

  async create(assignorData: Omit<Assignor, 'id' | 'createdAt' | 'updatedAt'>) {
    return await this.prismaService.assignor.create({
      data: assignorData,
    });
  }
}
