"use server";
// Thin server action wrappers around repositories
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { StoryRepository } from "@/server/repositories/StoryRepository";
import { GuyRepository } from "@/server/repositories/GuyRepository";
import { CommentRepository } from "@/server/repositories/CommentRepository";

const storyRepo = new StoryRepository();
const guyRepo = new GuyRepository();
const commentRepo = new CommentRepository();

export async function repoAddPost(input: {
  guyName?: string;
  guyPhone?: string;
  guySocials?: string;
  guyLocation?: string;
  guyAge?: number;
  storyText: string;
  tags: ("red_flag" | "good_vibes" | "unsure")[];
  imageUrl?: string | null;
  anonymous: boolean;
  nickname?: string | null;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");

  if (!input.storyText?.trim()) throw new Error("Story text is required");
  if (!input.tags || input.tags.length === 0) throw new Error("At least one tag is required");
  if (!input.guyName && !input.guyPhone && !input.guySocials) throw new Error("Provide a name, phone, or social");

  // Try to find guy by loose search and create if not exists
  let guyId: string | undefined;
  const searchTerm = input.guyName || input.guyPhone || input.guySocials || "";
  if (searchTerm) {
    const res = await guyRepo.searchGuys(searchTerm, 1);
    if (res.data.length > 0) guyId = (res.data[0] as any).id as string;
  }
  if (!guyId) {
    const newGuy = await guyRepo.create({
      name: input.guyName ?? null,
      phone: input.guyPhone ?? null,
      socials: input.guySocials ?? null,
      location: input.guyLocation ?? null,
      age: input.guyAge ?? null,
      createdByUserId: session.user.id,
    } as any);
    guyId = (newGuy as any).id as string;
  }

  // Map tags from mobile format to database format
  const tagMapping: Record<string, "positive" | "negative" | "neutral"> = {
    "good_vibes": "positive",
    "red_flag": "negative", 
    "unsure": "neutral"
  };
  
  // Use the first tag for now (database expects single tag, not array)
  const dbTag = tagMapping[input.tags[0]] || "neutral";

  const story = await storyRepo.create({
    guyId,
    createdByUserId: session.user.id,
    content: input.storyText.trim(),
    tagType: dbTag,
    imageUrl: input.imageUrl ?? null,
  });

  return { success: true, postId: (story as any).id as string, guyId };
}

export async function repoUpdateStory(storyId: string, data: {
  storyText: string;
  tags: ("red_flag" | "good_vibes" | "unsure")[];
  imageUrl?: string | null;
  anonymous: boolean;
  nickname?: string | null;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");
  const isOwner = await storyRepo.isOwner(storyId, session.user.id);
  if (!isOwner) throw new Error("You can only edit your own stories");
  
  // Map tags from mobile format to database format
  const tagMapping: Record<string, "positive" | "negative" | "neutral"> = {
    "good_vibes": "positive",
    "red_flag": "negative", 
    "unsure": "neutral"
  };
  
  const dbTag = tagMapping[data.tags[0]] || "neutral";
  
  await storyRepo.updateStory(storyId, {
    content: data.storyText,
    tagType: dbTag,
    imageUrl: data.imageUrl ?? null,
  });
  return { success: true };
}

export async function repoDeleteStory(storyId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");
  const isOwner = await storyRepo.isOwner(storyId, session.user.id);
  if (!isOwner) throw new Error("You can only delete your own stories");
  await storyRepo.deleteWithComments(storyId);
  return { success: true };
}

export async function repoListComments(storyId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Not authenticated");
    
    const comments = await commentRepo.getCommentsByStoryId(storyId);
    return { success: true, data: comments };
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return { success: false, data: [], error: 'Failed to fetch comments' };
  }
}

export async function repoAddComment(storyId: string, content: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Not authenticated");
    
    const comment = await commentRepo.addComment(storyId, session.user.id, content);
    if (!comment) throw new Error("Failed to add comment");
    
    return { success: true, data: comment };
  } catch (error) {
    console.error('Failed to add comment:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add comment' };
  }
}

export async function getUserReaction(storyId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Not authenticated");
    
    const reaction = await storyRepo.getUserReaction(storyId, session.user.id);
    return { success: true, data: reaction };
  } catch (error) {
    console.error('Failed to get user reaction:', error);
    return { success: false, data: null, error: error instanceof Error ? error.message : 'Failed to get user reaction' };
  }
}

export async function repoAddReaction(storyId: string, reactionType: 'red_flag' | 'good_vibes' | 'unsure') {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Not authenticated");
    
    const success = await storyRepo.addReaction(storyId, session.user.id, reactionType);
    if (!success) throw new Error("Failed to add reaction");
    
    return { success: true };
  } catch (error) {
    console.error('Failed to add reaction:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add reaction' };
  }
}

export async function repoRemoveReaction(storyId: string,reactionType: 'red_flag' | 'good_vibes' | 'unsure') {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Not authenticated");
    
    const success = await storyRepo.removeReaction(storyId, session.user.id);
    if (!success) throw new Error("Failed to remove reaction");
    
    return { success: true };
  } catch (error) {
    console.error('Failed to remove reaction:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove reaction' };
  }
}

export async function getStoryDetails(storyId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Not authenticated");
    
    const story = await storyRepo.getStoryWithDetails(storyId);
    if (!story) throw new Error("Story not found");
    
    return { success: true, data: story };
  } catch (error) {
    console.error('Failed to fetch story details:', error);
    return { success: false, data: null, error: 'Failed to fetch story details' };
  }
}

export async function repoSearchGuys(term: string, limit = 10) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");
  if (!term || !term.trim()) return { data: [], total: 0 };
  const res = await guyRepo.searchGuys(term.trim(), limit);
  return res;
}

export async function fetchStories(limit = 10, offset = 0) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");

  try {
    const stories = await storyRepo.fetchStoriesWithDetails(limit, offset);
    return { success: true, data: stories };
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    return { success: false, data: [], error: 'Failed to fetch stories' };
  }
}

export async function repoUpdateComment(commentId: string, content: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Not authenticated");
    
    const isOwner = await commentRepo.isOwner(commentId, session.user.id);
    if (!isOwner) throw new Error("You can only edit your own comments");
    
    const comment = await commentRepo.updateComment(commentId, content);
    if (!comment) throw new Error("Failed to update comment");
    
    return { success: true, data: comment };
  } catch (error) {
    console.error('Failed to update comment:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update comment' };
  }
}

export async function repoDeleteComment(commentId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Not authenticated");
    
    const isOwner = await commentRepo.isOwner(commentId, session.user.id);
    if (!isOwner) throw new Error("You can only delete your own comments");
    
    const success = await commentRepo.deleteComment(commentId);
    if (!success) throw new Error("Failed to delete comment");
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete comment' };
  }
}

export async function ensureProfileExists() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");
  const user = session.user as any;
  // Ensure nickname exists as a friendly default
  const nickname = user?.nickname || (user?.email ? String(user.email).split("@")[0] : null);
  // No explicit insert here since better-auth with drizzle should have created the row.
  // If needed in future we could upsert here via UserRepository.
  // Decide next path based on verification
  if (!user?.createdAt) {
    // If createdAt missing, treat as not fully provisioned but defer to verify gate next
  }
  if (!user?.verified) {
    return { success: true, nextPath: "/home/verify" };
  }
  return { success: true, nextPath: "/home" };
}

