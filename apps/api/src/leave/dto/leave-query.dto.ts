import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LeaveStatus, LeaveType } from '@dayflow/shared-types';

export class LeaveQueryDto {
  @ApiPropertyOptional({ enum: LeaveStatus, description: 'Filter by leave status' })
  @IsEnum(LeaveStatus)
  @IsOptional()
  status?: LeaveStatus;

  @ApiPropertyOptional({ enum: LeaveType, description: 'Filter by leave type' })
  @IsEnum(LeaveType)
  @IsOptional()
  leaveType?: LeaveType;

  @ApiPropertyOptional({ example: 'EMP001', description: 'Filter by employee ID (Admin only)' })
  @IsString()
  @IsOptional()
  employeeId?: string;

  @ApiPropertyOptional({ example: '2026-08-01', description: 'Filter leaves starting on or after date' })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Filter leaves ending on or before date' })
  @IsDateString()
  @IsOptional()
  to?: string;

  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
