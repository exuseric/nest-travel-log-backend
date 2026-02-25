import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { DestinationService } from './destination.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { ClerkGuard } from '@guards/clerk/clerk.guard';
import { PaginationDto } from '@shared/dto/pagination.dto';
import type { Request } from 'express';

@Controller('destinations')
export class DestinationController {
  constructor(private readonly destinationService: DestinationService) {}
  @UseGuards(ClerkGuard)
  @Post()
  create(
    @Body() createDestinationDto: CreateDestinationDto,
    @Req() req: Request,
  ) {
    const userId = req.auth?.userId;
    if (!userId) throw new UnauthorizedException('Unauthorized');

    return this.destinationService.create(createDestinationDto, userId);
  }
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) pagination: PaginationDto,
  ) {
    return this.destinationService.findAll(pagination);
  }

  @Get('trip/:tripId')
  findAllByTrip(
    @Param('tripId') tripId: string,
    @Query(new ValidationPipe({ transform: true })) pagination: PaginationDto,
  ) {
    return this.destinationService.findAllByTrip(+tripId, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.destinationService.findOne(+id);
  }

  @UseGuards(ClerkGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ) {
    return this.destinationService.update(+id, updateDestinationDto);
  }

  @UseGuards(ClerkGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.destinationService.remove(+id);
  }
}