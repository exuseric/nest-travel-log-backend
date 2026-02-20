import {
  boolean,
  doublePrecision,
  foreignKey,
  integer,
  jsonb,
  pgPolicy,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { userModel } from '@/data/models';

export const tripModel = pgTable(
  'trip',
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    country: text(),
    startDate: timestamp('start_date', { withTimezone: true, mode: 'string' }),
    endDate: timestamp('end_date', { withTimezone: true, mode: 'string' }),
    coverImage: text('cover_image'),
    gallery: jsonb().default([]),
    isFavorite: boolean('is_favorite').default(false),
    isPublic: boolean('is_public').default(false),
    userId: text('user_id')
      .default(sql`auth.user_id()`)
      .notNull(),
    parentTripId: integer('parent_trip_id'),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    isVisited: boolean('is_visited').default(false),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'trip_user_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.parentTripId],
      foreignColumns: [table.id],
      name: 'trip_parent_trip_id_fkey',
    }).onDelete('cascade'),
    pgPolicy('view_trips', {
      as: 'permissive',
      for: 'select',
      to: ['public'],
      using: sql`((is_public = true) OR (user_id = auth.user_id()))`,
    }),
    pgPolicy('modify_own_trips', {
      as: 'permissive',
      for: 'all',
      to: ['authenticated'],
    }),
  ],
);
