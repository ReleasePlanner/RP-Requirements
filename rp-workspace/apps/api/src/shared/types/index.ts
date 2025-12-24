/**
 * Common TypeScript types and interfaces
 * 
 * Shared types used across multiple modules
 */

/**
 * Pagination options for queries
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

/**
 * Sort order options
 */
export type SortOrder = 'ASC' | 'DESC';

/**
 * Query options with pagination and sorting
 */
export interface QueryOptions extends PaginationOptions {
  sortBy?: string;
  sortOrder?: SortOrder;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
}

/**
 * JWT Payload structure
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

/**
 * User information from request
 */
export interface RequestUser {
  userId: string;
  name: string;
  email: string;
  role: string;
}

// Export repository types
export * from './repository.types';

// Export exception types
export * from './exception.types';

// Export widget types
export * from './widget.types';

