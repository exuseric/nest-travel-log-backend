import { Module } from '@nestjs/common';
import { TravelDetailService } from './travel-detail.service';
import { TravelDetailController } from './travel-detail.controller';

@Module({
  controllers: [TravelDetailController],
  providers: [TravelDetailService],
})
export class TravelDetailModule {}
