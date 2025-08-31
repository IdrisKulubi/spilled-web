import { pgTable, foreignKey, text, timestamp, integer, boolean, index, unique, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const idType = pgEnum("id_type", ['school_id', 'national_id'])
export const tagType = pgEnum("tag_type", ['positive', 'negative', 'neutral'])
export const verificationStatus = pgEnum("verification_status", ['pending', 'approved', 'rejected'])


export const stories = pgTable("stories", {
	id: text().default(sql`gen_random_uuid()`).primaryKey().notNull(),
	content: text(),
	imageUrl: text("image_url"),
	tagType: tagType("tag_type"),
	guyId: text("guy_id"),
	createdByUserId: text("created_by_user_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.guyId],
			foreignColumns: [guys.id],
			name: "stories_guy_id_guys_id_fk"
		}),
	foreignKey({
			columns: [table.createdByUserId],
			foreignColumns: [users.id],
			name: "stories_created_by_user_id_users_id_fk"
		}),
]);

export const comments = pgTable("comments", {
	id: text().default(sql`gen_random_uuid()`).primaryKey().notNull(),
	content: text(),
	storyId: text("story_id"),
	createdByUserId: text("created_by_user_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.storyId],
			foreignColumns: [stories.id],
			name: "comments_story_id_stories_id_fk"
		}),
	foreignKey({
			columns: [table.createdByUserId],
			foreignColumns: [users.id],
			name: "comments_created_by_user_id_users_id_fk"
		}),
]);

export const guys = pgTable("guys", {
	id: text().default(sql`gen_random_uuid()`).primaryKey().notNull(),
	name: text(),
	phone: text(),
	socials: text(),
	location: text(),
	age: integer(),
	createdByUserId: text("created_by_user_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.createdByUserId],
			foreignColumns: [users.id],
			name: "guys_created_by_user_id_users_id_fk"
		}),
]);

export const messages = pgTable("messages", {
	id: text().default(sql`gen_random_uuid()`).primaryKey().notNull(),
	content: text(),
	senderId: text("sender_id"),
	receiverId: text("receiver_id"),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.senderId],
			foreignColumns: [users.id],
			name: "messages_sender_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.receiverId],
			foreignColumns: [users.id],
			name: "messages_receiver_id_users_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	phone: text(),
	email: text(),
	nickname: text(),
	verified: boolean().default(false),
	verificationStatus: verificationStatus("verification_status").default('pending'),
	idImageUrl: text("id_image_url"),
	idType: idType("id_type"),
	rejectionReason: text("rejection_reason"),
	verifiedAt: timestamp("verified_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	name: text(),
	emailVerified: boolean("email_verified").default(false),
	image: text(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	index("idx_session_token").using("btree", table.token.asc().nullsLast().op("text_ops")),
	index("idx_session_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "session_user_id_fkey"
		}).onDelete("cascade"),
	unique("session_token_key").on(table.token),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("idx_account_provider").using("btree", table.providerId.asc().nullsLast().op("text_ops"), table.accountId.asc().nullsLast().op("text_ops")),
	index("idx_account_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "account_user_id_fkey"
		}).onDelete("cascade"),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index("idx_verification_identifier").using("btree", table.identifier.asc().nullsLast().op("text_ops")),
]);

export const storyReactions = pgTable("story_reactions", {
	id: text().default(sql`gen_random_uuid()`).primaryKey().notNull(),
	storyId: text("story_id"),
	userId: text("user_id"),
	reactionType: text("reaction_type").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("story_reactions_story_id_idx").using("btree", table.storyId.asc().nullsLast().op("text_ops")),
	index("story_reactions_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.storyId],
			foreignColumns: [stories.id],
			name: "story_reactions_story_id_stories_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "story_reactions_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("story_reactions_unique_user_story").on(table.storyId, table.userId),
]);
