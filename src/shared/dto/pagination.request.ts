import { ApiProperty } from '@nestjs/swagger';

export class PaginationRequestDto {
  @ApiProperty({
    description: 'Page number (zero-based)',
    example: 0,
    default: 0,
    required: false,
  })
  page: number = 0;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    required: false,
  })
  pageSize: number = 10;
}
