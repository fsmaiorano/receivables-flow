import { ApiProperty } from '@nestjs/swagger';

export class CreatePayableBatchResponse {
  @ApiProperty({
    description: 'The correlationID of the batch',
    example: '5f9d4d8b-5f9d-4d8b-5f9d-4d8b5f9d4d8b',
    type: String,
  })
  correlationId: string;
  // @ApiProperty({
  //   description: 'The number of payables processed',
  //   example: 10,
  //   type: Number,
  // })
  // processedCount: number;
  // @ApiProperty({
  //   description: 'The number of payables that failed',
  //   example: 2,
  //   type: Number,
  // })
  // failedCount: number;
  // @ApiProperty({
  //   description: 'The number of payables that succeeded',
  //   example: 8,
  //   type: Number,
  // })
  // succeededCount: number;
  // @ApiProperty({
  //   description: 'Indicates if the batch processing was successful',
  //   example: true,
  //   type: Boolean,
  // })
  // isSuccess: boolean;

  // @ApiProperty({ description: 'Payable ID', required: false })
  // id?: string;
  // @ApiProperty({ description: 'Payable value' })
  // value?: number;
  // @ApiProperty({ description: 'Emission date', required: false })
  // emissionDate?: Date;
  // @ApiProperty({ description: 'Assignor ID' })
  // assignorId?: string;
  // @ApiProperty({ description: 'Created At date', required: false })
  // createdAt?: Date;
  // @ApiProperty({ description: 'Updated At date', required: false })
  // updatedAt?: Date;
  // @ApiProperty({ description: 'Processing status', enum: ['created', 'error'] })
  // status: 'created' | 'error';
  // @ApiProperty({
  //   description: 'Error message if status is error',
  //   required: false,
  // })
  // error?: string;
}
