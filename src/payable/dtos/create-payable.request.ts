import { ApiProperty } from '@nestjs/swagger';

export class CreatePayableRequest {
  @ApiProperty({
    description: 'The value of the payable',
    example: 100.5,
    type: Number,
  })
  value: number;

  @ApiProperty({
    description: 'The emission date of the payable',
    example: '2025-04-23T10:00:00.000Z',
    type: Date,
  })
  emissionDate: Date;

  @ApiProperty({
    description: 'The ID of the assignor',
    example: '5f9d4d8b-5f9d-4d8b-5f9d-4d8b5f9d4d8b',
    type: String,
  })
  assignorId: string;
}
