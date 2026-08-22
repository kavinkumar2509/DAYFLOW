import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Payroll')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('me')
  @ApiOperation({ summary: 'Employee: View own payroll and salary slip history (READ-ONLY)' })
  @ApiResponse({ status: 200, description: 'List of payroll disbursement records.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getOwnPayroll(@CurrentUser('id') userId: string) {
    return this.payrollService.getOwnPayroll(userId);
  }
}
