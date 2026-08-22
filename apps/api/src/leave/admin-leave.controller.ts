import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LeaveService } from './leave.service';
import { ReviewLeaveDto } from './dto/review-leave.dto';
import { LeaveQueryDto } from './dto/leave-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@dayflow/shared-types';

@ApiTags('Admin - Leave Approvals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/leave')
export class AdminLeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get()
  @ApiOperation({ summary: 'ADMIN ONLY: View all employee leave applications with filters' })
  @ApiResponse({ status: 200, description: 'Paginated employee leave requests.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  async getAllLeaves(@Query() query: LeaveQueryDto) {
    return this.leaveService.getAllLeaves(query);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'ADMIN ONLY: Approve an employee leave request' })
  @ApiResponse({ status: 200, description: 'Leave approved and notification sent.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  @ApiResponse({ status: 404, description: 'Leave not found.' })
  async approveLeave(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body() dto: ReviewLeaveDto,
  ) {
    return this.leaveService.approveLeave(id, adminId, dto);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'ADMIN ONLY: Reject an employee leave request' })
  @ApiResponse({ status: 200, description: 'Leave rejected and notification sent.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  @ApiResponse({ status: 404, description: 'Leave not found.' })
  async rejectLeave(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body() dto: ReviewLeaveDto,
  ) {
    return this.leaveService.rejectLeave(id, adminId, dto);
  }
}
