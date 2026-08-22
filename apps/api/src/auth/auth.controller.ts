import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyAadhaarDto } from './dto/verify-aadhaar.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserSummary } from '@dayflow/shared-types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new employee or admin account' })
  @ApiResponse({ status: 201, description: 'Account registered successfully.' })
  @ApiResponse({ status: 409, description: 'Email or Employee ID already registered.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful or Aadhaar verification required.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or inactive account.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('verify-aadhaar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete First-Login Aadhaar e-KYC Verification' })
  @ApiResponse({ status: 200, description: 'Aadhaar verified and full access token generated.' })
  @ApiResponse({ status: 400, description: 'Invalid Aadhaar format, OTP, or missing consent.' })
  async verifyAadhaar(
    @Body() dto: VerifyAadhaarDto,
    @CurrentUser() user?: UserSummary,
  ) {
    return this.authService.verifyAadhaar(dto, user);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile & permissions' })
  @ApiResponse({ status: 200, description: 'Current user profile details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized / Token invalid.' })
  async me(@CurrentUser('id') userId: string) {
    return this.authService.me(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout authenticated user session' })
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  async logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }
}
