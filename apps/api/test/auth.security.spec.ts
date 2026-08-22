import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../src/auth/services/auth.service';
import { AadhaarVerificationService } from '../src/auth/services/aadhaar-verification.service';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@dayflow/shared-types';
import * as bcrypt from 'bcrypt';

describe('DAYFLOW HRMS - Authentication & Security Test Suite', () => {
  let authService: AuthService;
  let aadhaarService: AadhaarVerificationService;
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  const mockAdminUser = {
    id: 'admin-uuid-001',
    employeeId: 'ADMIN001',
    email: 'admin@dayflow.com',
    passwordHash: bcrypt.hashSync('Admin@123', 10),
    role: 'ADMIN',
    emailVerified: true,
    aadhaarVerified: true,
    firstLoginCompleted: true,
    isActive: true,
    createdAt: new Date(),
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      department: 'HR',
    },
  };

  const mockEmployeeUser = {
    id: 'emp-uuid-001',
    employeeId: 'EMP001',
    email: 'kavin@dayflow.com',
    passwordHash: bcrypt.hashSync('Password@123', 10),
    role: 'EMPLOYEE',
    emailVerified: true,
    aadhaarVerified: true,
    firstLoginCompleted: true,
    isActive: true,
    createdAt: new Date(),
    profile: {
      firstName: 'Kavin',
      lastName: 'Prabhu',
      department: 'Engineering',
    },
  };

  const mockFirstLoginEmployee = {
    id: 'emp-uuid-002',
    employeeId: 'EMP002',
    email: 'sarah.connor@dayflow.com',
    passwordHash: bcrypt.hashSync('Password@123', 10),
    role: 'EMPLOYEE',
    emailVerified: true,
    aadhaarVerified: false,
    firstLoginCompleted: false, // Requires Aadhaar verification on first login!
    isActive: true,
    createdAt: new Date(),
    profile: {
      firstName: 'Sarah',
      lastName: 'Connor',
      department: 'Product',
    },
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    aadhaarLog: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        AadhaarVerificationService,
        RolesGuard,
        Reflector,
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked.jwt.access_token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              if (key === 'AADHAAR_PROVIDER_MODE') return 'mock';
              if (key === 'JWT_SECRET') return 'test-secret';
              return defaultValue;
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    aadhaarService = module.get<AadhaarVerificationService>(AadhaarVerificationService);
    rolesGuard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
    jest.clearAllMocks();
  });

  // TEST 1: Register employee
  it('1. Should register a new employee successfully', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);
    mockPrismaService.user.create.mockResolvedValue({
      id: 'new-emp-id',
      employeeId: 'EMP099',
      email: 'new.emp@dayflow.com',
      role: 'EMPLOYEE',
      emailVerified: true,
      aadhaarVerified: false,
      firstLoginCompleted: false,
      isActive: true,
      createdAt: new Date(),
      profile: { firstName: 'New', lastName: 'Emp' },
    });

    const result = await authService.register({
      employeeId: 'EMP099',
      email: 'new.emp@dayflow.com',
      password: 'Password@123',
      role: Role.EMPLOYEE,
      firstName: 'New',
      lastName: 'Emp',
    });

    expect(result.user.employeeId).toBe('EMP099');
    expect(result.requiresAadhaarVerification).toBe(true);
    expect(result.accessToken).toBeDefined();
  });

  // TEST 2: Login employee
  it('2. Should log in an active employee with completed first-login', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(mockEmployeeUser);

    const result = await authService.login({
      email: 'kavin@dayflow.com',
      password: 'Password@123',
    });

    expect(result.user.email).toBe('kavin@dayflow.com');
    expect(result.user.role).toBe(Role.EMPLOYEE);
    expect(result.requiresAadhaarVerification).toBe(false);
    expect(result.accessToken).toBe('mocked.jwt.access_token');
  });

  // TEST 3: Login admin
  it('3. Should log in an admin user', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(mockAdminUser);

    const result = await authService.login({
      email: 'admin@dayflow.com',
      password: 'Admin@123',
    });

    expect(result.user.email).toBe('admin@dayflow.com');
    expect(result.user.role).toBe(Role.ADMIN);
    expect(result.accessToken).toBeDefined();
  });

  // TEST 4: Invalid login
  it('4. Should reject invalid login credentials with UnauthorizedException', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(mockEmployeeUser);

    await expect(
      authService.login({
        email: 'kavin@dayflow.com',
        password: 'WrongPassword!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  // TEST 5 & 6: RolesGuard - Employee accessing admin endpoint -> 403
  it('5 & 6. RolesGuard should throw ForbiddenException when EMPLOYEE attempts to access ADMIN endpoint', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    const mockContext = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            id: 'emp-1',
            role: Role.EMPLOYEE, // Role is EMPLOYEE, required is ADMIN
          },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(() => rolesGuard.canActivate(mockContext)).toThrow(ForbiddenException);
  });

  // TEST 7 & 8: RolesGuard - Admin accessing admin endpoint -> Success
  it('7 & 8. RolesGuard should allow access when ADMIN accesses ADMIN endpoint', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    const mockContext = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            id: 'admin-1',
            role: Role.ADMIN,
          },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(rolesGuard.canActivate(mockContext)).toBe(true);
  });

  // TEST 9: First login requires Aadhaar verification
  it('9. Should flag that Aadhaar verification is required on first login', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(mockFirstLoginEmployee);

    const result = await authService.login({
      email: 'sarah.connor@dayflow.com',
      password: 'Password@123',
    });

    expect(result.requiresAadhaarVerification).toBe(true);
    expect(result.verificationSessionId).toBe(mockFirstLoginEmployee.id);
  });

  // TEST 10: Successful Aadhaar verification completes first login
  it('10. Should successfully verify Aadhaar, persist masked log, and complete first login', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(mockFirstLoginEmployee);
    mockPrismaService.aadhaarLog.create.mockResolvedValue({ id: 'log-1' });
    mockPrismaService.user.update.mockResolvedValue({
      ...mockFirstLoginEmployee,
      aadhaarVerified: true,
      firstLoginCompleted: true,
    });

    const result = await authService.verifyAadhaar({
      email: 'sarah.connor@dayflow.com',
      aadhaarNumber: '123456789012',
      otp: '123456',
      consent: true,
    });

    expect(result.user.aadhaarVerified).toBe(true);
    expect(result.user.firstLoginCompleted).toBe(true);
    expect(result.accessToken).toBe('mocked.jwt.access_token');
    expect(mockPrismaService.aadhaarLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          maskedAadhaar: 'XXXX-XXXX-9012',
        }),
      }),
    );
  });
});
