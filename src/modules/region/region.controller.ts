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
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { ClerkGuard } from 'src/guards/clerk/clerk.guard';
import { AdminGuard } from 'src/guards/clerk/admin.guard';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@ApiTags('Regions')
@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) { }

  @UseGuards(ClerkGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new region' })
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all regions' })
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    paginationDto: PaginationDto,
  ) {
    return this.regionService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a region by ID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.regionService.findOne(id);
  }

  @UseGuards(ClerkGuard, AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a region (Admin only)' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateRegionDto: UpdateRegionDto,
  ) {
    return this.regionService.update(id, updateRegionDto);
  }

  @UseGuards(ClerkGuard, AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a region (Admin only)' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.regionService.remove(id);
  }
}
