import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PayrollStatus } from '@dayflow/shared-types';

export class PayrollQueryDto {
  @ApiPropertyOptional({ example: 8, description: 'Filter by month (1-12)' })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  @Type(() => Number)
  month?: number;

  @ApiPropertyOptional({ example: 2026, description: 'Filter by year' })
  @IsInt()
  @Min(2020)
  @IsOptional()
  @Type(() => Number)
  year?: number;

  @ApiPropertyOptional({ enum: PayrollStatus, description: 'Filter by payroll status' })
  @IsEnum(PayrollStatus)
  @IsOptional()
  status?: PayrollStatus;

  @ApiPropertyOptional({ example: 'EMP001', description: 'Filter by employee ID (Admin only)' })
  @IsString()
  @IsOptional()
  employeeId?: string;

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
