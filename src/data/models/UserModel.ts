import {
  boolean,
  pgPolicy,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const userModel = pgTable(
  'user',
  {
    id: text().notNull(),
    name: text(),
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
  },
  (table) => [
    pgPolicy('view_users', {
      as: 'permissive',
      for: 'select',
      to: ['anon'],
      using: sql`true`,
    }),
    pgPolicy('manage_own_user', {
      as: 'permissive',
      for: 'all',
      to: ['app_authenticated_role'],
      using: sql`(id = public.user_id())`,
      withCheck: sql`(id = public.user_id())`,
    }),
  ],
);