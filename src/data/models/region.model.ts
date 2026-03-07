import { sql } from 'drizzle-orm';
import {
  doublePrecision,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const regionModel = pgTable(
  'region',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: text().notNull(),
    description: text(),
    country: text().default('Kenya').notNull(),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    pgPolicy('region_select_all', {
      as: 'permissive',
      for: 'select',
      to: ['public'],
      using: sql`true`,
    }),
  ],
);
