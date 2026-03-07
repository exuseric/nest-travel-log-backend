import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const generalCollectionModel = pgTable('general_collection', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  description: text(),
  coverImage: text('cover_image'),
  regionId: uuid('region_id'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
});
