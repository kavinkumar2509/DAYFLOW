'use client';

import React from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EmployeeTable } from '@/components/admin/EmployeeTable';
import { ApprovalCard } from '@/components/admin/ApprovalCard';
import { PayrollTable } from '@/components/admin/PayrollTable';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Admin & HR Command Center"
        description="Monitor staff attendance, approve pending leaves, and manage organization payroll."
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs text-slate-500 font-medium">Total Employees</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">128</div>
          <div className="text-xs text-emerald-600 mt-1">+4 joined this month</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500 font-medium">Present Today</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">119 / 128</div>
          <div className="text-xs text-slate-400 mt-1">93% workforce on duty</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500 font-medium">Pending Approvals</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">6 Requests</div>
          <div className="text-xs text-amber-600/80 mt-1">Requires HR attention</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500 font-medium">Aug Payroll Status</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">In Processing</div>
          <div className="text-xs text-slate-400 mt-1">Target: Aug 31</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Employee Directory Snapshot
            </h2>
            <EmployeeTable />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Payroll Cycle Status
            </h2>
            <PayrollTable />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Pending Leave Approvals
          </h2>
          <ApprovalCard />
          <ApprovalCard
            request={{
              id: 'req-2',
              employeeName: 'Rahul Verma',
              employeeId: 'EMP-014',
              department: 'Backend Engineering',
              leaveType: 'SICK',
              startDate: '2026-08-23',
              endDate: '2026-08-24',
              totalDays: 2,
              reason: 'Viral fever, doctor advised rest.',
              status: 'PENDING',
            }}
          />
        </div>
      </div>
    </div>
  );
}
