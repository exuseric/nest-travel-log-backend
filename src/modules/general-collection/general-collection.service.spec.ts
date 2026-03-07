import { Test, TestingModule } from '@nestjs/testing';
import { GeneralCollectionService } from './general-collection.service';

describe('GeneralCollectionService', () => {
  let service: GeneralCollectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneralCollectionService],
    }).compile();

    service = module.get<GeneralCollectionService>(GeneralCollectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
