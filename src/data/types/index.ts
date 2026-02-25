import {
  Bookmark,
  CreateBookmark,
  Destination,
  CreateDestination,
  TravelDetail,
  CreateTravelDetail,
  Trip,
  CreateTrip,
  TripMember,
  CreateTripMember,
  User,
  CreateUser,
} from '@shared/types/model.types';

// Trip
export type TripModelSelect = Omit<Trip, 'userId'>;
export type TripModelInsert = Omit<CreateTrip, 'userId'>;

// Destination
export type DestinationModelSelect = Omit<Destination, 'userId'>;
export type DestinationModelInsert = Omit<CreateDestination, 'userId'>;

// Bookmark
export type BookmarkModelSelect = Omit<Bookmark, 'userId'>;
export type BookmarkModelInsert = Omit<CreateBookmark, 'userId'>;

// TravelDetail
export type TravelDetailModelSelect = Omit<TravelDetail, 'userId'>;
export type TravelDetailModelInsert = Omit<CreateTravelDetail, 'userId'>;

// TripMember
export type TripMemberModelSelect = TripMember;
export type TripMemberModelInsert = CreateTripMember;

// User
export type UserModelSelect = User;
export type UserModelInsert = CreateUser;
