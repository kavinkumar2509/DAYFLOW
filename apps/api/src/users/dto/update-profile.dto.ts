import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: '+91 9876543210', description: 'Updated mobile phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Flat 402, Sunshine Apartments, Indiranagar, Bangalore', description: 'Residential Address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400', description: 'Profile picture avatar URL' })
  @IsString()
  @IsOptional()
  profilePictureUrl?: string;
}
