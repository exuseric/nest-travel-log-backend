import * as schema from 'src/data/models';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Trip = InferSelectModel<typeof schema.tripModel>;
export type CreateTrip = InferInsertModel<typeof schema.tripModel>;

export type DestinationSelectType = InferSelectModel<
  typeof schema.destinationModel
>;
export type CreateDestinationType = InferInsertModel<
  typeof schema.destinationModel
>;

export type User = InferSelectModel<typeof schema.userModel>;
