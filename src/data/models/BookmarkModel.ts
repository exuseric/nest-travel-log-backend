import {
  foreignKey,
  integer,
  pgPolicy,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { destinationModel, tripModel, userModel } from '@/data/models';

export const bookmarkModel = pgTable(
  'bookmark',
  {
    id: serial().primaryKey().notNull(),
    userId: text('user_id')
      .default(sql`auth.user_id()`)
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
    unique('unique_user_trip_bookmark').on(table.userId, table.targetTripId),
    unique('unique_user_dest_bookmark').on(
      table.userId,
      table.targetDestinationId,
    ),
    pgPolicy('manage_own_bookmarks', {
      as: 'permissive',
      for: 'all',
      to: ['authenticated'],
      using: sql`(user_id = auth.user_id())`,
      withCheck: sql`(user_id = auth.user_id())`,
    }),
  ],
);
