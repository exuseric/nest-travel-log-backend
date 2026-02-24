import { tripModel } from '@app/data/models';
import { SelectedFields } from 'drizzle-orm/pg-core';

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
