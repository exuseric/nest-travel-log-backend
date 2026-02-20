import type { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClerkGuard } from 'src/guards/clerk/clerk.guard';
import { ClerkSoftGuard } from 'src/guards/clerk/clerk.soft.guard';
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
    return this.tripService.create(userId!, createTripDto);
  }

  @UseGuards(ClerkSoftGuard)
  @Get()
  findAll() {
    return this.tripService.findAll();
  }

  @UseGuards(ClerkSoftGuard)
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
