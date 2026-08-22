import React from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { AttendanceCard } from '@/components/employee/AttendanceCard';
import { LeaveCard } from '@/components/employee/LeaveCard';
import { PayrollCard } from '@/components/employee/PayrollCard';

export default function EmployeeDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Employee Dashboard"
        description="Welcome back, Adithya. Here is your daily workplace overview."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AttendanceCard />
        <LeaveCard />
        <PayrollCard />
      </div>
    </div>
  );
}
