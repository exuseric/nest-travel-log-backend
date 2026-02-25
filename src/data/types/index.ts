import { tripModel } from '@app/data/models';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type TripModelSelect = Omit<
  InferSelectModel<typeof tripModel>,
  'userId'
>;

export type TripModelInsert = Omit<
  InferInsertModel<typeof tripModel>,
  'userId'
>;
