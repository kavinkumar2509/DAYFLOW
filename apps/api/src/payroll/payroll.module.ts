import { Module } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { AdminPayrollController } from './admin-payroll.controller';

@Module({
  controllers: [PayrollController, AdminPayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
