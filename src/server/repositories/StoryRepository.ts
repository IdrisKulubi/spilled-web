import { eq, ilike, sql, desc, and, or, inArray, count } from "drizzle-orm";
import { BaseRepository } from "./BaseRepository";
import { stories, guys, users, comments, storyReactions } from "@/server/db/schema";
import { ErrorHandler, NotFoundError, ValidationError } from "./utils/ErrorHandler";
import { db } from "@/server/db/connection";

// Types that match the current database schema
type Story = {
  id: string;
  content: string | null;
  imageUrl: string | null;
  tagType: "positive" | "negative" | "neutral" | null;
  guyId: string | null;
  createdByUserId: string | null;
  createdAt: string;
};

type InsertStory = {
  content: string;
  imageUrl?: string | null;
  tagType: "positive" | "negative" | "neutral";
  guyId: string;
  createdByUserId: string;
};

export class StoryRepository extends BaseRepository<Story, InsertStory> {
  protected table = stories;
  protected idColumn = stories.id;

  async create(storyData: InsertStory): Promise<Story> {
    ErrorHandler.validateRequired(storyData as any, ["content", "guyId", "createdByUserId"]);

    // Validate guy/user exist
    const guy = await db.select({ id: guys.id }).from(guys).where(eq(guys.id, storyData.guyId as string)).limit(1);
    if (!guy.length) throw new ValidationError("Guy does not exist", "guyId");
    const user = await db.select({ id: users.id }).from(users).where(eq(users.id, storyData.createdByUserId as string)).limit(1);
    if (!user.length) throw new ValidationError("User does not exist", "createdByUserId");

    if ((storyData.content || "").length > 1000) throw new ValidationError("Story text cannot exceed 1000 characters", "content");

    return await super.create(storyData);
  }

  async updateStory(id: string, updates: Partial<InsertStory>): Promise<Story | null> {
    ErrorHandler.validateUUID(id);
    if (updates.content && updates.content.length > 1000) throw new ValidationError("Story text cannot exceed 1000 characters", "content");
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
    if (!userId || userId.trim().length === 0) {
      throw new ValidationError("User ID is required", "userId");
    }
    const res = await db.select({ id: stories.id }).from(stories).where(and(eq(stories.id, storyId), eq(stories.createdByUserId, userId))).limit(1);
    return res.length > 0;
  }

  async fetchStoriesWithDetails(limit = 10, offset = 0): Promise<any[]> {
    try {
      // First get the stories with guy details
      const storiesData = await db
        .select({
          id: stories.id,
          content: stories.content,
          imageUrl: stories.imageUrl,
          tagType: stories.tagType,
          createdAt: stories.createdAt,
          guyName: guys.name,
          guyPhone: guys.phone,
          guyAge: guys.age,
          guyLocation: guys.location,
          // guyImageUrl: guys.imageUrl, // TODO: Add after column exists
        })
        .from(stories)
        .leftJoin(guys, eq(stories.guyId, guys.id))
        .orderBy(desc(stories.createdAt))
        .limit(limit)
        .offset(offset);
      
      // Get reaction counts for each story
      const storyIds = storiesData.map(story => story.id);
      if (storyIds.length === 0) return [];
      
      const reactionCounts = await db
        .select({
          storyId: storyReactions.storyId,
          reactionType: storyReactions.reactionType,
          count: count(storyReactions.id),
        })
        .from(storyReactions)
        .where(inArray(storyReactions.storyId, storyIds))
        .groupBy(storyReactions.storyId, storyReactions.reactionType);
      
      // Get comment counts
      const commentCounts = await db
        .select({
          storyId: comments.storyId,
          count: count(comments.id),
        })
        .from(comments)
        .where(inArray(comments.storyId, storyIds))
        .groupBy(comments.storyId);
      
      // Combine the data
      return storiesData.map(story => {
        const storyReactions = reactionCounts.filter(r => r.storyId === story.id);
        const reactions = {
          red_flag: storyReactions.find(r => r.reactionType === 'red_flag')?.count || 0,
          good_vibes: storyReactions.find(r => r.reactionType === 'good_vibes')?.count || 0,
          unsure: storyReactions.find(r => r.reactionType === 'unsure')?.count || 0,
        };
        
        const commentCount = commentCounts.find(c => c.storyId === story.id)?.count || 0;
        
        return {
          ...story,
          reactions,
          commentCount: Number(commentCount),
        };
      });
    } catch (error) {
      console.error('Failed to fetch stories with details:', error);
      return [];
    }
  }
  
