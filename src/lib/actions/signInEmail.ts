"use server";
import { auth } from "@/lib/auth";

export async function signInEmail(_email: string, _password: string) {
  throw new Error("Email/password sign-in is disabled. Use Google sign-in instead.");
}

