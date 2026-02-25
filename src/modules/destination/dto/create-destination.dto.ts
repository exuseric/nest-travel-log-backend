import {
  IsArray,
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { CreateDestinationType } from '@shared/types/model.types';

export class CreateDestinationDto implements CreateDestinationType {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsLatitude()
  @IsOptional()
  latitude: number;

  @IsLongitude()
  @IsOptional()
  longitude: number;

  @IsString()
  @IsOptional()
  country?: string;

  @IsUrl()
  @IsOptional()
  coverImage?: string;

  @IsArray()
  @IsOptional()
  gallery?: string[];

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @IsString()
  @IsNotEmpty()
  tripId: string;

  @IsBoolean()
  @IsOptional()
  isVisited?: boolean;
}
