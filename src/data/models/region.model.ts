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
      .defaultRandom()
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
  }
);
