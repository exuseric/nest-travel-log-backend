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
import { tripModel, userModel } from '@/data/models';

export const destinationModel = pgTable(
  'destination',
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    country: text(),
    coverImage: text('cover_image'),
    gallery: jsonb().default([]),
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
    isVerified: boolean('is_verified').default(false),
    isVisited: boolean('is_visited').default(false),
  },
  (table) => [
    foreignKey({
      columns: [table.tripId],
      foreignColumns: [tripModel.id],
      name: 'destination_trip_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'destination_user_id_fkey',
    }).onDelete('cascade'),
    pgPolicy('view_destinations', {
      as: 'permissive',
      for: 'select',
      to: ['public'],
      using: sql`((user_id = auth.user_id()) OR (EXISTS ( SELECT 1
                FROM trip
                WHERE ((trip.id = destination.trip_id) AND (trip.is_public = true)))))`,
    }),
    pgPolicy('modify_own_destinations', {
      as: 'permissive',
      for: 'all',
      to: ['authenticated'],
    }),
  ],
);
