import {
  BOOKMARK_DEFAULT_SELECT,
  DESTINATION_DEFAULT_SELECT,
  TRIP_DEFAULT_SELECT,
} from '@app/data/constants';
import { DBService } from '@modules/db/db.service';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { eq } from 'drizzle-orm';
import { bookmarkModel, destinationModel, tripModel } from 'src/data/models';
import { Bookmark } from 'src/shared/types/model.types';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable({ scope: Scope.REQUEST })
export class BookmarkService {
  constructor(private dbService: DBService) {}

  async create(createBookmarkDto: CreateBookmarkDto) {
    try {
      const db = await this.dbService.getDb();

      const [newBookmark] = await db
        .insert(bookmarkModel)
        .values({ ...createBookmarkDto })
        .returning();

      if (!newBookmark) {
        throw new InternalServerErrorException('Failed to create bookmark');
      }
      return newBookmark;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to create bookmark');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const db = await this.dbService.getDb();
      const results = await db
        .select({
          ...BOOKMARK_DEFAULT_SELECT,
          trip: TRIP_DEFAULT_SELECT,
          destination: DESTINATION_DEFAULT_SELECT,
        })
        .from(bookmarkModel)
        .leftJoin(tripModel, eq(bookmarkModel.targetTripId, tripModel.id))
        .leftJoin(
          destinationModel,
          eq(bookmarkModel.targetDestinationId, destinationModel.id),
        )
        .limit(paginationDto.limit ?? 10)
        .offset(paginationDto.offset ?? 0);

      return results;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('findAll error:', (error as Error).message);
      throw new InternalServerErrorException('Failed to fetch bookmarks');
    }
  }

  async findOne(id: Bookmark['id']) {
    if (id == null) throw new NotFoundException('No bookmark found');

    try {
      const db = await this.dbService.getDb();

      const [bookmark] = await db
        .select({
          ...BOOKMARK_DEFAULT_SELECT,
          trip: TRIP_DEFAULT_SELECT,
          destination: DESTINATION_DEFAULT_SELECT,
        })
        .from(bookmarkModel)
        .leftJoin(tripModel, eq(bookmarkModel.targetTripId, tripModel.id))
        .leftJoin(
          destinationModel,
          eq(bookmarkModel.targetDestinationId, destinationModel.id),
        )
        .where(eq(bookmarkModel.id, id))
        .limit(1);

      if (!bookmark) throw new NotFoundException('No bookmark found');
      return bookmark;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch bookmark');
    }
  }

  async update(id: Bookmark['id'], updateBookmarkDto: UpdateBookmarkDto) {
    if (id == null) throw new NotFoundException('No bookmark found');

    try {
      const db = await this.dbService.getDb();

      const [updatedBookmark] = await db
        .update(bookmarkModel)
        .set(updateBookmarkDto)
        .where(eq(bookmarkModel.id, id))
        .returning();

      if (!updatedBookmark) throw new NotFoundException('No bookmark found');

      return updatedBookmark;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to update bookmark');
    }
  }

  async remove(id: Bookmark['id']) {
    if (id == null) throw new NotFoundException('No bookmark found');
    try {
      const db = await this.dbService.getDb();

      const [deletedBookmark] = await db
        .delete(bookmarkModel)
        .where(eq(bookmarkModel.id, id))
        .returning();

      if (!deletedBookmark) throw new NotFoundException('No bookmark found');
      return deletedBookmark;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to delete bookmark');
    }
  }
}
