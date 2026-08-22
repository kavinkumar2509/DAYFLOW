import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { AadhaarVerificationService } from './aadhaar-verification.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { VerifyAadhaarDto } from '../dto/verify-aadhaar.dto';
import { Role, UserSummary, AuthResult, JwtPayload } from '@dayflow/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly aadhaarService: AadhaarVerificationService,
  ) {}

  /**
   * Helper to format User entity into a safe UserSummary DTO (never leak passwordHash)
   */
  private formatUser(user: any): UserSummary {
    return {
      id: user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role as Role,
      emailVerified: user.emailVerified,
      aadhaarVerified: user.aadhaarVerified,
      firstLoginCompleted: user.firstLoginCompleted,
      isActive: user.isActive,
      createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
    };
  }

  /**
   * Generates a signed JWT for the authenticated user
   */
  private generateToken(user: any): string {
    const payload: JwtPayload = {
      sub: user.id,
      userId: user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role as Role,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Register a new Employee or Admin
   */
  async register(dto: RegisterDto): Promise<AuthResult> {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existingEmail) {
      throw new ConflictException('An account with this email address already exists.');
    }

    const existingEmpId = await this.prisma.user.findUnique({
      where: { employeeId: dto.employeeId.trim().toUpperCase() },
    });
    if (existingEmpId) {
      throw new ConflictException('An account with this Employee ID already exists.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        employeeId: dto.employeeId.trim().toUpperCase(),
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        role: dto.role || Role.EMPLOYEE,
        emailVerified: true,
        aadhaarVerified: false,
        firstLoginCompleted: false,
        isActive: true,
        profile: {
          create: {
            firstName: dto.firstName.trim(),
            lastName: dto.lastName.trim(),
            phone: dto.phone,
            department: dto.department,
            designation: dto.designation,
          },
        },
      },
      include: { profile: true },
    });

    const userSummary = this.formatUser(user);
    const accessToken = this.generateToken(user);

    return {
      user: userSummary,
      accessToken,
      requiresAadhaarVerification: !user.firstLoginCompleted,
      verificationSessionId: user.id,
    };
  }

  /**
   * Authenticate user with Email & Password.
   * Handles first-login Aadhaar KYC flag checks.
   */
  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('This account has been deactivated. Please contact HR.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const userSummary = this.formatUser(user);

    // If first login or Aadhaar verification is required
    if (!user.firstLoginCompleted || !user.aadhaarVerified) {
      return {
        user: userSummary,
        requiresAadhaarVerification: true,
        verificationSessionId: user.id,
      };
    }

    const accessToken = this.generateToken(user);

    return {
      user: userSummary,
      accessToken,
      requiresAadhaarVerification: false,
    };
  }

  /**
   * Completes First-Login Aadhaar e-KYC Verification.
   */
  async verifyAadhaar(
    dto: VerifyAadhaarDto,
    authenticatedUser?: UserSummary,
  ): Promise<AuthResult & { message: string }> {
    let user = null;

    if (authenticatedUser?.id) {
      user = await this.prisma.user.findUnique({
        where: { id: authenticatedUser.id },
        include: { profile: true },
      });
    } else if (dto.email) {
      user = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase().trim() },
        include: { profile: true },
      });
    }

    if (!user) {
      throw new NotFoundException('User for Aadhaar verification was not found.');
    }

    // Perform KYC validation through abstraction
    const kycResult = await this.aadhaarService.verifyAadhaar(
      dto.aadhaarNumber,
      dto.otp,
      dto.consent,
    );

    if (!kycResult.verified) {
      throw new BadRequestException('Aadhaar verification failed. Please verify your details.');
    }

    // Persist KYC log without raw Aadhaar number
    await this.prisma.aadhaarLog.create({
      data: {
        userId: user.id,
        transactionId: kycResult.transactionId,
        maskedAadhaar: kycResult.maskedAadhaar,
        provider: 'MOCK_AADHAAR_KYC',
      },
    });

    // Mark user verified and first login completed
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        aadhaarVerified: true,
        firstLoginCompleted: true,
      },
      include: { profile: true },
    });

    const accessToken = this.generateToken(updatedUser);
    const userSummary = this.formatUser(updatedUser);

    return {
      user: userSummary,
      accessToken,
      requiresAadhaarVerification: false,
      message: 'Aadhaar e-KYC verified successfully. First-time login completed.',
    };
  }

  /**
   * Verify User Email address
   */
  async verifyEmail(dto: VerifyEmailDto): Promise<{ success: boolean; message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new NotFoundException('User with the specified email was not found.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    return {
      success: true,
      message: 'Email address successfully verified.',
    };
  }

  /**
   * Get current authenticated user profile
   */
  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        documents: {
          select: {
            id: true,
            name: true,
            type: true,
            fileUrl: true,
            verificationStatus: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found.');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Logout user (client-side token removal + backend ack)
   */
  async logout(_userId: string) {
    return {
      message: 'Logged out successfully.',
    };
  }
}
