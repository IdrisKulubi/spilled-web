import { eq, desc, or, and, sql } from "drizzle-orm";
import { BaseRepository } from "./BaseRepository";
import { messages, users, type Message, type InsertMessage, type User } from "@/server/db/schema";
import { ErrorHandler, NotFoundError, ValidationError } from "./utils/ErrorHandler";
import { db } from "@/server/db/connection";

export class MessageRepository extends BaseRepository<Message, InsertMessage> {
  protected table = messages;
  protected idColumn = messages.id;

  async create(messageData: InsertMessage): Promise<Message> {
    ErrorHandler.validateRequired(messageData as any, ["senderId", "receiverId", "content"]);
    
    if (!messageData.content?.trim()) {
      throw new ValidationError("Message content cannot be empty", "content");
    }

    if (messageData.senderId === messageData.receiverId) {
      throw new ValidationError("Cannot send message to yourself", "receiverId");
    }

    return await super.create(messageData);
  }

  async getConversation(userId1: string, userId2: string, limit = 50, offset = 0) {
    ErrorHandler.validateUserId(userId1, "userId1");
    ErrorHandler.validateUserId(userId2, "userId2");

    const conversation = await db
      .select({
        id: messages.id,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        content: messages.content,
        createdAt: messages.createdAt,
        expiresAt: messages.expiresAt,
        senderName: users.name,
        senderNickname: users.nickname,
        senderImage: users.image,
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);

    return conversation.reverse(); // Return in chronological order (oldest first)
  }

  async getUserConversations(userId: string, limit = 20) {
    ErrorHandler.validateUserId(userId);

    // Get latest message for each conversation
    const conversations = await db
      .select({
        userId: sql`CASE 
          WHEN ${messages.senderId} = ${userId} THEN ${messages.receiverId}
          ELSE ${messages.senderId}
        END`.as('userId'),
        userName: users.name,
        userNickname: users.nickname,
        userImage: users.image,
        lastMessage: messages.content,
        lastMessageTime: messages.createdAt,
        isFromCurrentUser: sql`${messages.senderId} = ${userId}`.as('isFromCurrentUser'),
      })
      .from(messages)
      .leftJoin(users, sql`${users.id} = CASE 
        WHEN ${messages.senderId} = ${userId} THEN ${messages.receiverId}
        ELSE ${messages.senderId}
      END`)
      .where(
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit * 2); // Get more to filter duplicates

    // Remove duplicate conversations (keep only latest)
    const uniqueConversations = new Map();
    conversations.forEach(conv => {
      const key = conv.userId;
      if (!uniqueConversations.has(key) || 
          new Date(conv.lastMessageTime!) > new Date(uniqueConversations.get(key).lastMessageTime)) {
        uniqueConversations.set(key, conv);
      }
    });

    return Array.from(uniqueConversations.values())
      .sort((a, b) => new Date(b.lastMessageTime!).getTime() - new Date(a.lastMessageTime!).getTime())
      .slice(0, limit);
  }

  async markMessagesAsExpired(conversationId: string, userId: string) {
    ErrorHandler.validateUserId(conversationId, "conversationId");
    ErrorHandler.validateUserId(userId);

    // Mark messages as expired (soft delete)
    await db
      .update(messages)
      .set({ expiresAt: new Date() })
      .where(
        and(
          or(
            eq(messages.senderId, userId),
            eq(messages.receiverId, userId)
          ),
          eq(messages.receiverId, conversationId) // Assuming conversationId is the other user's ID
        )
      );
  }

  async getUnreadCount(userId: string): Promise<number> {
    ErrorHandler.validateUserId(userId);

    // This is simplified - in a real app you'd have a separate read_status table
    // For now, we'll return 0 as a placeholder
    return 0;
  }

  async getUserProfile(userId: string) {
    ErrorHandler.validateUserId(userId);

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        nickname: users.nickname,
        image: users.image,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user[0] || null;
  }
}
