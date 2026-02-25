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
import { PaginationDto } from '@shared/dto/pagination.dto';
import type { Request } from 'express';
import { ClerkGuard } from 'src/guards/clerk/clerk.guard';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripService } from './trip.service';

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @UseGuards(ClerkGuard)
  @Post()
  create(@Req() req: Request, @Body() createTripDto: CreateTripDto) {
    const userId = req.auth?.userId;
    if (!userId) throw new UnauthorizedException();
    console.log(userId);
    return this.tripService.create(userId, createTripDto);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    paginationDto: PaginationDto,
  ) {
    return this.tripService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(+id);
  }

  @UseGuards(ClerkGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripService.update(+id, updateTripDto);
  }

  @UseGuards(ClerkGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripService.remove(+id);
  }
}
