'use client';

import React from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { PayrollTable } from '@/components/admin/PayrollTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminPayrollPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Payroll Administration"
        description="Run monthly salary cycles, review statutory PF/Tax deductions, and disburse payslips."
        action={
          <Button size="sm" onClick={() => alert('Starting August 2026 Payroll Cycle batch')}>
            + Process New Cycle
          </Button>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-xs text-slate-500 font-medium">Estimated Disbursal (Aug)</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">₹1,02,40,000</div>
          <div className="text-xs text-slate-400 mt-1">128 Employees</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500 font-medium">Statutory PF & TDS</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">₹12,80,000</div>
          <div className="text-xs text-emerald-600 mt-1">Compliant</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500 font-medium">Current Status</div>
          <div className="text-xl font-bold text-amber-600 mt-1">Draft Review</div>
          <div className="text-xs text-slate-400 mt-1">Awaiting final HR approval</div>
        </Card>
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Employee Compensation Breakdown
        </h2>
        <PayrollTable />
      </div>
    </div>
  );
}
