import { eq, desc } from "drizzle-orm";
import { BaseRepository } from "./BaseRepository";
import { comments, users, type Comment, type InsertComment } from "@/server/db/schema";
import { ErrorHandler, NotFoundError, ValidationError } from "./utils/ErrorHandler";
import { db } from "@/server/db/connection";

export class CommentRepository extends BaseRepository<Comment, InsertComment> {
  protected table = comments;
  protected idColumn = comments.id;

  async isOwner(commentId: string, userId: string): Promise<boolean> {
    ErrorHandler.validateUUID(commentId);
    if (!userId || userId.trim().length === 0) {
      throw new ValidationError("User ID is required", "userId");
    }
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
  
  async getCommentsByStoryId(storyId: string, limit = 50, offset = 0): Promise<any[]> {
    try {
      ErrorHandler.validateUUID(storyId);
      
      const result = await db
        .select({
          id: comments.id,
          content: comments.content,
          createdAt: comments.createdAt,
          authorName: users.name,
          authorNickname: users.nickname,
          authorImage: users.image,
        })
        .from(comments)
        .leftJoin(users, eq(comments.createdByUserId, users.id))
        .where(eq(comments.storyId, storyId))
        .orderBy(desc(comments.createdAt))
        .limit(limit)
        .offset(offset);
      
      return result;
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      return [];
    }
  }
  
  async addComment(storyId: string, userId: string, content: string): Promise<Comment | null> {
    try {
      ErrorHandler.validateUUID(storyId);
      if (!userId || userId.trim().length === 0) {
        throw new ValidationError("User ID is required", "userId");
      }
      
      if (!content || content.trim().length === 0) {
        throw new ValidationError("Comment content cannot be empty", "content");
      }
      
      if (content.length > 500) {
        throw new ValidationError("Comment cannot exceed 500 characters", "content");
      }
      
      const result = await db.insert(comments).values({
        storyId,
        createdByUserId: userId,
        content: content.trim(),
      }).returning();
      
      return result[0] || null;
    } catch (error) {
      console.error('Failed to add comment:', error);
      return null;
    }
  }
}

