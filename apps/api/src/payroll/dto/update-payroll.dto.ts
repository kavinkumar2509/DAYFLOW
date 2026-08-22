import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PayrollStatus } from '@dayflow/shared-types';

export class UpdatePayrollDto {
  @ApiPropertyOptional({ example: 125000, description: 'Base Monthly Salary' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  baseSalary?: number;

  @ApiPropertyOptional({ example: 18000, description: 'Allowances (HRA, Special, Travel)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  allowances?: number;

  @ApiPropertyOptional({ example: 6000, description: 'Deductions (Tax, PF, Insurance)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  deductions?: number;

  @ApiPropertyOptional({ enum: PayrollStatus, description: 'Payroll Disbursement Status' })
  @IsEnum(PayrollStatus)
  @IsOptional()
  status?: PayrollStatus;

  @ApiPropertyOptional({ example: '2026-08-30T00:00:00.000Z', description: 'Actual Date of Payment' })
  @IsDateString()
  @IsOptional()
  paymentDate?: string;

  @ApiPropertyOptional({ example: 'Annual performance revision adjustment', description: 'Admin Notes' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
