import { Destination as DestinationType } from '@shared/types/model.types';

export class Destination implements DestinationType {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  country: string | null;
  coverImage: string | null;
  gallery: string[];
  isFavorite: boolean;
  tripId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean | null;
  isVisited: boolean | null;
  city: string;
  county: string;
  locale: string;
  order: number;
}
