import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';

import { CreateDestinationDto, UpdateDestinationDto } from './dto';
import * as schema from '@models/index';
import { Destination } from '@modules/destination/entities/destination.entity';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { eq } from 'drizzle-orm';
import { DbService } from '@modules/db/db.service';

@Injectable({ scope: Scope.REQUEST })
export class DestinationService {
  constructor(private dbService: DbService) {}
  async create(
    createDestinationDto: CreateDestinationDto,
    userId: string,
  ): Promise<Destination> {
    try {
      const db = await this.dbService.getDb();
      const [newDestination] = await db
        .insert(schema.destinationModel)
        .values({ ...createDestinationDto, userId })
        .returning();

      return newDestination as Destination;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to create destination');
    }
  }

  async findAll(pagination: PaginationDto): Promise<Destination[]> {
    try {
      const db = await this.dbService.getDb();
      return (await db
        .select()
        .from(schema.destinationModel)
        .limit(pagination.limit ?? 10)
        .offset(pagination.offset ?? 0)) as Destination[];
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch destinations');
    }
  }

  async findAllByTrip(
    tripId: number,
    pagination: PaginationDto,
  ): Promise<Destination[]> {
    try {
      const db = await this.dbService.getDb();
      return (await db
        .select()
        .from(schema.destinationModel)
        .where(eq(schema.destinationModel.tripId, tripId))
        .limit(pagination.limit ?? 10)
        .offset(pagination.offset ?? 0)) as Destination[];
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to fetch destinations for the trip',
      );
    }
  }

  async findOne(id: number): Promise<Destination> {
    try {
      const db = await this.dbService.getDb();
      const destination = await db.query.destinationModel.findFirst({
        where: eq(schema.destinationModel.id, id),
      });

      if (!destination) {
        throw new NotFoundException('Destination not found');
      }

      return destination as Destination;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch destination');
    }
  }

  async update(
    id: number,
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<Destination> {
    try {
      const db = await this.dbService.getDb();
      const [updatedDestination] = await db
        .update(schema.destinationModel)
        .set({ ...updateDestinationDto, updatedAt: new Date().toISOString() })
        .where(eq(schema.destinationModel.id, id))
        .returning();

      if (!updatedDestination) {
        throw new NotFoundException('Destination not found');
      }

      return updatedDestination as Destination;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to update destination');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const db = await this.dbService.getDb();
      const [deletedDestination] = await db
        .delete(schema.destinationModel)
        .where(eq(schema.destinationModel.id, id))
        .returning();

      if (!deletedDestination) {
        throw new NotFoundException('Destination not found');
      }

      return { message: 'Destination deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to delete destination');
    }
  }
}