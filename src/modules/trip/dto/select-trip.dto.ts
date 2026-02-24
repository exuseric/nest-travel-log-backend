import { TripModelSelect } from '@app/data/types';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SelectTripDto implements TripModelSelect {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsString()
  @IsOptional()
  country: string | null;

  @IsString()
  @IsOptional()
  startDate: string | null;

  @IsString()
  @IsOptional()
  endDate: string | null;

  @IsString()
  @IsOptional()
  coverImage: string | null;

  @IsOptional()
  @IsArray()
  gallery: string[] | null;

  @IsString()
  @IsOptional()
  createdAt: string | null;

  @IsString()
  @IsOptional()
  updatedAt: string | null;

  @IsBoolean()
  @IsOptional()
  isFavorite: boolean | null;

  @IsBoolean()
  @IsOptional()
  isPublic: boolean | null;
}
