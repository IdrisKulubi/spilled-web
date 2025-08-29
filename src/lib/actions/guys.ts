"use server";
import { db } from "@/server/db/connection";
import { guys, stories } from "@/server/db/schema";
import { ilike, or, sql, desc, eq } from "drizzle-orm";

export async function searchGuys(searchTerm: string, limit = 20) {
  const term = (searchTerm || "").trim();
  if (!term) return [] as Array<{
    id: string; name?: string | null; phone?: string | null; socials?: string | null; location?: string | null; age?: number | null; story_count: number;
  }>;

  const res = await db
    .select({
      id: guys.id,
      name: guys.name,
      phone: guys.phone,
      socials: guys.socials,
      location: guys.location,
      age: guys.age,
      storyCount: sql<number>`count(${stories.id})`,
    })
    .from(guys)
    .leftJoin(stories, eq(guys.id, stories.guyId))
    .where(
      or(
        ilike(guys.name, `%${term}%`),
        ilike(guys.phone, `%${term}%`),
        ilike(guys.socials, `%${term}%`)
      )
    )
    .groupBy(guys.id, guys.name, guys.phone, guys.socials, guys.location, guys.age)
    .orderBy(desc(sql`count(${stories.id})`))
    .limit(limit);

  return res.map(r => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    socials: r.socials,
    location: r.location,
    age: r.age,
    story_count: Number(r.storyCount || 0),
  }));
}

