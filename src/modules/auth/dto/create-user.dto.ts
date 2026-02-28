import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The unique ID of the user (e.g., from Clerk)' })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The first name of the user' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The last name of the user' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'The email address of the user' })
  email: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    description: 'The URL of the user avatar image',
    required: false,
  })
  avatarUrl?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Whether the email is verified',
    default: false,
    required: false,
  })
  emailVerified?: boolean;
}
