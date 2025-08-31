import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createPresignedUpload } from "@/server/services/r2Service";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const contentType = body?.contentType || "image/jpeg";
    const idType = body?.idType || "school_id";

    const key = body?.key || `verification/${session.user.id}/${Date.now()}`;
    const { uploadUrl, publicUrl } = await createPresignedUpload({ key, contentType });

    return NextResponse.json({ success: true, uploadUrl, publicUrl, key });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to presign" }, { status: 500 });
  }
}