  async getStoryWithDetails(id: string): Promise<any | null> {
    try {
      const storyData = await db
        .select({
          id: stories.id,
          content: stories.content,
          imageUrl: stories.imageUrl,
          tagType: stories.tagType,
          createdAt: stories.createdAt,
          guyName: guys.name,
          guyPhone: guys.phone,
          guyAge: guys.age,
          guyLocation: guys.location,
          // guyImageUrl: guys.imageUrl, // TODO: Add after column exists
        })
        .from(stories)
        .leftJoin(guys, eq(stories.guyId, guys.id))
        .where(eq(stories.id, id))
        .limit(1);
      
      if (!storyData.length) return null;
      
      const story = storyData[0];
      
      // Get reaction counts
      const reactionCounts = await db
        .select({
          reactionType: storyReactions.reactionType,
          count: count(storyReactions.id),
        })
        .from(storyReactions)
        .where(eq(storyReactions.storyId, id))
        .groupBy(storyReactions.reactionType);
      
      // Get comment count
      const commentCountResult = await db
        .select({ count: count(comments.id) })
        .from(comments)
        .where(eq(comments.storyId, id));
      
      const reactions = {
        red_flag: reactionCounts.find(r => r.reactionType === 'red_flag')?.count || 0,
        good_vibes: reactionCounts.find(r => r.reactionType === 'good_vibes')?.count || 0,
        unsure: reactionCounts.find(r => r.reactionType === 'unsure')?.count || 0,
      };
      
      return {
        ...story,
        reactions,
        commentCount: Number(commentCountResult[0]?.count || 0),
      };
    } catch (error) {
      console.error('Failed to fetch story with details:', error);
      return null;
    }
  }
  
  async getUserReaction(storyId: string, userId: string): Promise<'red_flag' | 'good_vibes' | 'unsure' | null> {
    try {
      ErrorHandler.validateUUID(storyId);
      if (!userId || userId.trim().length === 0) {
        return null;
      }
      
      const result = await db
        .select({ reactionType: storyReactions.reactionType })
        .from(storyReactions)
        .where(and(eq(storyReactions.storyId, storyId), eq(storyReactions.userId, userId)))
        .limit(1);
      
      return result.length > 0 ? result[0].reactionType : null;
    } catch (error) {
      console.error('Failed to get user reaction:', error);
      return null;
    }
  }
  
  async addReaction(storyId: string, userId: string, reactionType: 'red_flag' | 'good_vibes' | 'unsure'): Promise<boolean> {
    try {
      ErrorHandler.validateUUID(storyId);
      // Skip UUID validation for userId as better-auth might use different format
      if (!userId || userId.trim().length === 0) {
        throw new ValidationError("User ID is required", "userId");
      }
      
      // Check if user already reacted to this story
      const existingReaction = await db
        .select()
        .from(storyReactions)
        .where(and(eq(storyReactions.storyId, storyId), eq(storyReactions.userId, userId)))
        .limit(1);
      
      if (existingReaction.length > 0) {
        // Update existing reaction
        await db
          .update(storyReactions)
          .set({ reactionType })
          .where(and(eq(storyReactions.storyId, storyId), eq(storyReactions.userId, userId)));
      } else {
        // Add new reaction
        await db.insert(storyReactions).values({
          storyId,
          userId,
          reactionType,
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to add reaction:', error);
      return false;
    }
  }
  
  async removeReaction(storyId: string, userId: string): Promise<boolean> {
    try {
      ErrorHandler.validateUUID(storyId);
      if (!userId || userId.trim().length === 0) {
        throw new ValidationError("User ID is required", "userId");
      }
      
      const result = await db
        .delete(storyReactions)
        .where(and(eq(storyReactions.storyId, storyId), eq(storyReactions.userId, userId)))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error('Failed to remove reaction:', error);
      return false;
    }
  }
}

