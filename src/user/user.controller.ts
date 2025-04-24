import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dtos/create-user.request';
import { CreateUserResponse } from './dtos/create-user.response';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  async createUser(
    createUserRequest: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    return this.userService.create(createUserRequest);
  }
}
