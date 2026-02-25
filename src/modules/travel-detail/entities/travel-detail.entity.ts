import { TravelDetail as TravelDetailType } from '@shared/types/model.types';

export class TravelDetail implements TravelDetailType {
  id: string;
  clientUuid: string | null;
  tripId: string;
  destinationId: string | null;
  userId: string;
  detailType: string;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  arrivalTime: string | null;
  departureTime: string | null;
  isVerified: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  gallery: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}
