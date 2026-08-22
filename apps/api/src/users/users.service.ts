import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AdminUpdateEmployeeDto } from './dto/admin-update-employee.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { PaginatedResponse, UserDetails } from '@dayflow/shared-types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private sanitizeUser(user: any): UserDetails {
    const { passwordHash, ...sanitized } = user;
    return {
      ...sanitized,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : undefined,
      profile: user.profile
        ? {
            ...user.profile,
            createdAt: user.profile.createdAt.toISOString(),
            updatedAt: user.profile.updatedAt.toISOString(),
            dateOfJoining: user.profile.dateOfJoining
              ? user.profile.dateOfJoining.toISOString()
              : undefined,
          }
        : undefined,
    };
  }

  /**
   * Get authenticated employee's own profile
   */
  async getOwnProfile(userId: string): Promise<UserDetails> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        documents: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found.');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Update authenticated employee's own profile (restricted to phone, address, profilePictureUrl)
   */
  async updateOwnProfile(userId: string, dto: UpdateProfileDto): Promise<UserDetails> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User profile not found.');
    }

    const updatedProfile = await this.prisma.employeeProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        firstName: '',
        lastName: '',
        phone: dto.phone,
        address: dto.address,
        profilePictureUrl: dto.profilePictureUrl,
      },
      update: {
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.profilePictureUrl !== undefined && { profilePictureUrl: dto.profilePictureUrl }),
      },
    });

    const refreshedUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    return this.sanitizeUser(refreshedUser);
  }

  /**
   * ADMIN: List all employees with pagination and filters
   */
  async getAllEmployees(query: UserQueryDto): Promise<PaginatedResponse<UserDetails>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.role) {
      where.role = query.role;
    }

    if (query.department) {
      where.profile = {
        department: { contains: query.department, mode: 'insensitive' },
      };
    }

    if (query.search) {
      const search = query.search.trim();
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
        { profile: { firstName: { contains: search, mode: 'insensitive' } } },
        { profile: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: { profile: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items: users.map((u) => this.sanitizeUser(u)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * ADMIN: Get single employee by ID or employeeId
   */
  async getEmployeeById(idOrEmployeeId: string): Promise<UserDetails> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ id: idOrEmployeeId }, { employeeId: idOrEmployeeId.toUpperCase() }],
      },
      include: {
        profile: true,
        documents: true,
        payrolls: { take: 5, orderBy: { createdAt: 'desc' } },
        leaveRequests: { take: 5, orderBy: { createdAt: 'desc' } },
        attendances: { take: 10, orderBy: { date: 'desc' } },
      },
    });

    if (!user) {
      throw new NotFoundException(`Employee record not found for "${idOrEmployeeId}".`);
    }

    return this.sanitizeUser(user);
  }

  /**
   * ADMIN: Update any employee detail
   */
  async adminUpdateEmployee(id: string, dto: AdminUpdateEmployeeDto): Promise<UserDetails> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException(`Employee with ID "${id}" was not found.`);
    }

    if (dto.email && dto.email.toLowerCase() !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase().trim() },
      });
      if (existing) {
        throw new ConflictException('Email address is already in use by another account.');
      }
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.email && { email: dto.email.toLowerCase().trim() }),
        ...(dto.role && { role: dto.role }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });

    if (
      dto.firstName ||
      dto.lastName ||
      dto.phone !== undefined ||
      dto.address !== undefined ||
      dto.profilePictureUrl !== undefined ||
      dto.department !== undefined ||
      dto.designation !== undefined ||
      dto.dateOfJoining !== undefined
    ) {
      await this.prisma.employeeProfile.upsert({
        where: { userId: id },
        create: {
          userId: id,
          firstName: dto.firstName || '',
          lastName: dto.lastName || '',
          phone: dto.phone,
          address: dto.address,
          profilePictureUrl: dto.profilePictureUrl,
          department: dto.department,
          designation: dto.designation,
          dateOfJoining: dto.dateOfJoining ? new Date(dto.dateOfJoining) : new Date(),
        },
        update: {
          ...(dto.firstName && { firstName: dto.firstName }),
          ...(dto.lastName && { lastName: dto.lastName }),
          ...(dto.phone !== undefined && { phone: dto.phone }),
          ...(dto.address !== undefined && { address: dto.address }),
          ...(dto.profilePictureUrl !== undefined && { profilePictureUrl: dto.profilePictureUrl }),
          ...(dto.department !== undefined && { department: dto.department }),
          ...(dto.designation !== undefined && { designation: dto.designation }),
          ...(dto.dateOfJoining !== undefined && { dateOfJoining: new Date(dto.dateOfJoining) }),
        },
      });
    }

    const updatedUser = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    return this.sanitizeUser(updatedUser);
  }
}
