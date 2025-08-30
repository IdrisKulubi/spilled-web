import { eq, desc, or, ilike, sql } from "drizzle-orm";
import { BaseRepository } from "./BaseRepository";
import { guys, type Guy, type InsertGuy, stories } from "@/server/db/schema";
import { ErrorHandler, NotFoundError, ValidationError } from "./utils/ErrorHandler";
import { db } from "@/server/db/connection";

export class GuyRepository extends BaseRepository<Guy, InsertGuy> {
  protected table = guys;
  protected idColumn = guys.id;

  async create(guyData: InsertGuy): Promise<Guy> {
    ErrorHandler.validateRequired(guyData as any, ["createdByUserId"]);
    if (guyData.age != null && (guyData.age < 0 || guyData.age > 150)) {
      throw new ValidationError("Age must be between 0 and 150", "age");
    }
    return await super.create(guyData);
  }

  async updateProfile(id: string, updates: Partial<InsertGuy>): Promise<Guy | null> {
    ErrorHandler.validateUUID(id);
    if (updates.age != null && (updates.age < 0 || updates.age > 150)) {
      throw new ValidationError("Age must be between 0 and 150", "age");
    }
    const res = await this.update(id, updates);
    if (!res) throw new NotFoundError("Guy", id);
    return res;
  }

  async searchGuys(term: string, limit = 10) {
    const cond = or(
      ilike(guys.name, `%${term}%`),
      ilike(guys.phone, `%${term}%`),
      ilike(guys.socials, `%${term}%`),
      ilike(guys.location, `%${term}%`)
    );

    const totalResult = await db.select({ count: sql`count(*)` }).from(guys).where(cond);
    const result = await db
      .select()
      .from(guys)
      .where(cond)
      .orderBy(desc(guys.createdAt))
      .limit(limit);

    return { data: result as Guy[], total: Number(totalResult[0]?.count || 0) };
  }
}

