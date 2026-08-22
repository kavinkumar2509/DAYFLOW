import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { AttendanceFilterDto } from './dto/attendance-filter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Employee daily check-in' })
  @ApiResponse({ status: 201, description: 'Checked in successfully.' })
  @ApiResponse({ status: 409, description: 'Already checked in for today.' })
  async checkIn(
    @CurrentUser('id') userId: string,
    @Body() dto: CheckInDto,
  ) {
    return this.attendanceService.checkIn(userId, dto);
  }

  @Post('check-out')
  @ApiOperation({ summary: 'Employee daily check-out with automatic work duration calculation' })
  @ApiResponse({ status: 200, description: 'Checked out successfully.' })
  @ApiResponse({ status: 400, description: 'No check-in found or already checked out.' })
  async checkOut(
    @CurrentUser('id') userId: string,
    @Body() dto: CheckOutDto,
  ) {
    return this.attendanceService.checkOut(userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'View current authenticated employee attendance history' })
  @ApiResponse({ status: 200, description: 'Employee attendance records.' })
  async getOwnAttendance(
    @CurrentUser('id') userId: string,
    @Query() filter: AttendanceFilterDto,
  ) {
    return this.attendanceService.getOwnAttendance(userId, filter);
  }
}
