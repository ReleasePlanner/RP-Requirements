/**
 * Exception types
 *
 * Types for exception handling
 */

/**
 * HTTP Exception Response structure
 */
export interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
  [key: string]: unknown;
}
