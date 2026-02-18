import * as schema from 'src/db/schema';
import {
  InferSelectModel,
  InferInsertModel,
  InferColumnsDataTypes,
} from 'drizzle-orm';

export type Trip = InferInsertModel<typeof schema.trip>;
