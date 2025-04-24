import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dtos/create-user.request';
import { CreateUserResponse } from './dtos/create-user.response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new user' })
  async createUser(
    @Body() createUserRequest: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    return this.userService.create(createUserRequest);
  }
}
