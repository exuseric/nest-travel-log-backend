import { Bookmark as BookmarkType } from '@shared/types/model.types';

export class Bookmark implements BookmarkType {
  id: string;
  userId: string;
  targetTripId: string | null;
  targetDestinationId: string | null;
  createdAt: string;
}
