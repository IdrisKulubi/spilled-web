import { pgTable, text, boolean, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Enums
export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "approved", 
  "rejected",
]);

export const idTypeEnum = pgEnum("id_type", [
  "school_id",
  "national_id",
]);

export const tagTypeEnum = pgEnum("tag_type", [
  "red_flag",
  "good_vibes", 
  "unsure",
]);

// Users table - compatible with better-auth
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  phone: text("phone"),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").default(false),
  name: text("name"),
  image: text("image"),
  nickname: text("nickname"),
  verified: boolean("verified").default(false),
  verificationStatus: verificationStatusEnum("verification_status").default("pending"),
  idImageUrl: text("id_image_url"),
  idType: idTypeEnum("id_type"),
  rejectionReason: text("rejection_reason"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions table - required by better-auth (singular name to match existing DB)
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

// Accounts table - required for OAuth (singular name to match existing DB)
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Verification table - required by better-auth
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Guys table
export const guys = pgTable("guys", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name"),
  phone: text("phone"),
  socials: text("socials"),
  location: text("location"),
  age: integer("age"),
  createdByUserId: text("created_by_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stories table
export const stories = pgTable("stories", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  guyId: text("guy_id").references(() => guys.id),
  createdByUserId: text("created_by_user_id").references(() => users.id),
  content: text("content"),
  tagType: text("tag_type"), // Using text instead of enum for now
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments table
export const comments = pgTable("comments", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  storyId: text("story_id").references(() => stories.id),
  createdByUserId: text("created_by_user_id").references(() => users.id),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages table
export const messages = pgTable("messages", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: text("sender_id").references(() => users.id),
  receiverId: text("receiver_id").references(() => users.id),
  content: text("content"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Story reactions table
export const storyReactions = pgTable("story_reactions", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  storyId: text("story_id").references(() => stories.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  reactionType: tagTypeEnum("reaction_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email list table for managing onboarding emails
export const emailList = pgTable("email_list", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  status: text("status").default("pending"), // pending, sent, failed, bounced, unsubscribed
  batch: text("batch"), // e.g. A, B, C... used for 50-sized groups
  lastSentAt: timestamp("last_sent_at"),
  sentCount: integer("sent_count").default(0),
  tags: text("tags"), // JSON array of tags
  notes: text("notes"),
  addedBy: text("added_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email campaigns table for tracking bulk sends
export const emailCampaigns = pgTable("email_campaigns", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  template: text("template").default("onboarding"),
  totalEmails: integer("total_emails").default(0),
  sentEmails: integer("sent_emails").default(0),
  failedEmails: integer("failed_emails").default(0),
  status: text("status").default("draft"), // draft, sending, completed, failed
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email campaign recipients - tracks individual sends
export const emailCampaignRecipients = pgTable("email_campaign_recipients", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: text("campaign_id").references(() => emailCampaigns.id).notNull(),
  emailId: text("email_id").references(() => emailList.id).notNull(),
  status: text("status").default("pending"), // pending, sent, failed
  messageId: text("message_id"),
  error: text("error"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Guy = typeof guys.$inferSelect;
export type InsertGuy = typeof guys.$inferInsert;
export type Story = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type StoryReaction = typeof storyReactions.$inferSelect;
export type InsertStoryReaction = typeof storyReactions.$inferInsert;
export type EmailListEntry = typeof emailList.$inferSelect;
export type InsertEmailListEntry = typeof emailList.$inferInsert;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type InsertEmailCampaign = typeof emailCampaigns.$inferInsert;
export type EmailCampaignRecipient = typeof emailCampaignRecipients.$inferSelect;
export type InsertEmailCampaignRecipient = typeof emailCampaignRecipients.$inferInsert;

