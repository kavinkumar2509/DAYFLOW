import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { AttendanceFilterDto } from './dto/attendance-filter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@dayflow/shared-types';

@ApiTags('Admin - Attendance Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/attendance')
export class AdminAttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiOperation({ summary: 'ADMIN ONLY: View all employee attendance records with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Attendance logs retrieved.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  async getAllAttendance(@Query() filter: AttendanceFilterDto) {
    return this.attendanceService.getAllAttendance(filter);
  }

  @Get(':employeeId')
  @ApiOperation({ summary: 'ADMIN ONLY: View specific employee attendance history' })
  @ApiResponse({ status: 200, description: 'Employee attendance records.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  async getEmployeeAttendance(
    @Param('employeeId') employeeId: string,
    @Query() filter: AttendanceFilterDto,
  ) {
    return this.attendanceService.getEmployeeAttendanceById(employeeId, filter);
  }
}
