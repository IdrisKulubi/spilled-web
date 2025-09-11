
import { db } from "@/server/db/connection";
import { emailList } from "@/server/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  const allEmails = await db
    .select()
    .from(emailList)
    .orderBy(asc(emailList.id));

  const batchSize = 50;
  const batches: (typeof allEmails)[] = [];

  for (let i = 0; i < allEmails.length; i += batchSize) {
    batches.push(allEmails.slice(i, i + batchSize));
  }

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchNumber = i + 1;
    for (const email of batch) {
      await db
        .update(emailList)
        .set({
          batch: batchNumber,
        })
        .where(eq(emailList.id, email.id));
    }
  }

  return NextResponse.json({
    message: "Batches created successfully",
    totalBatches: batches.length,
    totalEmails: allEmails.length
  });
}

export async function GET() {
  const allEmails = await db
    .select()
    .from(emailList)
    .orderBy(asc(emailList.batch), asc(emailList.id));

  const batches: Record<number, typeof allEmails> = {};

  for (const email of allEmails) {
    if (email.batch) {
      if (!batches[email.batch]) {
        batches[email.batch] = [];
      }
      batches[email.batch].push(email);
    }
  }

  return NextResponse.json(batches);
}

