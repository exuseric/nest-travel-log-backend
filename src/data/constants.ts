import { bookmarkModel, destinationModel, tripModel } from '@app/data/models';

export const TRIP_DEFAULT_SELECT = {
  id: tripModel.id,
  name: tripModel.name,
  country: tripModel.country,
  city: tripModel.city,
  county: tripModel.county,
  description: tripModel.description,
  startDate: tripModel.startDate,
  endDate: tripModel.endDate,
  coverImage: tripModel.coverImage,
  gallery: tripModel.gallery,
  createdAt: tripModel.createdAt,
  updatedAt: tripModel.updatedAt,
  isFavorite: tripModel.isFavorite,
  isPublic: tripModel.isPublic,
  isArchived: tripModel.isArchived,
};

export const DESTINATION_DEFAULT_SELECT = {
  id: destinationModel.id,
  name: destinationModel.name,
  description: destinationModel.description,
  latitude: destinationModel.latitude,
  longitude: destinationModel.longitude,
  country: destinationModel.country,
  coverImage: destinationModel.coverImage,
  gallery: destinationModel.gallery,
  isFavorite: destinationModel.isFavorite,
  tripId: destinationModel.tripId,
  createdAt: destinationModel.createdAt,
  updatedAt: destinationModel.updatedAt,
};

export const DESTINATION_DEFAULT_INSERT = {
  name: destinationModel.name,
  latitude: destinationModel.latitude,
  longitude: destinationModel.longitude,
  country: destinationModel.country,
  coverImage: destinationModel.coverImage,
  description: destinationModel.description,
  gallery: destinationModel.gallery,
  isFavorite: destinationModel.isFavorite,
  tripId: destinationModel.tripId,
};

export const BOOKMARK_DEFAULT_SELECT = {
  id: bookmarkModel.id,
  targetTripId: bookmarkModel.targetTripId,
  targetDestinationId: bookmarkModel.targetDestinationId,
  createdAt: bookmarkModel.createdAt,
};
