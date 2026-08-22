import { Module } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { AdminLeaveController } from './admin-leave.controller';

@Module({
  controllers: [LeaveController, AdminLeaveController],
  providers: [LeaveService],
  exports: [LeaveService],
})
export class LeaveModule {}
