export interface PaginationWrapperModel<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}
