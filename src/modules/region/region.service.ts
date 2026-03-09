import { REGION_DEFAULT_SELECT } from '@app/data/constants';
import { RegionModelSelect } from '@app/data/types';
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
import { regionModel } from 'src/data/models';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable({ scope: Scope.REQUEST })
export class RegionService {
  constructor(private dbService: DBService) {}

  async create(createRegionDto: CreateRegionDto) {
    try {
      const db = await this.dbService.getDb();

      const [newRegion] = await db
        .insert(regionModel)
        .values({ ...createRegionDto })
        .returning();

      if (!newRegion) {
        throw new InternalServerErrorException('Failed to create region');
      }
      return newRegion;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to create region');
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<RegionModelSelect[]> {
    try {
      const db = await this.dbService.getDb();
      return await db
        .select(REGION_DEFAULT_SELECT)
        .from(regionModel)
        .limit(paginationDto.limit ?? 10)
        .offset(paginationDto.offset ?? 0);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('findAll error:', (error as Error).message);
      throw new InternalServerErrorException('Failed to fetch regions');
    }
  }

  async findOne(id: string): Promise<RegionModelSelect> {
    if (id == null) throw new NotFoundException('No region found');

    try {
      const db = await this.dbService.getDb();

      const [region] = await db
        .select(REGION_DEFAULT_SELECT)
        .from(regionModel)
        .where(eq(regionModel.id, id))
        .limit(1);

      if (!region) throw new NotFoundException('No region found');
      return region;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch region');
    }
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    if (id == null) throw new NotFoundException('No region found');

    try {
      const db = await this.dbService.getDb();

      const [updatedRegion] = await db
        .update(regionModel)
        .set(updateRegionDto)
        .where(eq(regionModel.id, id))
        .returning();

      if (!updatedRegion) throw new NotFoundException('No region found');

      return updatedRegion;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to update region');
    }
  }

  async remove(id: string) {
    if (id == null) throw new NotFoundException('No region found');
    try {
      const db = await this.dbService.getDb();

      const [deletedRegion] = await db
        .delete(regionModel)
        .where(eq(regionModel.id, id))
        .returning();

      if (!deletedRegion) throw new NotFoundException('No region found');
      return deletedRegion;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to delete region');
    }
  }
}
