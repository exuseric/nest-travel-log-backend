import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONN } from 'src/data/db';
import * as schema from 'src/data/models';
import { Trip } from 'src/shared/types/model.types';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { PaginationDto } from '@shared/dto/pagination.dto';

@Injectable()
export class TripService {
  constructor(
    @Inject(DB_CONN) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(userId: string, createTripDto: CreateTripDto) {
    try {
      const [newTrip] = await this.db
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
      return await this.db
        .select()
        .from(schema.tripModel)
        .limit(paginationDto.limit ?? 10)
        .offset(paginationDto.offset ?? 20);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('findAll error:', (error as Error).message);
      throw new InternalServerErrorException('Failed to fetch trips');
    }
  }

  async findOne(id: Trip['id']): Promise<Trip> {
    if (id == null) throw new NotFoundException('No trip found');

    try {
      const [trip] = await this.db
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
      const [updatedTrip] = await this.db
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
      const [deletedTrip] = await this.db
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