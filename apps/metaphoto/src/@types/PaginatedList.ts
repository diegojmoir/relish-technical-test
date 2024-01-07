export interface PaginatedList<T> {
    data: T[];
    totalItems: number;
    currentPage: number;
}
