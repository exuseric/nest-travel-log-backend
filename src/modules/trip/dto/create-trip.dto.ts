import { TripModelInsert } from '@app/data/types';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTripDto implements TripModelInsert {
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
  city: string;
}
