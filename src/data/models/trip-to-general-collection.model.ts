import { sql } from 'drizzle-orm';
import { pgPolicy, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { tripModel } from './trip.model';
import { generalCollectionModel } from './general-collections.model';

export const tripToGeneralCollectionModel = pgTable(
  'trip_to_general_collection',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    tripId: uuid('trip_id')
      .notNull()
      .references(() => tripModel.id, { onDelete: 'cascade' }),
    generalCollectionId: uuid('general_collection_id')
      .notNull()
      .references(() => generalCollectionModel.id, { onDelete: 'cascade' }),
    addedAt: timestamp('added_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    pgPolicy('trip_to_general_collection_select_all', {
      as: 'permissive',
      for: 'select',
      to: ['public'],
      using: sql`true`,
    }),
  ],
);
