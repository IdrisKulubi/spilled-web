import { SQL, and, or, ilike, inArray, asc, desc, gte, lte, eq } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

export class QueryBuilder {
  static textSearch(column: PgColumn, searchTerm: string): SQL { return ilike(column, `%${searchTerm}%`); }
  static exactMatch(column: PgColumn, value: any): SQL { return eq(column, value); }
  static range(column: PgColumn, min?: any, max?: any): SQL | undefined {
    const conditions: SQL[] = [];
    if (min !== undefined) conditions.push(gte(column, min));
    if (max !== undefined) conditions.push(lte(column, max));
    if (!conditions.length) return undefined; if (conditions.length === 1) return conditions[0];
    return and(...conditions);
  }
  static pagination(page = 1, limit = 10) { const offset = (page - 1) * limit; return { limit: Math.min(Math.max(limit, 1), 100), offset: Math.max(offset, 0) }; }
  static orderBy(column: PgColumn, direction: 'asc' | 'desc' = 'asc') { return direction === 'desc' ? desc(column) : asc(column); }
}

export interface PaginatedResult<T> { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean; }; }
export function createPaginatedResult<T>(data: T[], total: number, page: number, limit: number): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);
  return { data, pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } };
}

