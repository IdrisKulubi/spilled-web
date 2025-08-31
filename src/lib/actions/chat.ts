"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { MessageRepository } from "@/server/repositories/MessageRepository";
import { revalidatePath } from "next/cache";

const messageRepo = new MessageRepository();

export async function sendMessage(receiverId: string, content: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    if (!content?.trim()) {
      return { success: false, error: "Message cannot be empty" };
    }

    if (!receiverId?.trim()) {
      return { success: false, error: "Receiver ID is required" };
    }

    if (receiverId === session.user.id) {
      return { success: false, error: "Cannot send message to yourself" };
    }

    const message = await messageRepo.create({
      senderId: session.user.id,
      receiverId: receiverId.trim(),
      content: content.trim(),
    });

    // Revalidate chat pages
    revalidatePath('/home/chat');
    
    return { success: true, data: message };
  } catch (error) {
    console.error('Failed to send message:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send message' 
    };
  }
}

export async function getConversation(otherUserId: string, limit = 50, offset = 0) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated", data: [] };
    }

    if (!otherUserId?.trim()) {
      return { success: false, error: "User ID is required", data: [] };
    }

    const conversation = await messageRepo.getConversation(
      session.user.id, 
      otherUserId.trim(), 
      limit, 
      offset
    );
    
    return { success: true, data: conversation };
  } catch (error) {
    console.error('Failed to get conversation:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get conversation',
      data: []
    };
  }
}

export async function getUserConversations(limit = 20) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated", data: [] };
    }

    const conversations = await messageRepo.getUserConversations(session.user.id, limit);
    
    return { success: true, data: conversations };
  } catch (error) {
    console.error('Failed to get conversations:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get conversations',
      data: []
    };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated", data: null };
    }

    if (!userId?.trim()) {
      return { success: false, error: "User ID is required", data: null };
    }

    const userProfile = await messageRepo.getUserProfile(userId.trim());
    
    if (!userProfile) {
      return { success: false, error: "User not found", data: null };
    }
    
    return { success: true, data: userProfile };
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get user profile',
      data: null
    };
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated", data: null };
    }

    return { success: true, data: session.user };
  } catch (error) {
    console.error('Failed to get current user:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get current user',
      data: null
    };
  }
}
