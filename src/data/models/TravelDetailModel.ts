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
import { tripModel } from '@models/TripModel';
import { userModel } from '@models/UserModel';

export const travelDetailModel = pgTable(
  'travel_detail',
  {
    id: serial().notNull(),
    tripId: integer('trip_id').notNull(),
    userId: text('user_id')
      .default(sql`public.user_id()`)
      .notNull(),
    detailType: text('detail_type').notNull(),
    name: text().notNull(),
    description: text(),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    arrivalTime: timestamp('arrival_time', {
      withTimezone: true,
      mode: 'string',
    }),
    departureTime: timestamp('departure_time', {
      withTimezone: true,
      mode: 'string',
    }),
    isVerified: boolean('is_verified').default(false),
    gallery: jsonb().default([]),
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
    foreignKey({
      columns: [table.tripId],
      foreignColumns: [tripModel.id],
      name: 'travel_detail_trip_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'travel_detail_user_id_fkey',
    }).onDelete('cascade'),
    pgPolicy('view_travel_details', {
      as: 'permissive',
      for: 'select',
      to: ['anon'],
      using: sql`((user_id = public.user_id()) OR (EXISTS ( SELECT 1
   FROM trip
  WHERE ((trip.id = travel_detail.trip_id) AND (trip.is_public = true)))))`,
    }),
    pgPolicy('insert_own_travel_details', {
      as: 'permissive',
      for: 'insert',
      to: ['app_authenticated_role'],
      withCheck: sql`((user_id = public.user_id()) AND (EXISTS ( SELECT 1
   FROM trip
  WHERE ((trip.id = travel_detail.trip_id) AND (trip.user_id = public.user_id())))))`,
    }),
    pgPolicy('update_own_travel_details', {
      as: 'permissive',
      for: 'update',
      to: ['app_authenticated_role'],
      using: sql`(user_id = public.user_id())`,
      withCheck: sql`(user_id = public.user_id())`,
    }),
    pgPolicy('delete_own_travel_details', {
      as: 'permissive',
      for: 'delete',
      to: ['app_authenticated_role'],
      using: sql`(user_id = public.user_id())`,
    }),
  ],
);