import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page (zero-based)' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  pageSize: number;

  @ApiProperty({ description: 'Total number of items' })
  totalItems: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Flag indicating if there is a next page' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Flag indicating if there is a previous page' })
  hasPreviousPage: boolean;

  constructor(
    page: number = 0,
    pageSize: number = 10,
    totalItems: number = 0,
    totalPages: number = 0,
    hasNextPage: boolean = false,
    hasPreviousPage: boolean = false,
  ) {
    this.page = page;
    this.pageSize = pageSize;
    this.totalItems = totalItems;
    this.totalPages = totalPages;
    this.hasNextPage = hasNextPage;
    this.hasPreviousPage = hasPreviousPage;
  }
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Array of items for the current page' })
  items: T[];

  @ApiProperty({ description: 'Pagination metadata', type: PaginationMetaDto })
  meta: PaginationMetaDto;

  constructor(items: T[], meta: PaginationMetaDto) {
    this.items = items;
    this.meta = meta;
  }

  static create<T>(
    items: T[],
    total: number,
    page: number,
    pageSize: number,
  ): PaginatedResponseDto<T> {
    const totalPages = Math.ceil(total / pageSize);

    const meta: PaginationMetaDto = {
      page,
      pageSize,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages - 1,
      hasPreviousPage: page > 0,
    };

    return new PaginatedResponseDto<T>(items, meta);
  }
}
