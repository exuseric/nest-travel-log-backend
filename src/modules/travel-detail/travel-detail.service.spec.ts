import { Test, TestingModule } from '@nestjs/testing';
import { TravelDetailService } from './travel-detail.service';

describe('TravelDetailService', () => {
  let service: TravelDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelDetailService],
    }).compile();

    service = module.get<TravelDetailService>(TravelDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
