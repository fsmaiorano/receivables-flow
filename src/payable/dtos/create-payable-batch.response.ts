import { ApiProperty } from '@nestjs/swagger';

export class CreatePayableBatchResponse {
  @ApiProperty({ description: 'Payable ID', required: false })
  id?: string;

  @ApiProperty({ description: 'Payable value' })
  value?: number;

  @ApiProperty({ description: 'Emission date', required: false })
  emissionDate?: Date;

  @ApiProperty({ description: 'Assignor ID' })
  assignorId?: string;

  @ApiProperty({ description: 'Created At date', required: false })
  createdAt?: Date;

  @ApiProperty({ description: 'Updated At date', required: false })
  updatedAt?: Date;

  @ApiProperty({ description: 'Processing status', enum: ['created', 'error'] })
  status: 'created' | 'error';

  @ApiProperty({
    description: 'Error message if status is error',
    required: false,
  })
  error?: string;
}
