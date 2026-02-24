import { tripModel } from '@app/data/models';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type TripModelSelect = Omit<
  InferSelectModel<typeof tripModel>,
  'userId' | 'gallery'
> & {
  gallery?: string[] | null;
};

export type TripModelInsert = Omit<
  InferInsertModel<typeof tripModel>,
  'userId' | 'gallery'
> & {
  gallery?: string[] | null;
};
