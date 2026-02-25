import { DestinationSelectType } from '@shared/types/model.types';

export class Destination implements DestinationSelectType {
  id: number;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  country: string | null;
  coverImage: string | null;
  gallery: string[] | null;
  isFavorite: boolean | null;
  tripId: number;
  userId: string;
  createdAt: string | null;
  updatedAt: string | null;
  isVerified: boolean | null;
  isVisited: boolean | null;
}