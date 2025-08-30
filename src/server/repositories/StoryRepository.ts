import { eq, ilike, sql, desc, and, or, inArray } from "drizzle-orm";
import { BaseRepository } from "./BaseRepository";
import { stories, guys, users, comments, type Story, type InsertStory, type Guy, type User } from "@/server/db/schema";
import { ErrorHandler, NotFoundError, ValidationError } from "./utils/ErrorHandler";
import { db } from "@/server/db/connection";

export class StoryRepository extends BaseRepository<Story, InsertStory> {
  protected table = stories;
  protected idColumn = stories.id;

  async create(storyData: InsertStory): Promise<Story> {
    ErrorHandler.validateRequired(storyData as any, ["text", "guyId", "userId"]);

    // Validate guy/user exist
    const guy = await db.select({ id: guys.id }).from(guys).where(eq(guys.id, storyData.guyId as string)).limit(1);
    if (!guy.length) throw new ValidationError("Guy does not exist", "guyId");
    const user = await db.select({ id: users.id }).from(users).where(eq(users.id, storyData.userId as string)).limit(1);
    if (!user.length) throw new ValidationError("User does not exist", "userId");

    if ((storyData.text || "").length > 1000) throw new ValidationError("Story text cannot exceed 1000 characters", "text");

    return await super.create(storyData);
  }

  async updateStory(id: string, updates: Partial<InsertStory>): Promise<Story | null> {
    ErrorHandler.validateUUID(id);
    if (updates.text && updates.text.length > 1000) throw new ValidationError("Story text cannot exceed 1000 characters", "text");
    const result = await this.update(id, updates);
    if (!result) throw new NotFoundError("Story", id);
    return result;
  }

  async deleteWithComments(id: string): Promise<boolean> {
    ErrorHandler.validateUUID(id);
    return await db.transaction(async (tx) => {
      await tx.delete(comments).where(eq(comments.storyId, id));
      const result = await tx.delete(stories).where(eq(stories.id, id)).returning();
      return result.length > 0;
    });
  }

  async isOwner(storyId: string, userId: string): Promise<boolean> {
    ErrorHandler.validateUUID(storyId);
    ErrorHandler.validateUUID(userId);
    const res = await db.select({ id: stories.id }).from(stories).where(and(eq(stories.id, storyId), eq(stories.userId, userId))).limit(1);
    return res.length > 0;
  }
}

