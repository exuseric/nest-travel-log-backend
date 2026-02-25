import { sql } from 'drizzle-orm';
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const tripModel = pgTable('trip', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: text('user_id')
    .default(sql`auth.user_id()`)
    .notNull(),
  name: text().notNull(),
  description: text(),
  country: text().default('Kenya').notNull(),
  city: text().notNull(),
  county: text(),
  startDate: timestamp('start_date', { withTimezone: true, mode: 'string' }),
  endDate: timestamp('end_date', { withTimezone: true, mode: 'string' }),
  coverImage: text('cover_image'),
  gallery: jsonb().default([]).notNull().$type<string[]>(),
  isFavorite: boolean('is_favorite').default(false).notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
  isArchived: boolean('is_archived').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
});
