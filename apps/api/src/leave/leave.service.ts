import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { ReviewLeaveDto } from './dto/review-leave.dto';
import { LeaveQueryDto } from './dto/leave-query.dto';
import {
  LeaveRequestRecord,
  LeaveStatus,
  LeaveType,
  NotificationType,
  PaginatedResponse,
  Role,
  UserSummary,
} from '@dayflow/shared-types';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  private formatLeave(record: any): LeaveRequestRecord {
    const start = new Date(record.startDate);
    const end = new Date(record.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return {
      id: record.id,
      userId: record.userId,
      employeeId: record.user?.employeeId,
      employeeName: record.user?.profile
        ? `${record.user.profile.firstName} ${record.user.profile.lastName}`.trim()
        : undefined,
      leaveType: record.leaveType as LeaveType,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      daysCount,
      reason: record.reason,
      status: record.status as LeaveStatus,
      adminRemarks: record.adminRemarks || undefined,
      reviewedBy: record.reviewedBy?.profile
        ? `${record.reviewedBy.profile.firstName} ${record.reviewedBy.profile.lastName}`.trim()
        : record.reviewedById || undefined,
      reviewedAt: record.reviewedAt ? record.reviewedAt.toISOString() : undefined,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  /**
   * Employee: Apply for leave with date validation and overlap prevention
   */
  async createLeave(userId: string, dto: CreateLeaveDto): Promise<LeaveRequestRecord> {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (endDate < startDate) {
      throw new BadRequestException('Leave end date cannot be earlier than start date.');
    }

    // Check for overlapping active leaves (PENDING or APPROVED)
    const overlapping = await this.prisma.leaveRequest.findFirst({
      where: {
        userId,
        status: { in: [LeaveStatus.PENDING, LeaveStatus.APPROVED] },
        AND: [
          { startDate: { lte: endDate } },
          { endDate: { gte: startDate } },
        ],
      },
    });

    if (overlapping) {
      throw new ConflictException(
        'You already have an active leave request overlapping the requested date range.',
      );
    }

    const leave = await this.prisma.leaveRequest.create({
      data: {
        userId,
        leaveType: dto.leaveType,
        startDate,
        endDate,
        reason: dto.reason.trim(),
        status: LeaveStatus.PENDING,
      },
      include: {
        user: { include: { profile: true } },
      },
    });

    return this.formatLeave(leave);
  }

  /**
   * Employee: Get own leave applications
   */
  async getOwnLeaves(userId: string, query: LeaveQueryDto): Promise<PaginatedResponse<LeaveRequestRecord>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (query.status) {
      where.status = query.status;
    }
    if (query.leaveType) {
      where.leaveType = query.leaveType;
    }
    if (query.from || query.to) {
      if (query.from) {
        where.startDate = { gte: new Date(query.from) };
      }
      if (query.to) {
        where.endDate = { lte: new Date(query.to) };
      }
    }

    const [total, leaves] = await Promise.all([
      this.prisma.leaveRequest.count({ where }),
      this.prisma.leaveRequest.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { include: { profile: true } },
          reviewedBy: { include: { profile: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items: leaves.map((l) => this.formatLeave(l)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * View specific leave by ID (with ownership check)
   */
  async getLeaveById(id: string, currentUser: UserSummary): Promise<LeaveRequestRecord> {
    const leave = await this.prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        user: { include: { profile: true } },
        reviewedBy: { include: { profile: true } },
      },
    });

    if (!leave) {
      throw new NotFoundException(`Leave request with ID "${id}" was not found.`);
    }

    if (currentUser.role !== Role.ADMIN && leave.userId !== currentUser.id) {
      throw new ForbiddenException('Access denied: You do not have permission to view this leave request.');
    }

    return this.formatLeave(leave);
  }

  /**
   * ADMIN: View all employee leave applications
   */
  async getAllLeaves(query: LeaveQueryDto): Promise<PaginatedResponse<LeaveRequestRecord>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }
    if (query.leaveType) {
      where.leaveType = query.leaveType;
    }
    if (query.employeeId) {
      where.user = {
        employeeId: { contains: query.employeeId.trim(), mode: 'insensitive' },
      };
    }
    if (query.from || query.to) {
      if (query.from) {
        where.startDate = { gte: new Date(query.from) };
      }
      if (query.to) {
        where.endDate = { lte: new Date(query.to) };
      }
    }

    const [total, leaves] = await Promise.all([
      this.prisma.leaveRequest.count({ where }),
      this.prisma.leaveRequest.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { include: { profile: true } },
          reviewedBy: { include: { profile: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items: leaves.map((l) => this.formatLeave(l)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * ADMIN: Approve leave request
   */
  async approveLeave(id: string, adminId: string, dto: ReviewLeaveDto): Promise<LeaveRequestRecord> {
    const leave = await this.prisma.leaveRequest.findUnique({
      where: { id },
      include: { user: { include: { profile: true } } },
    });

    if (!leave) {
      throw new NotFoundException(`Leave request "${id}" not found.`);
    }

    const updated = await this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: LeaveStatus.APPROVED,
        adminRemarks: dto.adminRemarks,
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
      include: {
        user: { include: { profile: true } },
        reviewedBy: { include: { profile: true } },
      },
    });

    // Generate in-app notification for the employee
    await this.prisma.notification.create({
      data: {
        userId: leave.userId,
        title: 'Leave Request Approved',
        message: `Your ${leave.leaveType} leave request has been APPROVED by HR.`,
        type: NotificationType.LEAVE_STATUS,
        metadata: { leaveId: id, status: LeaveStatus.APPROVED },
      },
    });

    return this.formatLeave(updated);
  }

  /**
   * ADMIN: Reject leave request
   */
  async rejectLeave(id: string, adminId: string, dto: ReviewLeaveDto): Promise<LeaveRequestRecord> {
    const leave = await this.prisma.leaveRequest.findUnique({
      where: { id },
      include: { user: { include: { profile: true } } },
    });

    if (!leave) {
      throw new NotFoundException(`Leave request "${id}" not found.`);
    }

    const updated = await this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: LeaveStatus.REJECTED,
        adminRemarks: dto.adminRemarks,
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
      include: {
        user: { include: { profile: true } },
        reviewedBy: { include: { profile: true } },
      },
    });

    // Generate in-app notification for the employee
    await this.prisma.notification.create({
      data: {
        userId: leave.userId,
        title: 'Leave Request Rejected',
        message: `Your ${leave.leaveType} leave request has been REJECTED by HR.${dto.adminRemarks ? ' Reason: ' + dto.adminRemarks : ''}`,
        type: NotificationType.LEAVE_STATUS,
        metadata: { leaveId: id, status: LeaveStatus.REJECTED },
      },
    });

    return this.formatLeave(updated);
  }
}
