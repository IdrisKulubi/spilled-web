import { PgTable } from "drizzle-orm/pg-core";
import { eq, SQL, sql } from "drizzle-orm";
import { db } from "@/server/db/connection";

export interface IBaseRepository<TSelect extends Record<string, any>, TInsert extends Record<string, any>> {
  findById(id: string): Promise<TSelect | null>;
  create(data: TInsert): Promise<TSelect>;
  update(id: string, data: Partial<TInsert>): Promise<TSelect | null>;
  delete(id: string): Promise<boolean>;
  findMany(where?: SQL): Promise<TSelect[]>;
  count(where?: SQL): Promise<number>;
}

export abstract class BaseRepository<TSelect extends Record<string, any>, TInsert extends Record<string, any>> implements IBaseRepository<TSelect, TInsert> {
  protected abstract table: PgTable;
  protected abstract idColumn: any;

  async findById(id: string): Promise<TSelect | null> {
    const result = await db.select().from(this.table).where(eq(this.idColumn, id)).limit(1);
    return (result[0] as TSelect) || null;
  }

  async create(data: TInsert): Promise<TSelect> {
    const result = await db.insert(this.table).values(data as any).returning();
    return result[0] as TSelect;
  }

  async update(id: string, data: Partial<TInsert>): Promise<TSelect | null> {
    const result = await db.update(this.table).set(data as any).where(eq(this.idColumn, id)).returning();
    return (result[0] as TSelect) || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(this.table).where(eq(this.idColumn, id)).returning();
    return result.length > 0;
  }

  async findMany(where?: SQL): Promise<TSelect[]> {
    const query = db.select().from(this.table);
    // drizzle doesn't mutate; we recreate when where is present
    if (where) {
      const rows = await db.select().from(this.table).where(where);
      return rows as TSelect[];
    }
    const rows = await query;
    return rows as TSelect[];
  }

  async count(where?: SQL): Promise<number> {
    const query = db.select({ count: sql`count(*)` }).from(this.table);
    if (where) {
      const res = await db.select({ count: sql`count(*)` }).from(this.table).where(where);
      return Number(res[0]?.count || 0);
    }
    const res = await query;
    return Number(res[0]?.count || 0);
  }
}

