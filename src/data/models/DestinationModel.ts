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
import { userModel } from '@models/UserModel';
import { tripModel } from '@models/TripModel';

export const destinationModel = pgTable(
  'destination',
  {
    id: serial().notNull(),
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
      .default(sql`public.user_id()`)
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
      to: ['anon'],
      using: sql`((user_id = public.user_id()) OR (EXISTS ( SELECT 1
   FROM trip
  WHERE ((trip.id = destination.trip_id) AND (trip.is_public = true)))))`,
    }),
    pgPolicy('insert_own_destinations', {
      as: 'permissive',
      for: 'insert',
      to: ['app_authenticated_role'],
      withCheck: sql`((user_id = public.user_id()) AND (EXISTS ( SELECT 1
   FROM trip
  WHERE ((trip.id = destination.trip_id) AND (trip.user_id = public.user_id())))))`,
    }),
    pgPolicy('update_own_destinations', {
      as: 'permissive',
      for: 'update',
      to: ['app_authenticated_role'],
      using: sql`(user_id = public.user_id())`,
      withCheck: sql`(user_id = public.user_id())`,
    }),
    pgPolicy('delete_own_destinations', {
      as: 'permissive',
      for: 'delete',
      to: ['app_authenticated_role'],
      using: sql`(user_id = public.user_id())`,
    }),
  ],
);