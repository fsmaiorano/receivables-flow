import { Decimal } from 'generated/prisma/runtime/library';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePayableResponse {
  @ApiProperty({
    description: 'The unique identifier of the payable',
    example: '5f9d4d8b-5f9d-4d8b-5f9d-4d8b5f9d4d8b',
  })
  id: string;

  @ApiProperty({
    description: 'The value of the payable',
    example: 100.5,
  })
  value: Decimal;

  @ApiProperty({
    description: 'The emission date of the payable',
    example: '2025-04-23T10:00:00.000Z',
  })
  emissionDate: Date;

  @ApiProperty({
    description: 'The ID of the assignor',
    example: '5f9d4d8b-5f9d-4d8b-5f9d-4d8b5f9d4d8b',
  })
  assignorId: string;

  @ApiProperty({
    description: 'When the payable was created',
    example: '2025-04-23T15:30:45.123Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the payable was last updated',
    example: '2025-04-23T15:30:45.123Z',
    nullable: true,
  })
  updatedAt: Date | null;
}
