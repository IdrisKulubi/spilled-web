"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/server/db/connection";
import { guys, stories, comments, storyReactions } from "@/server/db/schema";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";

export type TagType = "red_flag" | "good_vibes" | "unsure";
export type ReactionType = TagType;

export interface StoryFeedItem {
  id: string;
  guy_id: string;
  guy_name?: string;
  guy_phone?: string;
  guy_socials?: string;
  guy_location?: string;
  guy_age?: number;
  user_id: string;
  text: string;
  tags: TagType[];
  image_url?: string | null;
  created_at: string;
  anonymous: boolean;
  nickname?: string | null;
  comments: Array<{
    id: string;
    user_id: string;
    text: string;
    created_at: string;
    anonymous: boolean;
    nickname?: string | null;
  }>;
  comment_count: number;
  reactions: {
    red_flag: number;
    good_vibes: number;
    unsure: number;
    total: number;
  };
  user_reaction?: ReactionType;
}

export async function fetchStoriesFeed(limit = 20, offset = 0) {
  // Fetch stories base data with guy info
  const base = await db
    .select({
      id: stories.id,
      guyId: stories.guyId,
      userId: stories.userId,
      text: stories.text,
      tags: stories.tags,
      imageUrl: stories.imageUrl,
      createdAt: stories.createdAt,
      anonymous: stories.anonymous,
      nickname: stories.nickname,
      guyName: guys.name,
      guyPhone: guys.phone,
      guySocials: guys.socials,
      guyLocation: guys.location,
      guyAge: guys.age,
    })
    .from(stories)
    .innerJoin(guys, eq(stories.guyId, guys.id))
    .orderBy(desc(stories.createdAt))
    .limit(limit)
    .offset(offset);

  if (base.length === 0) return [] as StoryFeedItem[];

  const storyIds = base.map((b) => b.id);

  // Comments
  const commentRows = await db
    .select({
      id: comments.id,
      storyId: comments.storyId,
      userId: comments.userId,
      text: comments.text,
      createdAt: comments.createdAt,
      anonymous: comments.anonymous,
      nickname: comments.nickname,
    })
    .from(comments)
    .where(inArray(comments.storyId, storyIds));

  // Reactions
  const reactionRows = await db
    .select({ storyId: storyReactions.storyId, reactionType: storyReactions.reactionType })
    .from(storyReactions)
    .where(inArray(storyReactions.storyId, storyIds));

  // Current user reaction
  const session = await auth.api.getSession({ headers: await headers() });
  let userReactionRows: { storyId: string; reactionType: ReactionType }[] = [];
  if (session?.user?.id) {
    userReactionRows = await db
      .select({ storyId: storyReactions.storyId, reactionType: storyReactions.reactionType })
      .from(storyReactions)
      .where(and(inArray(storyReactions.storyId, storyIds), eq(storyReactions.userId, session.user.id)));
  }

  // Assemble
  const commentsByStory = new Map<string, StoryFeedItem["comments"]>();
  for (const c of commentRows) {
    const arr = commentsByStory.get(c.storyId) || [];
    arr.push({
      id: c.id,
      user_id: c.userId,
      text: c.text ?? "",
      created_at: c.createdAt?.toISOString?.() ?? new Date().toISOString(),
      anonymous: !!c.anonymous,
      nickname: c.nickname ?? null,
    });
    commentsByStory.set(c.storyId, arr);
  }

  const reactionCounts = new Map<string, { red_flag: number; good_vibes: number; unsure: number; total: number }>();
  for (const r of reactionRows) {
    const counts = reactionCounts.get(r.storyId) || { red_flag: 0, good_vibes: 0, unsure: 0, total: 0 };
    counts[r.reactionType as ReactionType]++;
    counts.total++;
    reactionCounts.set(r.storyId, counts);
  }

  const userReactionMap = new Map(userReactionRows.map((r) => [r.storyId, r.reactionType]));

  return base.map<StoryFeedItem>((b) => ({
    id: b.id,
    guy_id: b.guyId!,
    guy_name: b.guyName ?? undefined,
    guy_phone: b.guyPhone ?? undefined,
    guy_socials: b.guySocials ?? undefined,
    guy_location: b.guyLocation ?? undefined,
    guy_age: b.guyAge ?? undefined,
    user_id: b.userId!,
    text: b.text ?? "",
    tags: (b.tags as TagType[]) || [],
    image_url: b.imageUrl ?? undefined,
    created_at: b.createdAt?.toISOString?.() ?? new Date().toISOString(),
    anonymous: !!b.anonymous,
    nickname: b.nickname ?? undefined,
    comments: commentsByStory.get(b.id) || [],
    comment_count: (commentsByStory.get(b.id) || []).length,
    reactions: reactionCounts.get(b.id) || { red_flag: 0, good_vibes: 0, unsure: 0, total: 0 },
    user_reaction: userReactionMap.get(b.id),
  }));
}

