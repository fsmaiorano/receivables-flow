import { ApiProperty } from '@nestjs/swagger';

export class GetAssignorResponse {
  @ApiProperty({
    description: 'The unique identifier of the assignor',
    example: '5f9d4d8b-5f9d-4d8b-5f9d-4d8b5f9d4d8b',
  })
  id: string;

  @ApiProperty({
    description: 'The document of the assignor',
    example: '12345678900',
  })
  document: string;

  @ApiProperty({
    description: 'The email of the assignor',
    example: 'assignor@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The phone number of the assignor',
    example: '+5511999999999',
  })
  phone: string;

  @ApiProperty({
    description: 'The name of the assignor',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'When the assignor was created',
    example: '2025-04-23T15:30:45.123Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the assignor was last updated',
    example: '2025-04-23T15:30:45.123Z',
  })
  updatedAt: Date;
}
