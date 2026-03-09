import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { generalCollectionModel } from './general-collections.model';
import { tripModel } from './trip.model';

export const tripToGeneralCollectionModel = pgTable(
  'trip_to_general_collection',
  {
    id: uuid()
      .defaultRandom()
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
  }
);
