import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequest {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
    type: String,
  })
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    type: String,
  })
  password: string;

  @ApiProperty({
    description: 'The confirm password of the user',
    example: 'password123',
    type: String,
  })
  confirmPassword: string;
}
