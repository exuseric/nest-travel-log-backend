import { PartialType } from '@nestjs/swagger';
import { CreateGeneralCollectionDto } from './create-general-collection.dto';

export class UpdateGeneralCollectionDto extends PartialType(CreateGeneralCollectionDto) {}
