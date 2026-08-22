import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceReportSummary, AttendanceStatus, PayrollReportSummary, PayrollStatus, Role } from '@dayflow/shared-types';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * ADMIN: Aggregate attendance analytics report
   */
  async getAttendanceReport(from?: string, to?: string): Promise<AttendanceReportSummary> {
    const today = new Date();
    const startDate = from ? new Date(from) : new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = to ? new Date(to) : new Date();

    const totalEmployees = await this.prisma.user.count({
      where: { role: Role.EMPLOYEE, isActive: true },
    });

    const attendances = await this.prisma.attendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    let totalPresent = 0;
    let totalAbsent = 0;
    let totalHalfDay = 0;
    let totalLeave = 0;

    for (const record of attendances) {
      if (record.status === AttendanceStatus.PRESENT) totalPresent++;
      else if (record.status === AttendanceStatus.ABSENT) totalAbsent++;
      else if (record.status === AttendanceStatus.HALF_DAY) totalHalfDay++;
      else if (record.status === AttendanceStatus.LEAVE) totalLeave++;
    }

    const totalRecords = attendances.length;
    const effectivePresent = totalPresent + (totalHalfDay * 0.5);
    const averageAttendanceRate = totalRecords > 0 ? Number(((effectivePresent / totalRecords) * 100).toFixed(2)) : 100.0;

    return {
      totalEmployees,
      totalPresent,
      totalAbsent,
      totalHalfDay,
      totalLeave,
      averageAttendanceRate,
      period: {
        from: startDate.toISOString().split('T')[0],
        to: endDate.toISOString().split('T')[0],
      },
    };
  }

  /**
   * ADMIN: Aggregate payroll expenses analytics report
   */
  async getPayrollReport(month?: number, year?: number): Promise<PayrollReportSummary> {
    const today = new Date();
    const queryMonth = month || today.getMonth() + 1;
    const queryYear = year || today.getFullYear();

    const payrolls = await this.prisma.payroll.findMany({
      where: {
        month: queryMonth,
        year: queryYear,
      },
    });

    let totalBaseSalaries = 0;
    let totalAllowances = 0;
    let totalDeductions = 0;
    let totalNetDisbursed = 0;
    let totalEmployeesPaid = 0;

    for (const record of payrolls) {
      totalBaseSalaries += Number(record.baseSalary);
      totalAllowances += Number(record.allowances);
      totalDeductions += Number(record.deductions);
      totalNetDisbursed += Number(record.netSalary);
      if (record.status === PayrollStatus.PAID) {
        totalEmployeesPaid++;
      }
    }

    return {
      totalEmployeesPaid,
      totalBaseSalaries,
      totalAllowances,
      totalDeductions,
      totalNetDisbursed,
      month: queryMonth,
      year: queryYear,
    };
  }
}
