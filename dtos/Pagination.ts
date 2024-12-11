export interface Pagination<T> {
  items: T[]; // Array of data items (e.g., Cage)
  totalItems: number; // Total number of items
  totalPages: number; // Total pages
  currentPage: number; // Current page number
  pageSize: number; // Number of items per page
  hasNextPage: boolean; // Indicates if there's a next page
  hasPreviousPage: boolean; // Indicates if there's a previous page
}
