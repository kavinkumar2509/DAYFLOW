import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload, UserSummary, Role } from '@dayflow/shared-types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'dayflow-super-secure-hackathon-jwt-secret-key-2026'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserSummary> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub || payload.userId },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('User account not found or access revoked.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('This account has been deactivated. Please contact HR.');
    }

    return {
      id: user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role as unknown as Role,
      emailVerified: user.emailVerified,
      aadhaarVerified: user.aadhaarVerified,
      firstLoginCompleted: user.firstLoginCompleted,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
