import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/server/db/connection";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const user = session.user as any;
    return NextResponse.json({
      success: true,
      status: user.verificationStatus || "pending",
      idImageUrl: user.idImageUrl || null,
      idType: user.idType || null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { publicUrl, idType } = body || {};
    if (!publicUrl || !idType) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const patch = {
      idImageUrl: publicUrl as string,
      idType: idType as any,
      verificationStatus: "pending" as any,
      verified: false,
    };

    await db.update(users).set(patch as any).where(eq(users.id, session.user.id));
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}

