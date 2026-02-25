import { destinationModel, tripModel } from '@app/data/models';

export const TRIP_DEFAULT_SELECT = {
  id: tripModel.id,
  name: tripModel.name,
  description: tripModel.description,
  latitude: tripModel.latitude,
  longitude: tripModel.longitude,
  country: tripModel.country,
  startDate: tripModel.startDate,
  endDate: tripModel.endDate,
  coverImage: tripModel.coverImage,
  gallery: tripModel.gallery,
  createdAt: tripModel.createdAt,
  updatedAt: tripModel.updatedAt,
  isFavorite: tripModel.isFavorite,
  isPublic: tripModel.isPublic,
};

export const TRIP_DEFAULT_INSERT = {
  name: tripModel.name,
  latitude: tripModel.latitude,
  longitude: tripModel.longitude,
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
