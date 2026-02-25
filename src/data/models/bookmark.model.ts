import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const bookmarkModel = pgTable('bookmark', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: text('user_id')
    .default(sql`auth.user_id()`)
    .notNull(),
  targetTripId: uuid('target_trip_id'),
  targetDestinationId: uuid('target_destination_id'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
});
