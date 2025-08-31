"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function signOut() {
  try {
    const result = await auth.api.signOut({ 
      headers: await headers()
    });
    
    // The signOut API returns { success: boolean } — check success instead of expecting `error`.
    if (!result || !result.success) {
      const message = (result as any)?.error?.message ?? "Sign-out failed";
      throw new Error(message);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

