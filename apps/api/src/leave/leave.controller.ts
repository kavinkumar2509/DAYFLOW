import { Controller, Post, Get, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { LeaveQueryDto } from './dto/leave-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserSummary } from '@dayflow/shared-types';

@ApiTags('Leave Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @ApiOperation({ summary: 'Employee apply for leave' })
  @ApiResponse({ status: 201, description: 'Leave application submitted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid date range.' })
  @ApiResponse({ status: 409, description: 'Overlapping active leave exists.' })
  async createLeave(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateLeaveDto,
  ) {
    return this.leaveService.createLeave(userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'View current authenticated employee leave history' })
  @ApiResponse({ status: 200, description: 'Paginated leave requests.' })
  async getOwnLeaves(
    @CurrentUser('id') userId: string,
    @Query() query: LeaveQueryDto,
  ) {
    return this.leaveService.getOwnLeaves(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'View specific leave request by ID (Owner or Admin)' })
  @ApiResponse({ status: 200, description: 'Leave request details.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot view another employee leave request.' })
  @ApiResponse({ status: 404, description: 'Leave request not found.' })
  async getLeaveById(
    @Param('id') id: string,
    @CurrentUser() user: UserSummary,
  ) {
    return this.leaveService.getLeaveById(id, user);
  }
}
