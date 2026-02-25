import { DestinationModelInsert } from '@app/data/types';
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

export class CreateDestinationDto implements DestinationModelInsert {
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
