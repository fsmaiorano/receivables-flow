import { ApiProperty } from '@nestjs/swagger';
import { CreatePayableRequest } from './create-payable.request';

export class CreatePayableBatchRequest {
  @ApiProperty({
    description: 'List of payables to be created',
    type: [CreatePayableRequest],
    isArray: true,
  })
  payables: CreatePayableRequest[];
}
