import { BaseRepository } from "./BaseRepository";
import { users, type User, type InsertUser } from "@/server/db/schema";
import { db } from "@/server/db/connection";
import { and, eq, inArray, sql } from "drizzle-orm";

export class UserRepository extends BaseRepository<User, InsertUser> {
  protected table = users;
  protected idColumn = users.id;

  async findPendingVerificationUsers({ limit = 100, offset = 0 }: { limit?: number; offset?: number }) {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.verificationStatus, "pending"))
      .limit(limit)
      .offset(offset);
    const totalRes = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.verificationStatus, "pending"));
    return { data: rows as User[], total: Number(totalRes[0]?.count || 0), page: Math.floor(offset / limit) + 1, limit };
  }

  async updateVerificationStatus(userId: string, status: "approved" | "rejected" | "pending", rejectionReason?: string) {
    const patch: Partial<InsertUser> = {
      verificationStatus: status as any,
      verified: status === "approved",
      verifiedAt: status === "approved" ? new Date() : null as any,
      rejectionReason: status === "rejected" ? (rejectionReason || "ID verification failed") : null as any,
    };
    const res = await this.update(userId, patch as any);
    return res as User | null;
  }

  async bulkUpdateVerificationStatus(userIds: string[], status: "approved" | "rejected") {
    if (!userIds.length) return [] as User[];
    const patch: Partial<InsertUser> = {
      verificationStatus: status as any,
      verified: status === "approved",
      verifiedAt: status === "approved" ? new Date() : null as any,
      rejectionReason: status === "rejected" ? "ID verification failed" : null as any,
    };
    const res = await db
      .update(users)
      .set(patch as any)
      .where(inArray(users.id, userIds))
      .returning();
    return res as User[];
  }

  async getUserStats() {
    const totalRes = await db.select({ count: sql`count(*)` }).from(users);
    const verifiedRes = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.verificationStatus, "approved"));
    const pendingRes = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.verificationStatus, "pending"));
    const rejectedRes = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.verificationStatus, "rejected"));
    return {
      total: Number(totalRes[0]?.count || 0),
      verified: Number(verifiedRes[0]?.count || 0),
      pending: Number(pendingRes[0]?.count || 0),
      rejected: Number(rejectedRes[0]?.count || 0),
    };
  }
}

