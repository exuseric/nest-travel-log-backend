import { sql } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const travelDetailModel = pgTable('travel_detail', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  clientUuid: uuid('client_uuid'),
  tripId: uuid('trip_id').notNull(),
  destinationId: uuid('destination_id'),
  userId: text('user_id')
    .default(sql`auth.user_id()`)
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
  isVerified: boolean('is_verified').default(false).notNull(),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
  gallery: jsonb().default([]).notNull().$type<string[]>(),
  order: integer().default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
});
