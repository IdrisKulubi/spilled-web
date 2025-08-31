"use server";
import { auth } from "@/lib/auth";

export async function signOut() {
  const result = await auth.api.signOut({ headers: { "Content-Type": "application/json" } });
  // The signOut API returns { success: boolean } — check success instead of expecting `error`.
  if (!result || !result.success) {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = (result as any)?.error?.message ?? "Sign-out failed";
    throw new Error(message);
  }
  return { success: true };
}

