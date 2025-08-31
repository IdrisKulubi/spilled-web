"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { UserRepository } from "@/server/repositories/UserRepository";
import { StoryRepository } from "@/server/repositories/StoryRepository";
import { CommentRepository } from "@/server/repositories/CommentRepository";
import { db } from "@/server/db/connection";
import { users, stories, messages } from "@/server/db/schema";
import { sql, gte, eq } from "drizzle-orm";

const userRepo = new UserRepository();
const storyRepo = new StoryRepository();
const commentRepo = new CommentRepository();

function requireAdmin(user: any) {
  const adminList = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "").toLowerCase();
  const emails = adminList.split(",").map((e) => e.trim()).filter(Boolean);
  if (!user?.email || !emails.includes(String(user.email).toLowerCase())) {
    throw new Error("Admin access required");
  }
}

export async function adminListPending(limit = 100, offset = 0) {
  const  session  = await auth.api.getSession({ headers: await headers() });
  requireAdmin(session?.user);
  return await userRepo.findPendingVerificationUsers({ limit, offset });
}

export async function adminApproveUser(userId: string) {
  const  session = await auth.api.getSession({ headers: await headers() });
  requireAdmin(session?.user);
  const updated = await userRepo.updateVerificationStatus(userId, "approved");
  if (!updated) throw new Error("User not found");
  return {
    success: true,
    data: { user_id: updated.id, verification_status: updated.verificationStatus, verified_at: updated.verifiedAt },
  };
}

export async function adminRejectUser(userId: string, reason?: string) {
  const  session  = await auth.api.getSession({ headers: await headers() });
  requireAdmin(session?.user);
  const updated = await userRepo.updateVerificationStatus(userId, "rejected", reason);
  if (!updated) throw new Error("User not found");
  return {
    success: true,
    data: { user_id: updated.id, verification_status: updated.verificationStatus, rejection_reason: updated.rejectionReason },
  };
}

export async function adminFetchStats() {
  const  session  = await auth.api.getSession({ headers: await headers() });
  requireAdmin(session?.user);
  const userStats = await userRepo.getUserStats();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const newSignups = await db.select({ count: sql`count(*)` }).from(users).where(gte(users.createdAt, oneWeekAgo));
  const newStories = await db.select({ count: sql`count(*)` }).from(stories).where(gte(stories.createdAt, oneWeekAgo));
  const newMessages = await db.select({ count: sql`count(*)` }).from(messages).where(gte(messages.createdAt, oneWeekAgo));

  const avgVerification = await db
    .select({ avg_hours: sql`EXTRACT(EPOCH FROM AVG(${users.verifiedAt} - ${users.createdAt})) / 3600` })
    .from(users)
    .where(eq(users.verificationStatus, "approved"));

  return {
    success: true,
    data: {
      pending_verifications: userStats.pending,
      verified_users: userStats.verified,
      rejected_users: userStats.rejected,
      new_signups_week: Number(newSignups[0]?.count || 0),
      new_stories_week: Number(newStories[0]?.count || 0),
      new_messages_week: Number(newMessages[0]?.count || 0),
      avg_verification_hours: Number(avgVerification[0]?.avg_hours || 0),
    },
  };
}

export async function adminDeleteStory(storyId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  requireAdmin(session?.user);
  const ok = await storyRepo.deleteWithComments(storyId);
  return { success: ok };
}

export async function adminUpdateStoryText(storyId: string, newText: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  requireAdmin(session?.user);
  if (!newText || !newText.trim()) throw new Error("Text required");
  await storyRepo.updateStory(storyId, { text: newText.trim() } as any);
  return { success: true };
}

export async function adminDeleteComment(commentId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  requireAdmin(session?.user);
  const ok = await commentRepo.delete(commentId);
  return { success: ok };
}

