import { sql } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const destinationModel = pgTable('destination', {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  latitude: doublePrecision(),
  longitude: doublePrecision(),
  country: text(),
  coverImage: text('cover_image'),
  gallery: jsonb().default([]).$type<string[]>(),
  isFavorite: boolean('is_favorite').default(false),
  tripId: integer('trip_id').notNull(),
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
