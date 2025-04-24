import { Injectable } from '@nestjs/common';
import { UserEntity } from './domain/entities/user.entity';
import { CreateUserRequest } from './dtos/create-user.request';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(request: CreateUserRequest): Promise<UserEntity> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: request.username }, { email: request.email }],
      },
    });
    if (user) {
      throw new Error('Username already exists');
    }
    return this.prismaService.user.create({
      data: {
        username: request.username,
        email: request.email,
        password: request.password,
        name: request.name,
      },
    });
  }

  async findOne(username: string): Promise<UserEntity | undefined> {
    return this.prismaService.user.findUnique({ where: { username } });
  }
}
