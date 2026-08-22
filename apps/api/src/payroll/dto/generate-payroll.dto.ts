import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GeneratePayrollDto {
  @ApiProperty({ example: 8, description: 'Payroll Month (1-12)' })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  month: number;

  @ApiProperty({ example: 2026, description: 'Payroll Year' })
  @IsInt()
  @Min(2020)
  @IsNotEmpty()
  year: number;

  @ApiPropertyOptional({ example: ['EMP001', 'EMP002'], description: 'Optional list of user IDs or Employee IDs to generate for. If omitted, generates for all active employees.' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  employeeIds?: string[];
}
