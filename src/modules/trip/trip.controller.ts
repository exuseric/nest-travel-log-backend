import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@shared/dto/pagination.dto';
import type { Request } from 'express';
import { ClerkGuard } from 'src/guards/clerk/clerk.guard';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripService } from './trip.service';

@ApiTags('Trips')
@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @UseGuards(ClerkGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new trip' })
  create(@Req() req: Request, @Body() createTripDto: CreateTripDto) {
    const userId = req.auth?.userId;
    if (!userId) throw new UnauthorizedException();
    console.log(userId);
    return this.tripService.create(userId, createTripDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trips' })
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    paginationDto: PaginationDto,
  ) {
    return this.tripService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a trip by ID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tripService.findOne(id);
  }

  @UseGuards(ClerkGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a trip' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    return this.tripService.update(id, updateTripDto);
  }

  @UseGuards(ClerkGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a trip' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tripService.remove(id);
  }
}
