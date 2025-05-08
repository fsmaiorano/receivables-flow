export class PaginationMetaDto {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
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
  items: T[];
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
