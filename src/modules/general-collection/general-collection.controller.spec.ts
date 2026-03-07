import { Test, TestingModule } from '@nestjs/testing';
import { GeneralCollectionController } from './general-collection.controller';
import { GeneralCollectionService } from './general-collection.service';

describe('GeneralCollectionController', () => {
  let controller: GeneralCollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralCollectionController],
      providers: [GeneralCollectionService],
    }).compile();

    controller = module.get<GeneralCollectionController>(GeneralCollectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
