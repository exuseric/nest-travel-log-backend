import { TravelDetailModelInsert } from '@app/data/types';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTravelDetailDto implements TravelDetailModelInsert {
  @IsUUID()
  @IsOptional()
  clientUuid?: string;

  @IsUUID()
  @IsNotEmpty()
  tripId: string;

  @IsUUID()
  @IsOptional()
  destinationId?: string;

  @IsString()
  @IsNotEmpty()
  detailType: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  arrivalTime?: string;

  @IsString()
  @IsOptional()
  departureTime?: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @IsString()
  @IsOptional()
  deletedAt?: string;

  @IsArray()
  @IsOptional()
  gallery?: string[];

  @IsNumber()
  @IsOptional()
  order?: number;
}
