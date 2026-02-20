import { Test, TestingModule } from '@nestjs/testing';
import { TravelDetailController } from './travel-detail.controller';
import { TravelDetailService } from './travel-detail.service';

describe('TravelDetailController', () => {
  let controller: TravelDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelDetailController],
      providers: [TravelDetailService],
    }).compile();

    controller = module.get<TravelDetailController>(TravelDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
