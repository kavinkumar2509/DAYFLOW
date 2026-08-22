import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AdminUpdateEmployeeDto } from './dto/admin-update-employee.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@dayflow/shared-types';

@ApiTags('Admin - Employee Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/employees')
export class AdminEmployeesController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'ADMIN ONLY: List all employees with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated employee list.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  async getAllEmployees(@Query() query: UserQueryDto) {
    return this.usersService.getAllEmployees(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ADMIN ONLY: View individual employee details and history' })
  @ApiResponse({ status: 200, description: 'Employee details returned.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  async getEmployeeById(@Param('id') id: string) {
    return this.usersService.getEmployeeById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ADMIN ONLY: Update any employee profile, role, or status' })
  @ApiResponse({ status: 200, description: 'Employee updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  async adminUpdateEmployee(
    @Param('id') id: string,
    @Body() dto: AdminUpdateEmployeeDto,
  ) {
    return this.usersService.adminUpdateEmployee(id, dto);
  }
}
