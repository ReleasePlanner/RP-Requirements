/**
 * Repository types and interfaces
 * 
 * Common types used by repositories across the application
 */

import { SortOrder } from './index';

/**
 * Options for finding all entities with pagination and filtering
 */
export interface FindAllOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

/**
 * Options for finding entities by epic IDs
 */
export interface FindByEpicOptions extends FindAllOptions {
  epicIds?: string[];
}

/**
 * Options for finding entities by initiative ID
 */
export interface FindByInitiativeOptions {
  initiativeId?: string;
}

/**
 * Where clause for database queries
 */
export interface WhereClause {
  [key: string]: unknown;
}

