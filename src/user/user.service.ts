import { Injectable } from '@nestjs/common';
import { UserEntity } from './domain/entities/user.entity';
import { CreateUserRequest } from './dtos/create-user.request';

@Injectable()
export class UserService {
  private readonly users: UserEntity[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      password: '123456',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async create(request: CreateUserRequest): Promise<UserEntity> {
    const newUser: UserEntity = {
      id: (this.users.length + 1).toString(),
      name: request.name,
      email: request.email,
      username: request.username,
      password: request.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async findOne(username: string): Promise<UserEntity | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
