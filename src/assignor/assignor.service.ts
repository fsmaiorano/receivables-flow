import { Assignor } from './domain/entities/assignor.entity';
import { CreateAssignorResponse } from './dtos/create-assignor.response';
import { CreateAssignorRequest } from './dtos/create-assignor.request';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/shared/dto/result.generic';
import { HttpStatusCode } from 'axios';
import { GetAssignorResponse } from './dtos/get-assignor.response';
import { PaginatedResponseDto } from 'src/shared/dto/pagination.response';
import { PaginationRequestDto } from 'src/shared/dto/pagination.request';

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

  async getAssignorById(assignorId: string): Promise<Assignor | null> {
    return this.assignorRepository.findOne({
      where: { id: assignorId },
    });
  }

  async createAssignor(
    request: CreateAssignorRequest,
  ): Promise<Result<CreateAssignorResponse>> {
    const assignorExists = await this.verifyExists({
      assignorEmail: request.email,
    });

    try {
      if (assignorExists) {
        throw new Error('Assignor already exists');
      }

      const newAssignor = this.assignorRepository.create(request);
      const assignor = await this.assignorRepository.save(newAssignor);

      return Result.success<CreateAssignorResponse>(
        {
          id: assignor.id,
        },
        HttpStatusCode.Ok,
      );
    } catch (error) {
      return Result.failure<CreateAssignorResponse>(
        error.message,
        HttpStatusCode.BadRequest,
      );
    }
  }

  async updateAssignor(
    id: string,
    request: CreateAssignorRequest,
  ): Promise<Result<CreateAssignorResponse>> {
    const assignor = await this.getAssignorById(id);
    if (!assignor) {
      throw new Error('Assignor not found');
    }

    Object.assign(assignor, request);
    const updatedAssignor = await this.assignorRepository.save(assignor);

    return Result.success<CreateAssignorResponse>(
      {
        id: updatedAssignor.id,
      },
      HttpStatusCode.Ok,
    );
  }

  async deleteAssignor(id: string): Promise<Result<void>> {
    const assignor = await this.getAssignorById(id);
    if (!assignor) {
      throw new Error('Assignor not found');
    }

    await this.assignorRepository.remove(assignor);

    return Result.success<void>(undefined, HttpStatusCode.Ok);
  }

  async getAllAssignors(
    paginationOptions?: PaginationRequestDto,
  ): Promise<Result<PaginatedResponseDto<GetAssignorResponse>>> {
    try {
      const page = paginationOptions?.page ?? 0;
      const pageSize = paginationOptions?.pageSize ?? 10;

      const totalCount = await this.assignorRepository.count();

      const assignors = await this.assignorRepository.find({
        skip: page * pageSize,
        take: pageSize,
        order: {
          createdAt: 'DESC',
        },
      });

      const assignorResponses: GetAssignorResponse[] = assignors.map(
        (assignor) => ({
          id: assignor.id,
          document: assignor.document,
          email: assignor.email,
          phone: assignor.phone,
          name: assignor.name,
          createdAt: assignor.createdAt,
          updatedAt: assignor.updatedAt,
        }),
      );

      const paginatedResponse = PaginatedResponseDto.create(
        assignorResponses,
        totalCount,
        page,
        pageSize,
      );

      return Result.success(paginatedResponse, HttpStatusCode.Ok);
    } catch (error) {
      return Result.failure(
        error.message || 'Failed to retrieve assignors',
        HttpStatusCode.InternalServerError,
      );
    }
  }
}
