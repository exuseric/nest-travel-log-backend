import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TravelDetailService } from './travel-detail.service';
import { CreateTravelDetailDto } from './dto/create-travel-detail.dto';
import { UpdateTravelDetailDto } from './dto/update-travel-detail.dto';

@ApiTags('Travel Details')
@Controller('travel-detail')
export class TravelDetailController {
  constructor(private readonly travelDetailService: TravelDetailService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new travel detail' })
  create(@Body() createTravelDetailDto: CreateTravelDetailDto) {
    return this.travelDetailService.create(createTravelDetailDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all travel details' })
  findAll() {
    return this.travelDetailService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a travel detail by ID' })
  findOne(@Param('id') id: string) {
    return this.travelDetailService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a travel detail' })
  update(
    @Param('id') id: string,
    @Body() updateTravelDetailDto: UpdateTravelDetailDto,
  ) {
    return this.travelDetailService.update(+id, updateTravelDetailDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a travel detail' })
  remove(@Param('id') id: string) {
    return this.travelDetailService.remove(+id);
  }
}
