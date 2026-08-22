import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AttendanceStatus } from '@dayflow/shared-types';

export class AttendanceFilterDto {
  @ApiPropertyOptional({ example: '2026-08-01', description: 'Start date filter (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({ example: '2026-08-31', description: 'End date filter (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  to?: string;

  @ApiPropertyOptional({ example: 'EMP001', description: 'Filter by employee ID (Admin only)' })
  @IsString()
  @IsOptional()
  employeeId?: string;

  @ApiPropertyOptional({ enum: AttendanceStatus, description: 'Filter by attendance status' })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: 'Items per page' })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}
