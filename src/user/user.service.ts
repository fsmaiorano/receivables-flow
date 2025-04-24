import { Injectable } from '@nestjs/common';
import { UserEntity } from './domain/entities/user.entity';
import { CreateUserRequest } from './dtos/create-user.request';
import { PrismaService } from '../shared/prisma.service';
import { CreateUserResponse } from './dtos/create-user.response';
import { Result } from '../shared/dto/result.generic';
import { HttpStatusCode } from 'axios';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(
    request: CreateUserRequest,
  ): Promise<Result<CreateUserResponse>> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          OR: [{ username: request.username }, { email: request.email }],
        },
      });

      if (user) {
        throw new Error('Username already exists');
      }

      const createdUser = await this.prismaService.user.create({
        data: {
          username: request.username,
          email: request.email,
          password: request.password,
          name: request.name,
        },
      });

      return Result.success<CreateUserResponse>(
        {
          id: createdUser.id,
        },
        HttpStatusCode.Created,
      );
    } catch (error) {
      return Result.failure<CreateUserResponse>(
        error.message,
        HttpStatusCode.BadRequest,
      );
    }
  }

  async findOne(username: string): Promise<UserEntity | undefined> {
    return this.prismaService.user.findUnique({ where: { username } });
  }
}
