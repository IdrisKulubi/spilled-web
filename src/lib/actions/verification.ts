"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/server/db/connection";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function submitVerification(input: { idImageUrl: string; idType: "school_id" | "national_id" }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated");

  await db
    .update(users)
    .set({ idImageUrl: input.idImageUrl, idType: input.idType, verificationStatus: "pending" as any })
    .where(eq(users.id, session.user.id as any));

  return { success: true };
}

export async function getVerificationStatus() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { status: "anonymous" as const };

  const res = await db
    .select({
      idImageUrl: users.idImageUrl,
      idType: users.idType,
      verificationStatus: users.verificationStatus,
      nickname: users.nickname,
    })
    .from(users)
    .where(eq(users.id, session.user.id as any))
    .limit(1);

  if (!res[0]) return { status: "unknown" as const };

  return {
    status: res[0].verificationStatus ?? "pending",
    idImageUrl: res[0].idImageUrl ?? undefined,
    idType: res[0].idType ?? undefined,
    nickname: res[0].nickname ?? undefined,
  };
}

