import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CheckInDto {
  @ApiPropertyOptional({ example: 'Working from office', description: 'Optional check-in notes / remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
