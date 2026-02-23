import {
  foreignKey,
  integer,
  pgPolicy,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { userModel } from '@models/UserModel';
import { tripModel } from '@models/TripModel';
import { destinationModel } from '@models/DestinationModel';

export const bookmarkModel = pgTable(
  'bookmark',
  {
    id: serial().notNull(),
    userId: text('user_id')
      .default(sql`public.user_id()`)
      .notNull(),
    targetTripId: integer('target_trip_id'),
    targetDestinationId: integer('target_destination_id'),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'bookmark_user_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.targetTripId],
      foreignColumns: [tripModel.id],
      name: 'bookmark_target_trip_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.targetDestinationId],
      foreignColumns: [destinationModel.id],
      name: 'bookmark_target_destination_id_fkey',
    }).onDelete('cascade'),
    pgPolicy('select_own_bookmarks', {
      as: 'permissive',
      for: 'select',
      to: ['app_authenticated_role'],
      using: sql`(user_id = public.user_id())`,
    }),
    pgPolicy('insert_own_bookmarks', {
      as: 'permissive',
      for: 'insert',
      to: ['app_authenticated_role'],
      withCheck: sql`((user_id = public.user_id()) AND (((target_trip_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM trip
  WHERE ((trip.id = bookmark.target_trip_id) AND ((trip.is_public = true) OR (trip.user_id = public.user_id())))))) OR ((target_destination_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM (destination
     JOIN trip ON ((trip.id = destination.trip_id)))
  WHERE ((destination.id = bookmark.target_destination_id) AND ((trip.is_public = true) OR (destination.user_id = public.user_id()))))))))`,
    }),
    pgPolicy('delete_own_bookmarks', {
      as: 'permissive',
      for: 'delete',
      to: ['app_authenticated_role'],
      using: sql`(user_id = public.user_id())`,
    }),
  ],
);