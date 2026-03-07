import { GeneralCollectionModelInsert } from '@app/data/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateGeneralCollectionDto implements GeneralCollectionModelInsert {
  @ApiProperty({ description: 'The name of the collection' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'The description of the collection' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'The cover image URL of the collection' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ description: 'The region ID associated with this collection' })
  @IsOptional()
  @IsUUID()
  regionId?: string;

  @ApiPropertyOptional({ description: 'Whether the collection is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
