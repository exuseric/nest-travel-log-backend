import * as schema from 'src/data/models';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Trip = InferInsertModel<typeof schema.tripModel>;
export type User = InferSelectModel<typeof schema.userModel>;
