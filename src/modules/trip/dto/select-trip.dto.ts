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
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  @IsOptional()
  county: string | null;

  @IsString()
  @IsOptional()
  startDate: string | null;

  @IsString()
  @IsOptional()
  endDate: string | null;

  @IsString()
  @IsOptional()
  coverImage: string | null;

  @IsArray()
  gallery: string[];

  @IsString()
  @IsOptional()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsBoolean()
  isFavorite: boolean;

  @IsBoolean()
  isPublic: boolean;

  @IsBoolean()
  isArchived: boolean;
}
