import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VerifyAadhaarDto {
  @ApiPropertyOptional({ example: 'sarah.connor@dayflow.com', description: 'User email (optional if authenticated with JWT)' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '554433221100', description: '12-digit Aadhaar number or e-KYC reference token' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{12}$|^(\d{4}[-\s]?){3}$/, {
    message: 'Aadhaar number must be a valid 12-digit numerical string or formatted 4-4-4 format.',
  })
  aadhaarNumber: string;

  @ApiPropertyOptional({ example: '123456', description: '6-digit OTP for e-KYC validation (mock: any 6-digit number or default 123456)' })
  @IsString()
  @IsOptional()
  otp?: string;

  @ApiProperty({ example: true, description: 'Explicit user consent for Aadhaar e-KYC verification' })
  @IsBoolean()
  @IsNotEmpty()
  consent: boolean;
}