export async function addPost(input: {
  guyName?: string;
  guyPhone?: string;
  guySocials?: string;
  guyLocation?: string;
  guyAge?: number;
  storyText: string;
  tags: TagType[];
  imageUrl?: string | null;
  anonymous: boolean;
  nickname?: string | null;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");

  if (!input.storyText?.trim()) throw new Error("Story text is required");
  if (!input.tags || input.tags.length === 0) throw new Error("At least one tag is required");
  if (!input.guyName && !input.guyPhone && !input.guySocials) throw new Error("Provide a name, phone, or social");

  // Try find existing guy by phone/socials/name
  let found = null as { id: string } | null;
  if (input.guyPhone || input.guySocials || input.guyName) {
    const conds = [] as any[];
    if (input.guyPhone) conds.push(ilike(guys.phone, `%${input.guyPhone}%`));
    if (input.guySocials) conds.push(ilike(guys.socials, `%${input.guySocials}%`));
    if (input.guyName) conds.push(ilike(guys.name, `%${input.guyName}%`));
    if (conds.length) {
      const res = await db.select({ id: guys.id }).from(guys).where(or(...conds)).limit(1);
      found = res[0] || null;
    }
  }

  let guyId = found?.id;
  if (!guyId) {
    const inserted = await db
      .insert(guys)
      .values({
        name: input.guyName ?? null,
        phone: input.guyPhone ?? null,
        socials: input.guySocials ?? null,
        location: input.guyLocation ?? null,
        age: input.guyAge ?? null,
        createdByUserId: session.user.id,
      })
      .returning({ id: guys.id });
    guyId = inserted[0].id;
  }

  const insertedStory = await db
    .insert(stories)
    .values({
      guyId,
      userId: session.user.id,
      text: input.storyText.trim(),
      tags: input.tags as any,
      imageUrl: input.imageUrl ?? null,
      anonymous: input.anonymous,
      nickname: input.anonymous ? null : input.nickname ?? null,
    })
    .returning({ id: stories.id });

  return { success: true, postId: insertedStory[0].id, guyId };
}

export async function getStoryById(storyId: string) {
  const rows = await db
    .select({
      id: stories.id,
      guyId: stories.guyId,
      userId: stories.userId,
      text: stories.text,
      tags: stories.tags,
      imageUrl: stories.imageUrl,
      createdAt: stories.createdAt,
      anonymous: stories.anonymous,
      nickname: stories.nickname,
    })
    .from(stories)
    .where(eq(stories.id, storyId))
    .limit(1);
  return rows[0] || null;
}

export async function updateStory(storyId: string, data: {
  storyText: string;
  tags: TagType[];
  imageUrl?: string | null;
  anonymous: boolean;
  nickname?: string | null;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");

  // Ensure ownership
  const owner = await db.select({ userId: stories.userId }).from(stories).where(eq(stories.id, storyId)).limit(1);
  if (!owner[0] || owner[0].userId !== session.user.id) throw new Error("You can only edit your own stories");

  await db
    .update(stories)
    .set({
      text: data.storyText,
      tags: data.tags as any,
      imageUrl: data.imageUrl ?? null,
      anonymous: data.anonymous,
      nickname: data.anonymous ? null : data.nickname ?? null,
    })
    .where(eq(stories.id, storyId));

  return { success: true };
}

export async function deleteStory(storyId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");

  const owner = await db.select({ userId: stories.userId }).from(stories).where(eq(stories.id, storyId)).limit(1);
  if (!owner[0] || owner[0].userId !== session.user.id) throw new Error("You can only delete your own stories");

  await db.delete(comments).where(eq(comments.storyId, storyId));
  await db.delete(storyReactions).where(eq(storyReactions.storyId, storyId));
  await db.delete(stories).where(eq(stories.id, storyId));

  return { success: true };
}

export async function reactToStory(storyId: string, reactionType: ReactionType) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");

  // Upsert: if exists update, else insert
  const existing = await db
    .select({ id: storyReactions.id })
    .from(storyReactions)
    .where(and(eq(storyReactions.storyId, storyId), eq(storyReactions.userId, session.user.id)))
    .limit(1);

  if (existing[0]) {
    await db
      .update(storyReactions)
      .set({ reactionType })
      .where(eq(storyReactions.id, existing[0].id));
  } else {
    await db.insert(storyReactions).values({ storyId, userId: session.user.id, reactionType });
  }

  return { success: true };
}

export async function listComments(storyId: string) {
  const rows = await db
    .select({
      id: comments.id,
      userId: comments.userId,
      text: comments.text,
      createdAt: comments.createdAt,
      anonymous: comments.anonymous,
      nickname: comments.nickname,
    })
    .from(comments)
    .where(eq(comments.storyId, storyId))
    .orderBy(desc(comments.createdAt));

  return rows.map((c) => ({
    id: c.id,
    user_id: c.userId,
    text: c.text ?? "",
    created_at: c.createdAt?.toISOString?.() ?? new Date().toISOString(),
    anonymous: !!c.anonymous,
    nickname: c.nickname ?? null,
  }));
}

export async function addComment(storyId: string, textBody: string, anonymous = true, nickname?: string | null) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");
  if (!textBody?.trim()) throw new Error("Comment text is required");

  const res = await db
    .insert(comments)
    .values({
      storyId,
      userId: session.user.id,
      text: textBody.trim(),
      anonymous,
      nickname: anonymous ? null : nickname ?? null,
    })
    .returning({ id: comments.id });

  return { success: true, commentId: res[0].id };
}

