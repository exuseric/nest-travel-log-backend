import { Module } from '@nestjs/common';
import { GeneralCollectionService } from './general-collection.service';
import { GeneralCollectionController } from './general-collection.controller';

@Module({
  controllers: [GeneralCollectionController],
  providers: [GeneralCollectionService],
})
export class GeneralCollectionModule { }
