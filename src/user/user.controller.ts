import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dtos/create-user.request';
import { CreateUserResponse } from './dtos/create-user.response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from '../shared/dto/result.generic';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new user' })
  async createUser(
    @Body() createUserRequest: CreateUserRequest,
  ): Promise<Result<CreateUserResponse>> {
    return this.userService.create(createUserRequest);
  }
}
