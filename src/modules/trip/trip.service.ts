import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import * as schema from 'src/data/models';
import { Trip } from 'src/shared/types/model.types';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { DbService } from '@modules/db/db.service';

@Injectable({ scope: Scope.REQUEST })
export class TripService {
  constructor(private dbService: DbService) {}

  async create(userId: string, createTripDto: CreateTripDto) {
    try {
      const db = await this.dbService.getDb(userId);
      console.log('TripService.create - userId param:', userId);
      const { rows: userIdFromDb } = await db.execute(
        sql`SELECT public.user_id() as current_db_user_id`,
      );
      console.log(
        'TripService.create - public.user_id() from DB:',
        userIdFromDb[0].current_db_user_id,
      );

      const [newTrip] = await db
        .insert(schema.tripModel)
        .values({ ...createTripDto, userId })
        .returning();

      if (!newTrip) {
        throw new InternalServerErrorException('Failed to create trip');
      }
      return newTrip;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to create trip');
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Trip[]> {
    try {
      const db = await this.dbService.getDb();
      return await db
        .select()
        .from(schema.tripModel)
        .limit(paginationDto.limit ?? 10)
        .offset(paginationDto.offset ?? 0);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('findAll error:', (error as Error).message);
      throw new InternalServerErrorException('Failed to fetch trips');
    }
  }

  async findOne(id: Trip['id']): Promise<Trip> {
    if (id == null) throw new NotFoundException('No trip found');

    try {
      const db = await this.dbService.getDb();

      const [trip] = await db
        .select()
        .from(schema.tripModel)
        .where(eq(schema.tripModel.id, id))
        .limit(1);

      if (!trip) throw new NotFoundException('No trip found');
      return trip;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch trip');
    }
  }

  async update(id: Trip['id'], updateTripDto: UpdateTripDto) {
    if (id == null) throw new NotFoundException('No trip found');

    try {
      const db = await this.dbService.getDb();

      const [updatedTrip] = await db
        .update(schema.tripModel)
        .set(updateTripDto)
        .where(eq(schema.tripModel.id, id))
        .returning();

      if (!updatedTrip) throw new NotFoundException('No trip found');

      return updatedTrip;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to update trip');
    }
  }

  async remove(id: Trip['id']) {
    if (id == null) throw new NotFoundException('No trip found');
    try {
      const db = await this.dbService.getDb();

      const [deletedTrip] = await db
        .delete(schema.tripModel)
        .where(eq(schema.tripModel.id, id))
        .returning();

      if (!deletedTrip) throw new NotFoundException('No trip found');
      return deletedTrip;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to delete trip');
    }
  }
}