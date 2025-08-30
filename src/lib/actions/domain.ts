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

  const story = await storyRepo.create({
    guyId,
    userId: session.user.id,
    text: input.storyText.trim(),
    tags: input.tags as any,
    imageUrl: input.imageUrl ?? null,
    anonymous: input.anonymous,
    nickname: input.anonymous ? null : input.nickname ?? null,
  } as any);

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
  await storyRepo.updateStory(storyId, {
    text: data.storyText,
    tags: data.tags as any,
    imageUrl: data.imageUrl ?? null,
    anonymous: data.anonymous,
    nickname: data.anonymous ? null : data.nickname ?? null,
  } as any);
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
  // This is a simple passthrough to existing action list; we can add richer methods later
  // Keeping here for parity with repository exposure
  return []; // Implement as needed when migrating full comments feature
}

export async function repoSearchGuys(term: string, limit = 10) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");
  if (!term || !term.trim()) return { data: [], total: 0 };
  const res = await guyRepo.searchGuys(term.trim(), limit);
  return res;
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

