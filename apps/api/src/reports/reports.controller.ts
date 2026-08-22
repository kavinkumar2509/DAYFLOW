import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@dayflow/shared-types';

@ApiTags('Admin - Analytics & Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('attendance')
  @ApiOperation({ summary: 'ADMIN ONLY: Get aggregated employee attendance statistics' })
  @ApiResponse({ status: 200, description: 'Attendance analytics summary.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  async getAttendanceReport(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.getAttendanceReport(from, to);
  }

  @Get('payroll')
  @ApiOperation({ summary: 'ADMIN ONLY: Get aggregated payroll expense report' })
  @ApiResponse({ status: 200, description: 'Payroll financial summary.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  async getPayrollReport(
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.reportsService.getPayrollReport(
      month ? Number(month) : undefined,
      year ? Number(year) : undefined,
    );
  }
}
