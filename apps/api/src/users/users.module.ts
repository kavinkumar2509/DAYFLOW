import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AdminEmployeesController } from './admin-employees.controller';

@Module({
  controllers: [UsersController, AdminEmployeesController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
