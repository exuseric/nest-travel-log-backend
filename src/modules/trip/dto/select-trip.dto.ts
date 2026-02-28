import { TripModelSelect } from '@app/data/types';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  county: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  startDate: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  endDate: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  coverImage: string | null;

  @IsArray()
  @ApiProperty()
  gallery: string[];

  @IsString()
  @IsOptional()
  @ApiProperty()
  createdAt: string;

  @IsString()
  @ApiProperty()
  updatedAt: string;

  @IsBoolean()
  @ApiProperty()
  isFavorite: boolean;

  @IsBoolean()
  @ApiProperty()
  isPublic: boolean;

  @IsBoolean()
  @ApiProperty()
  isArchived: boolean;
}
