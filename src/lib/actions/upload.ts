"use server";
import { createPresignedUpload } from "@/server/services/r2Service";

export async function presignUpload({
  folder = "uploads",
  filename,
  contentType,
}: {
  folder?: string;
  filename: string;
  contentType: string;
}) {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${folder}/${Date.now()}-${safeName}`;
  return await createPresignedUpload({ key, contentType });
}

