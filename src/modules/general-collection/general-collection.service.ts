import { GENERAL_COLLECTION_DEFAULT_SELECT } from '@app/data/constants';
import { GeneralCollectionModelSelect } from '@app/data/types';
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
import { generalCollectionModel } from 'src/data/models';
import { CreateGeneralCollectionDto } from './dto/create-general-collection.dto';
import { UpdateGeneralCollectionDto } from './dto/update-general-collection.dto';

@Injectable({ scope: Scope.REQUEST })
export class GeneralCollectionService {
  constructor(private dbService: DBService) {}

  async create(createGeneralCollectionDto: CreateGeneralCollectionDto) {
    try {
      const db = await this.dbService.getDb();

      const [newCollection] = await db
        .insert(generalCollectionModel)
        .values({ ...createGeneralCollectionDto })
        .returning();

      if (!newCollection) {
        throw new InternalServerErrorException('Failed to create general collection');
      }
      return newCollection;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to create general collection');
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<GeneralCollectionModelSelect[]> {
    try {
      const db = await this.dbService.getDb();
      return await db
        .select(GENERAL_COLLECTION_DEFAULT_SELECT)
        .from(generalCollectionModel)
        .limit(paginationDto.limit ?? 10)
        .offset(paginationDto.offset ?? 0);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('findAll error:', (error as Error).message);
      throw new InternalServerErrorException('Failed to fetch general collections');
    }
  }

  async findOne(id: string): Promise<GeneralCollectionModelSelect> {
    if (id == null) throw new NotFoundException('No collection found');

    try {
      const db = await this.dbService.getDb();

      const [collection] = await db
        .select(GENERAL_COLLECTION_DEFAULT_SELECT)
        .from(generalCollectionModel)
        .where(eq(generalCollectionModel.id, id))
        .limit(1);

      if (!collection) throw new NotFoundException('No collection found');
      return collection;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch general collection');
    }
  }

  async update(id: string, updateGeneralCollectionDto: UpdateGeneralCollectionDto) {
    if (id == null) throw new NotFoundException('No collection found');

    try {
      const db = await this.dbService.getDb();

      const [updatedCollection] = await db
        .update(generalCollectionModel)
        .set(updateGeneralCollectionDto)
        .where(eq(generalCollectionModel.id, id))
        .returning();

      if (!updatedCollection) throw new NotFoundException('No collection found');

      return updatedCollection;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to update general collection');
    }
  }

  async remove(id: string) {
    if (id == null) throw new NotFoundException('No collection found');
    try {
      const db = await this.dbService.getDb();

      const [deletedCollection] = await db
        .delete(generalCollectionModel)
        .where(eq(generalCollectionModel.id, id))
        .returning();

      if (!deletedCollection) throw new NotFoundException('No collection found');
      return deletedCollection;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to delete general collection');
    }
  }
}
