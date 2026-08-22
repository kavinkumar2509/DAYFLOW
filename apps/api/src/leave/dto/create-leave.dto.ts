import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeaveType } from '@dayflow/shared-types';

export class CreateLeaveDto {
  @ApiProperty({ enum: LeaveType, example: LeaveType.PAID, description: 'Type of leave (PAID, SICK, UNPAID)' })
  @IsEnum(LeaveType)
  @IsNotEmpty()
  leaveType: LeaveType;

  @ApiProperty({ example: '2026-09-01', description: 'Leave start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-09-03', description: 'Leave end date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ example: 'Attending annual engineering conference', description: 'Detailed reason for leave request' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
