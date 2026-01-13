export class PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;

  constructor(partial: Partial<PaginatedResponse<T>>) {
    Object.assign(this, partial);
  }
}
