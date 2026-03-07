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
import { CreateGeneralCollectionDto } from './dto/create-general-collection.dto';
import { UpdateGeneralCollectionDto } from './dto/update-general-collection.dto';
import { GeneralCollectionService } from './general-collection.service';

@ApiTags('General Collections')
@Controller('general-collections')
export class GeneralCollectionController {
  constructor(private readonly generalCollectionService: GeneralCollectionService) {}

  @UseGuards(ClerkGuard, AdminGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new general collection (Admin only)' })
  create(@Body() createGeneralCollectionDto: CreateGeneralCollectionDto) {
    return this.generalCollectionService.create(createGeneralCollectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all general collections' })
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    paginationDto: PaginationDto,
  ) {
    return this.generalCollectionService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a general collection by ID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.generalCollectionService.findOne(id);
  }

  @UseGuards(ClerkGuard, AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a general collection (Admin only)' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateGeneralCollectionDto: UpdateGeneralCollectionDto,
  ) {
    return this.generalCollectionService.update(id, updateGeneralCollectionDto);
  }

  @UseGuards(ClerkGuard, AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a general collection (Admin only)' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.generalCollectionService.remove(id);
  }
}
