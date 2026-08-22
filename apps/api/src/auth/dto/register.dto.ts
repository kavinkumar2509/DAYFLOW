import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@dayflow/shared-types';

export class RegisterDto {
  @ApiProperty({ example: 'EMP005', description: 'Unique alphanumeric Employee ID' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ example: 'priya.sharma@dayflow.com', description: 'Corporate Email Address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'StrongPassword@123', description: 'Account Password (min 6 chars)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.EMPLOYEE, description: 'Role assigned to the user' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.EMPLOYEE;

  @ApiProperty({ example: 'Priya', description: 'First Name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Sharma', description: 'Last Name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: '+91 9876543219', description: 'Contact Phone Number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Engineering', description: 'Department' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: 'Software Engineer', description: 'Designation / Job Title' })
  @IsString()
  @IsOptional()
  designation?: string;
}
