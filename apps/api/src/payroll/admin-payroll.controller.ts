import { Controller, Get, Patch, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { GeneratePayrollDto } from './dto/generate-payroll.dto';
import { PayrollQueryDto } from './dto/payroll-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@dayflow/shared-types';

@ApiTags('Admin - Payroll Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/payroll')
export class AdminPayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get()
  @ApiOperation({ summary: 'ADMIN ONLY: View all payroll records across employees with filters' })
  @ApiResponse({ status: 200, description: 'Paginated payroll records.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  async getAllPayroll(@Query() query: PayrollQueryDto) {
    return this.payrollService.getAllPayroll(query);
  }

  @Post('generate')
  @ApiOperation({ summary: 'ADMIN ONLY: Bulk generate monthly payroll records for employees' })
  @ApiResponse({ status: 201, description: 'Payroll generated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  async generateMonthlyPayroll(@Body() dto: GeneratePayrollDto) {
    return this.payrollService.generateMonthlyPayroll(dto);
  }

  @Get(':employeeId')
  @ApiOperation({ summary: 'ADMIN ONLY: View specific employee payroll records' })
  @ApiResponse({ status: 200, description: 'Employee payroll records.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  async getEmployeePayroll(@Param('employeeId') employeeId: string) {
    return this.payrollService.getEmployeePayroll(employeeId);
  }

  @Patch(':employeeId')
  @ApiOperation({ summary: 'ADMIN ONLY: Update salary structure and allowances for an employee' })
  @ApiResponse({ status: 200, description: 'Payroll updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  async updatePayroll(
    @Param('employeeId') employeeId: string,
    @Body() dto: UpdatePayrollDto,
  ) {
    return this.payrollService.updatePayroll(employeeId, dto);
  }

  @Get(':employeeId/slip')
  @ApiOperation({ summary: 'ADMIN ONLY: Generate formatted salary slip breakdown for an employee' })
  @ApiResponse({ status: 200, description: 'Salary slip details.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role.' })
  @ApiResponse({ status: 404, description: 'Employee or payroll not found.' })
  async getSalarySlip(
    @Param('employeeId') employeeId: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.payrollService.getSalarySlip(employeeId, month ? Number(month) : undefined, year ? Number(year) : undefined);
  }
}
