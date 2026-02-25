import { TRIP_DEFAULT_SELECT } from '@app/data/constants';
import { TripModelSelect } from '@app/data/types';
import { SelectTripDto } from '@app/modules/trip/dto/select-trip.dto';
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
import { tripModel } from 'src/data/models';
import { Trip } from 'src/shared/types/model.types';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable({ scope: Scope.REQUEST })
export class TripService {
  constructor(private dbService: DBService) {}

  async create(userId: string, createTripDto: CreateTripDto) {
    try {
      const db = await this.dbService.getDb();
      console.log('TripService.create - userId param:', userId);

      const [newTrip] = await db
        .insert(tripModel)
        .values({ ...createTripDto })
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

  async findAll(paginationDto: PaginationDto): Promise<SelectTripDto[]> {
    try {
      const db = await this.dbService.getDb();
      return await db
        .select(TRIP_DEFAULT_SELECT)
        .from(tripModel)
        .limit(paginationDto.limit ?? 10)
        .offset(paginationDto.offset ?? 0);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('findAll error:', (error as Error).message);
      throw new InternalServerErrorException('Failed to fetch trips');
    }
  }

  async findOne(id: Trip['id']): Promise<TripModelSelect> {
    if (id == null) throw new NotFoundException('No trip found');

    try {
      const db = await this.dbService.getDb();

      const [trip] = await db
        .select(TRIP_DEFAULT_SELECT)
        .from(tripModel)
        .where(eq(tripModel.id, id))
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
        .update(tripModel)
        .set(updateTripDto)
        .where(eq(tripModel.id, id))
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
        .delete(tripModel)
        .where(eq(tripModel.id, id))
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
