import {
  boolean,
  pgPolicy,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const userModel = pgTable('user', {
  userId: text('user_id').primaryKey().notNull(),
  firstName: text('first_name').default(''),
  lastName: text('last_name').default(''),
  email: text().notNull(),
  avatarUrl: text('avatar_url'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
});
