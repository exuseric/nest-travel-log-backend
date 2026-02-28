import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { ClerkGuard } from 'src/guards/clerk/clerk.guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@ApiTags('Bookmarks')
@ApiBearerAuth()
@Controller('bookmark')
@UseGuards(ClerkGuard)
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bookmark' })
  create(
    @Body(new ValidationPipe({ transform: true }))
    createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.create(createBookmarkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookmarks' })
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    paginationDto: PaginationDto,
  ) {
    return this.bookmarkService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bookmark by ID' })
  findOne(@Param('id') id: string) {
    return this.bookmarkService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bookmark' })
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.update(id, updateBookmarkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bookmark' })
  remove(@Param('id') id: string) {
    return this.bookmarkService.remove(id);
  }
}
