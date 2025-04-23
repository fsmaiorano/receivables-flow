import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignorRequest {
  @ApiProperty({
    description: 'The document of the assignor',
    example: '12345678900',
    type: String,
  })
  document: string;

  @ApiProperty({
    description: 'The email of the assignor',
    example: 'assignor@example.com',
    type: String,
  })
  email: string;
  @ApiProperty({
    description: 'The phone number of the assignor',
    example: '+5511999999999',
    type: String,
  })
  phone: string;
  @ApiProperty({
    description: 'The name of the assignor',
    example: 'John Doe',
    type: String,
  })
  name: string;
}
