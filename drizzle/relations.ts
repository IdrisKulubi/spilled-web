import { relations } from "drizzle-orm/relations";
import { guys, stories, users, comments, messages, session, account, storyReactions } from "./schema";

export const storiesRelations = relations(stories, ({one, many}) => ({
	guy: one(guys, {
		fields: [stories.guyId],
		references: [guys.id]
	}),
	user: one(users, {
		fields: [stories.createdByUserId],
		references: [users.id]
	}),
	comments: many(comments),
	storyReactions: many(storyReactions),
}));

export const guysRelations = relations(guys, ({one, many}) => ({
	stories: many(stories),
	user: one(users, {
		fields: [guys.createdByUserId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	stories: many(stories),
	comments: many(comments),
	guys: many(guys),
	messages_senderId: many(messages, {
		relationName: "messages_senderId_users_id"
	}),
	messages_receiverId: many(messages, {
		relationName: "messages_receiverId_users_id"
	}),
	sessions: many(session),
	accounts: many(account),
	storyReactions: many(storyReactions),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	story: one(stories, {
		fields: [comments.storyId],
		references: [stories.id]
	}),
	user: one(users, {
		fields: [comments.createdByUserId],
		references: [users.id]
	}),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	user_senderId: one(users, {
		fields: [messages.senderId],
		references: [users.id],
		relationName: "messages_senderId_users_id"
	}),
	user_receiverId: one(users, {
		fields: [messages.receiverId],
		references: [users.id],
		relationName: "messages_receiverId_users_id"
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(users, {
		fields: [session.userId],
		references: [users.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(users, {
		fields: [account.userId],
		references: [users.id]
	}),
}));

export const storyReactionsRelations = relations(storyReactions, ({one}) => ({
	story: one(stories, {
		fields: [storyReactions.storyId],
		references: [stories.id]
	}),
	user: one(users, {
		fields: [storyReactions.userId],
		references: [users.id]
	}),
}));