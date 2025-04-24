import { Injectable } from '@nestjs/common';
import { User } from './domain/entities/user.entity';
import { CreateUserRequest } from './dtos/create-user.request';
import { CreateUserResponse } from './dtos/create-user.response';
import { Result } from '../shared/dto/result.generic';
import { HttpStatusCode } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    request: CreateUserRequest,
  ): Promise<Result<CreateUserResponse>> {
    try {
      const user = await this.userRepository.findOne({
        where: [{ username: request.username }, { email: request.email }],
      });

      if (user) {
        throw new Error('Username already exists');
      }

      const newUser = this.userRepository.create({
        username: request.username,
        email: request.email,
        password: request.password,
        name: request.name,
      });

      const createdUser = await this.userRepository.save(newUser);

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

  async findOne(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }
}
