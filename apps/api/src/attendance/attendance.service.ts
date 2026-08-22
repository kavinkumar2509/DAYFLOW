import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { AttendanceFilterDto } from './dto/attendance-filter.dto';
import { AttendanceRecord, AttendanceStatus, PaginatedResponse } from '@dayflow/shared-types';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  private getTodayDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  private formatAttendance(record: any): AttendanceRecord {
    return {
      id: record.id,
      userId: record.userId,
      employeeId: record.user?.employeeId,
      employeeName: record.user?.profile
        ? `${record.user.profile.firstName} ${record.user.profile.lastName}`.trim()
        : undefined,
      date: record.date instanceof Date ? record.date.toISOString().split('T')[0] : record.date,
      checkIn: record.checkIn ? record.checkIn.toISOString() : undefined,
      checkOut: record.checkOut ? record.checkOut.toISOString() : undefined,
      status: record.status as AttendanceStatus,
      workHours: record.workHours !== null ? Number(record.workHours) : undefined,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  /**
   * Employee Check-In for current day
   */
  async checkIn(userId: string, dto: CheckInDto): Promise<AttendanceRecord> {
    const today = this.getTodayDate();
    const now = new Date();

    const existing = await this.prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      include: { user: { include: { profile: true } } },
    });

    if (existing && existing.checkIn) {
      throw new ConflictException('You have already checked in for today.');
    }

    const attendance = await this.prisma.attendance.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      create: {
        userId,
        date: today,
        checkIn: now,
        status: AttendanceStatus.PRESENT,
        remarks: dto.remarks || 'Checked in',
      },
      update: {
        checkIn: now,
        status: AttendanceStatus.PRESENT,
        ...(dto.remarks && { remarks: dto.remarks }),
      },
      include: { user: { include: { profile: true } } },
    });

    return this.formatAttendance(attendance);
  }

  /**
   * Employee Check-Out for current day
   */
  async checkOut(userId: string, dto: CheckOutDto): Promise<AttendanceRecord> {
    const today = this.getTodayDate();
    const now = new Date();

    const record = await this.prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      include: { user: { include: { profile: true } } },
    });

    if (!record || !record.checkIn) {
      throw new BadRequestException('No check-in record found for today. Please check in first.');
    }

    if (record.checkOut) {
      throw new BadRequestException('You have already checked out for today.');
    }

    // Calculate total hours
    const durationMs = now.getTime() - record.checkIn.getTime();
    const hours = Math.max(0, Number((durationMs / (1000 * 60 * 60)).toFixed(2)));

    // Status logic based on duration
    let status = record.status;
    if (hours < 4.0) {
      status = AttendanceStatus.HALF_DAY;
    } else {
      status = AttendanceStatus.PRESENT;
    }

    const updated = await this.prisma.attendance.update({
      where: { id: record.id },
      data: {
        checkOut: now,
        workHours: hours,
        status,
        remarks: dto.remarks ? `${record.remarks || ''} | ${dto.remarks}`.trim() : record.remarks,
      },
      include: { user: { include: { profile: true } } },
    });

    return this.formatAttendance(updated);
  }

  /**
   * Employee: View own attendance history
   */
  async getOwnAttendance(userId: string, filter: AttendanceFilterDto): Promise<AttendanceRecord[]> {
    const where: any = { userId };

    if (filter.from || filter.to) {
      where.date = {};
      if (filter.from) {
        where.date.gte = new Date(filter.from);
      }
      if (filter.to) {
        where.date.lte = new Date(filter.to);
      }
    }

    if (filter.status) {
      where.status = filter.status;
    }

    const records = await this.prisma.attendance.findMany({
      where,
      include: { user: { include: { profile: true } } },
      orderBy: { date: 'desc' },
      take: filter.limit ? Number(filter.limit) : 50,
    });

    return records.map((r) => this.formatAttendance(r));
  }

  /**
   * ADMIN: View attendance across all employees
   */
  async getAllAttendance(filter: AttendanceFilterDto): Promise<PaginatedResponse<AttendanceRecord>> {
    const page = Number(filter.page) || 1;
    const limit = Number(filter.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filter.from || filter.to) {
      where.date = {};
      if (filter.from) {
        where.date.gte = new Date(filter.from);
      }
      if (filter.to) {
        where.date.lte = new Date(filter.to);
      }
    }

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.employeeId) {
      where.user = {
        employeeId: { contains: filter.employeeId.trim(), mode: 'insensitive' },
      };
    }

    const [total, records] = await Promise.all([
      this.prisma.attendance.count({ where }),
      this.prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        include: { user: { include: { profile: true } } },
        orderBy: { date: 'desc' },
      }),
    ]);

    return {
      items: records.map((r) => this.formatAttendance(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * ADMIN: View attendance for a specific employee
   */
  async getEmployeeAttendanceById(
    employeeIdOrUserId: string,
    filter: AttendanceFilterDto,
  ): Promise<AttendanceRecord[]> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ id: employeeIdOrUserId }, { employeeId: employeeIdOrUserId.toUpperCase() }],
      },
    });

    if (!user) {
      throw new NotFoundException(`Employee record "${employeeIdOrUserId}" not found.`);
    }

    return this.getOwnAttendance(user.id, filter);
  }
}
