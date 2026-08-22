import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@dayflow/shared-types';

export class UserQueryDto {
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

  @ApiPropertyOptional({ example: 'Kavin', description: 'Search term for name, email, or employeeId' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'Engineering', description: 'Filter by department' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ enum: Role, description: 'Filter by Role' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
