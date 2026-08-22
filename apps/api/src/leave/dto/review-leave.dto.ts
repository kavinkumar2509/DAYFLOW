import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewLeaveDto {
  @ApiPropertyOptional({ example: 'Approved. Please ensure handoff of active tasks before taking leave.', description: 'Admin comments/remarks' })
  @IsString()
  @IsOptional()
  adminRemarks?: string;
}
