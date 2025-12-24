/**
 * Utility functions and helpers
 * 
 * Shared utility functions used across the application
 */

/**
 * Sanitizes an object by removing sensitive fields
 * 
 * @param obj - Object to sanitize
 * @param sensitiveFields - Array of field names to redact
 * @returns Sanitized object with sensitive fields redacted
 * 
 * @example
 * ```typescript
 * const sanitized = sanitizeObject({ password: 'secret', name: 'John' }, ['password']);
 * // Returns: { password: '***REDACTED***', name: 'John' }
 * ```
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  sensitiveFields: string[] = ['password', 'token', 'secret', 'authorization'],
): T {
  if (!obj) return obj;

  const sanitized = { ...obj };
  sensitiveFields.forEach((field) => {
    if (field in sanitized && sanitized[field]) {
      (sanitized as Record<string, unknown>)[field] = '***REDACTED***';
    }
  });

  return sanitized;
}

/**
 * Converts a string duration to seconds
 * 
 * @param duration - Duration string (e.g., '1d', '2h', '30m', '60s')
 * @returns Duration in seconds
 * 
 * @example
 * ```typescript
 * parseDurationToSeconds('1d') // Returns: 86400
 * parseDurationToSeconds('2h') // Returns: 7200
 * ```
 */
export function parseDurationToSeconds(duration: string): number {
  const unit = duration.slice(-1);
  const value = parseInt(duration.slice(0, -1), 10);

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    default:
      return 86400; // Default 1 day
  }
}

/**
 * Checks if a value is a valid UUID
 * 
 * @param value - Value to check
 * @returns True if value is a valid UUID
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

