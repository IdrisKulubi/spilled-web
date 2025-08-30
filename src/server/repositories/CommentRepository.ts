import { eq } from "drizzle-orm";
import { BaseRepository } from "./BaseRepository";
import { comments, type Comment, type InsertComment } from "@/server/db/schema";
import { ErrorHandler, NotFoundError, ValidationError } from "./utils/ErrorHandler";
import { db } from "@/server/db/connection";

export class CommentRepository extends BaseRepository<Comment, InsertComment> {
  protected table = comments;
  protected idColumn = comments.id;

  async isOwner(commentId: string, userId: string): Promise<boolean> {
    ErrorHandler.validateUUID(commentId);
    ErrorHandler.validateUUID(userId);
    const res = await db
      .select({ id: comments.id })
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);
    return res.length > 0;
  }

  async deleteByStoryId(storyId: string): Promise<number> {
    ErrorHandler.validateUUID(storyId);
    const res = await db.delete(comments).where(eq(comments.storyId, storyId)).returning();
    return res.length;
  }
}

