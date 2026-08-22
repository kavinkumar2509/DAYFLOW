import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { GeneratePayrollDto } from './dto/generate-payroll.dto';
import { PayrollQueryDto } from './dto/payroll-query.dto';
import {
  PaginatedResponse,
  PayrollRecord,
  PayrollStatus,
  Role,
  SalarySlip,
  UserSummary,
} from '@dayflow/shared-types';

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {}

  private formatPayroll(record: any): PayrollRecord {
    return {
      id: record.id,
      userId: record.userId,
      employeeId: record.user?.employeeId,
      employeeName: record.user?.profile
        ? `${record.user.profile.firstName} ${record.user.profile.lastName}`.trim()
        : undefined,
      month: record.month,
      year: record.year,
      baseSalary: Number(record.baseSalary),
      allowances: Number(record.allowances),
      deductions: Number(record.deductions),
      netSalary: Number(record.netSalary),
      status: record.status as PayrollStatus,
      paymentDate: record.paymentDate ? record.paymentDate.toISOString() : undefined,
      remarks: record.remarks || undefined,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  /**
   * Employee: View own payroll history (READ-ONLY)
   */
  async getOwnPayroll(userId: string): Promise<PayrollRecord[]> {
    const records = await this.prisma.payroll.findMany({
      where: { userId },
      include: { user: { include: { profile: true } } },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    return records.map((r) => this.formatPayroll(r));
  }

  /**
   * ADMIN: View all payroll records across employees
   */
  async getAllPayroll(query: PayrollQueryDto): Promise<PaginatedResponse<PayrollRecord>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.month) {
      where.month = Number(query.month);
    }
    if (query.year) {
      where.year = Number(query.year);
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.employeeId) {
      where.user = {
        employeeId: { contains: query.employeeId.trim(), mode: 'insensitive' },
      };
    }

    const [total, records] = await Promise.all([
      this.prisma.payroll.count({ where }),
      this.prisma.payroll.findMany({
        where,
        skip,
        take: limit,
        include: { user: { include: { profile: true } } },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
      }),
    ]);

    return {
      items: records.map((r) => this.formatPayroll(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * ADMIN: View specific employee payroll records
   */
  async getEmployeePayroll(employeeIdOrUserId: string): Promise<PayrollRecord[]> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ id: employeeIdOrUserId }, { employeeId: employeeIdOrUserId.toUpperCase() }],
      },
    });

    if (!user) {
      throw new NotFoundException(`Employee "${employeeIdOrUserId}" not found.`);
    }

    return this.getOwnPayroll(user.id);
  }

  /**
   * ADMIN: Update salary structure / payroll entry for an employee
   */
  async updatePayroll(employeeIdOrUserId: string, dto: UpdatePayrollDto): Promise<PayrollRecord> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ id: employeeIdOrUserId }, { employeeId: employeeIdOrUserId.toUpperCase() }],
      },
    });

    if (!user) {
      throw new NotFoundException(`Employee "${employeeIdOrUserId}" not found.`);
    }

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Find current or latest payroll entry
    let record = await this.prisma.payroll.findFirst({
      where: { userId: user.id },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    const baseSalary = dto.baseSalary !== undefined ? dto.baseSalary : record ? record.baseSalary : 50000;
    const allowances = dto.allowances !== undefined ? dto.allowances : record ? record.allowances : 5000;
    const deductions = dto.deductions !== undefined ? dto.deductions : record ? record.deductions : 2000;
    const netSalary = baseSalary + allowances - deductions;

    if (!record) {
      record = await this.prisma.payroll.create({
        data: {
          userId: user.id,
          month: currentMonth,
          year: currentYear,
          baseSalary,
          allowances,
          deductions,
          netSalary,
          status: dto.status || PayrollStatus.GENERATED,
          paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : null,
          remarks: dto.remarks || 'Initial salary structure',
        },
      });
    } else {
      record = await this.prisma.payroll.update({
        where: { id: record.id },
        data: {
          baseSalary,
          allowances,
          deductions,
          netSalary,
          ...(dto.status && { status: dto.status }),
          ...(dto.paymentDate && { paymentDate: new Date(dto.paymentDate) }),
          ...(dto.remarks && { remarks: dto.remarks }),
        },
      });
    }

    const updated = await this.prisma.payroll.findUnique({
      where: { id: record.id },
      include: { user: { include: { profile: true } } },
    });

    return this.formatPayroll(updated);
  }

  /**
   * ADMIN: Bulk generate monthly payroll records
   */
  async generateMonthlyPayroll(dto: GeneratePayrollDto) {
    const where: any = { isActive: true, role: Role.EMPLOYEE };

    if (dto.employeeIds && dto.employeeIds.length > 0) {
      where.OR = [
        { id: { in: dto.employeeIds } },
        { employeeId: { in: dto.employeeIds.map((id) => id.toUpperCase()) } },
      ];
    }

    const employees = await this.prisma.user.findMany({
      where,
      include: {
        payrolls: {
          orderBy: [{ year: 'desc' }, { month: 'desc' }],
          take: 1,
        },
      },
    });

    let generatedCount = 0;

    for (const emp of employees) {
      const existing = await this.prisma.payroll.findUnique({
        where: {
          userId_month_year: {
            userId: emp.id,
            month: dto.month,
            year: dto.year,
          },
        },
      });

      if (!existing) {
        const lastPayroll = emp.payrolls[0];
        const baseSalary = lastPayroll ? lastPayroll.baseSalary : 60000;
        const allowances = lastPayroll ? lastPayroll.allowances : 10000;
        const deductions = lastPayroll ? lastPayroll.deductions : 3000;
        const netSalary = baseSalary + allowances - deductions;

        await this.prisma.payroll.create({
          data: {
            userId: emp.id,
            month: dto.month,
            year: dto.year,
            baseSalary,
            allowances,
            deductions,
            netSalary,
            status: PayrollStatus.GENERATED,
            remarks: `Automated payroll generation for ${dto.month}/${dto.year}`,
          },
        });
        generatedCount++;
      }
    }

    return {
      message: `Generated monthly payroll for ${generatedCount} employees.`,
      month: dto.month,
      year: dto.year,
      generatedCount,
    };
  }

  /**
   * Get formatted Salary Slip for an employee
   */
  async getSalarySlip(
    employeeIdOrUserId: string,
    month?: number,
    year?: number,
    requestingUser?: UserSummary,
  ): Promise<SalarySlip> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ id: employeeIdOrUserId }, { employeeId: employeeIdOrUserId.toUpperCase() }],
      },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException(`Employee "${employeeIdOrUserId}" not found.`);
    }

    if (requestingUser && requestingUser.role !== Role.ADMIN && user.id !== requestingUser.id) {
      throw new ForbiddenException('Access denied: You cannot view another employee salary slip.');
    }

    const today = new Date();
    const queryMonth = month || today.getMonth() + 1;
    const queryYear = year || today.getFullYear();

    let payroll = await this.prisma.payroll.findUnique({
      where: {
        userId_month_year: {
          userId: user.id,
          month: queryMonth,
          year: queryYear,
        },
      },
    });

    if (!payroll) {
      payroll = await this.prisma.payroll.findFirst({
        where: { userId: user.id },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
      });
    }

    if (!payroll) {
      throw new NotFoundException('No payroll records found to generate salary slip.');
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const payPeriod = `${monthNames[payroll.month - 1]} ${payroll.year}`;

    return {
      payrollId: payroll.id,
      employeeId: user.employeeId,
      employeeName: user.profile ? `${user.profile.firstName} ${user.profile.lastName}`.trim() : user.employeeId,
      department: user.profile?.department || 'General',
      designation: user.profile?.designation || 'Staff',
      month: payroll.month,
      year: payroll.year,
      payPeriod,
      baseSalary: payroll.baseSalary,
      allowances: payroll.allowances,
      deductions: payroll.deductions,
      netSalary: payroll.netSalary,
      paymentDate: payroll.paymentDate ? payroll.paymentDate.toISOString() : undefined,
      status: payroll.status as PayrollStatus,
    };
  }
}
