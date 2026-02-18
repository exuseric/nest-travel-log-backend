import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONN } from 'src/db/db';
import * as schema from 'src/db/schema';
import { Trip } from 'src/db/types';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripService {
  constructor(
    @Inject(DB_CONN) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createTripDto: CreateTripDto) {
    try {
      const [newTrip] = await this.db
        .insert(schema.trip)
        .values(createTripDto)
        .returning();
      if (!newTrip)
        throw new InternalServerErrorException('Failed to create trip');
      return newTrip;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to create trip');
    }
  }

  async findAll() {
    try {
      const trips = await this.db.select().from(schema.trip);
      if (!trips.length) throw new NotFoundException('No trips found');
      return trips;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('findAll error:', error?.message);
      throw new InternalServerErrorException('Failed to fetch trips');
    }
  }

  async findOne(id: Trip['id']) {
    if (!id) throw new NotFoundException('No trip found');

    const [trip] = await this.db
      .select()
      .from(schema.trip)
      .where(eq(schema.trip.id, id))
      .limit(1);

    if (!trip) throw new NotFoundException('No trip found');
    return trip;
  }

  async update(id: Trip['id'], updateTripDto: UpdateTripDto) {
    if (!id) throw new BadRequestException('Trip ID is required');

    try {
      const [updatedTrip] = await this.db
        .update(schema.trip)
        .set(updateTripDto)
        .where(eq(schema.trip.id, id))
        .returning();

      if (!updatedTrip) throw new NotFoundException('No trip found');

      return updatedTrip;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException('No trip found');
    }
  }

  async remove(id: Trip['id']) {
    if (!id) throw new BadRequestException('Trip ID is required');
    try {
      const [deletedTrip] = await this.db
        .delete(schema.trip)
        .where(eq(schema.trip.id, id))
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
