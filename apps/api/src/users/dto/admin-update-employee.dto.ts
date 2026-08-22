import { IsBoolean, IsDateString, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@dayflow/shared-types';

export class AdminUpdateEmployeeDto {
  @ApiPropertyOptional({ example: 'kavin.lead@dayflow.com', description: 'Updated Email Address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ enum: Role, description: 'Updated User Role' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ example: true, description: 'Account Active Status' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'Kavin', description: 'First Name' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Prabhu', description: 'Last Name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: '+91 9876543211', description: 'Contact Phone Number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '12 Cyber Street, Silicon Oasis, Bangalore', description: 'Address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400', description: 'Avatar URL' })
  @IsString()
  @IsOptional()
  profilePictureUrl?: string;

  @ApiPropertyOptional({ example: 'Engineering', description: 'Assigned Department' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: 'Lead Backend Architect', description: 'Designation' })
  @IsString()
  @IsOptional()
  designation?: string;

  @ApiPropertyOptional({ example: '2023-03-01T00:00:00.000Z', description: 'Date of Joining' })
  @IsDateString()
  @IsOptional()
  dateOfJoining?: string;
}
