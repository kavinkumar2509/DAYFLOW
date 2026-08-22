import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CheckOutDto {
  @ApiPropertyOptional({ example: 'Completed today daily tasks and sprint review', description: 'Check-out summary / remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
