import { Injectable } from '@nestjs/common';
import { CreateTravelDetailDto } from './dto/create-travel-detail.dto';
import { UpdateTravelDetailDto } from './dto/update-travel-detail.dto';

@Injectable()
export class TravelDetailService {
  create(createTravelDetailDto: CreateTravelDetailDto) {
    return 'This action adds a new travelDetail';
  }

  findAll() {
    return `This action returns all travelDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} travelDetail`;
  }

  update(id: number, updateTravelDetailDto: UpdateTravelDetailDto) {
    return `This action updates a #${id} travelDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} travelDetail`;
  }
}
