import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'sarah.connor@dayflow.com', description: 'Email address to mark as verified' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
