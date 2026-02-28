import * as schema from 'src/data/models';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Trip = InferSelectModel<typeof schema.tripModel>;
export type CreateTrip = InferInsertModel<typeof schema.tripModel>;

export type Destination = InferSelectModel<typeof schema.destinationModel>;
export type CreateDestination = InferInsertModel<
  typeof schema.destinationModel
>;

export type User = InferSelectModel<typeof schema.userModel>;
export type CreateUser = InferInsertModel<typeof schema.userModel>;

export type Bookmark = InferSelectModel<typeof schema.bookmarkModel>;
export type CreateBookmark = InferInsertModel<typeof schema.bookmarkModel>;

export type TravelDetail = InferSelectModel<typeof schema.travelDetailModel>;
export type CreateTravelDetail = InferInsertModel<
  typeof schema.travelDetailModel
>;

export type TripMember = InferSelectModel<typeof schema.tripMemberModel>;
export type CreateTripMember = InferInsertModel<typeof schema.tripMemberModel>;
