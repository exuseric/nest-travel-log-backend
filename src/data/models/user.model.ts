import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const userModel = pgTable('user', {
  userId: text('user_id').primaryKey().notNull(),
  firstName: text('first_name').default('').notNull(),
  lastName: text('last_name').default('').notNull(),
  email: text().notNull(),
  avatarUrl: text('avatar_url'),
  emailVerified: boolean('email_verified').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
});
