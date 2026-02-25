import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const tripMemberModel = pgTable('trip_member', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  tripId: uuid('trip_id').notNull(),
  userId: text('user_id').notNull(),
  role: text().default('member').notNull(),
  invitedBy: text('invited_by'),
  joinedAt: timestamp('joined_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
});
