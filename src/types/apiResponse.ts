export interface ApiResponse<T> {
  data: T[];
  meta: Meta;
}

export interface Meta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
