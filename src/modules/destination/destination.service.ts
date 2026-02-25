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
import { DBService } from '@modules/db/db.service';
import { DESTINATION_DEFAULT_SELECT } from 'src/data/constants';

@Injectable({ scope: Scope.REQUEST })
export class DestinationService {
  constructor(private dbService: DBService) {}
  async create(
    createDestinationDto: CreateDestinationDto,
    userId: string,
  ): Promise<Destination> {
    try {
      const db = await this.dbService.getDb();
      const [newDestination] = await db
        .insert(schema.destinationModel)
        .values({ ...createDestinationDto, userId })
        .returning(DESTINATION_DEFAULT_SELECT);

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
        .select(DESTINATION_DEFAULT_SELECT)
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
        .select(DESTINATION_DEFAULT_SELECT)
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
    if (id == null) throw new NotFoundException('No destination found');
    try {
      const db = await this.dbService.getDb();
      const [destination] = await db
        .select(DESTINATION_DEFAULT_SELECT)
        .from(schema.destinationModel)
        .where(eq(schema.destinationModel.id, id))
        .limit(1);

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
    if (id == null) throw new NotFoundException('No destination found');
    try {
      const db = await this.dbService.getDb();
      const [updatedDestination] = await db
        .update(schema.destinationModel)
        .set({ ...updateDestinationDto, updatedAt: new Date().toISOString() })
        .where(eq(schema.destinationModel.id, id))
        .returning(DESTINATION_DEFAULT_SELECT);

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

  async remove(id: number): Promise<{ success: boolean }> {
    if (id == null) throw new NotFoundException('No destination found');
    try {
      const db = await this.dbService.getDb();
      const [deletedDestination] = await db
        .delete(schema.destinationModel)
        .where(eq(schema.destinationModel.id, id))
        .returning(DESTINATION_DEFAULT_SELECT);

      if (!deletedDestination) {
        throw new NotFoundException('Destination not found');
      }

      return { success: true };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Failed to delete destination');
    }
  }
}
