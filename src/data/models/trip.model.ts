import { sql } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const tripModel = pgTable('trip', {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  latitude: doublePrecision().notNull(),
  longitude: doublePrecision().notNull(),
  country: text(),
  startDate: timestamp('start_date', { withTimezone: true, mode: 'string' }),
  endDate: timestamp('end_date', { withTimezone: true, mode: 'string' }),
  coverImage: text('cover_image'),
  gallery: jsonb().default([]).$type<string[]>(),
  isFavorite: boolean('is_favorite').default(false),
  isPublic: boolean('is_public').default(false),
  userId: text('user_id')
    .default(sql`auth.user_id()`)
    .notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
});
