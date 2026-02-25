import { BookmarkModelInsert } from '@app/data/types';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateBookmarkDto implements BookmarkModelInsert {
  @IsUUID()
  @IsOptional()
  targetTripId?: string | null;

  @IsUUID()
  @IsOptional()
  targetDestinationId?: string | null;
}
