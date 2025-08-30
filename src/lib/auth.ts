import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/server/db/connection";
import { users, session, account, verification } from "@/server/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: session,
      account: account,
      verification: verification,
    },
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      nickname: { type: "string", required: false },
      phone: { type: "string", required: false },
      verified: { type: "boolean", defaultValue: false },
      verificationStatus: { type: "string", defaultValue: "pending" },
      idImageUrl: { type: "string", required: false },
      idType: { type: "string", required: false },
      rejectionReason: { type: "string", required: false },
      verifiedAt: { type: "date", required: false },
    },
  },
  telemetry: { enabled: false },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
  plugins: [nextCookies()], // must be last
});

export type Session = typeof auth.$Infer.Session;

