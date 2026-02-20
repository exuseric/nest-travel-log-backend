import { PartialType } from '@nestjs/mapped-types';
import { CreateTravelDetailDto } from './create-travel-detail.dto';

export class UpdateTravelDetailDto extends PartialType(CreateTravelDetailDto) {}
