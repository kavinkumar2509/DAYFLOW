'use client';

import React from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { PayrollTable } from '@/components/admin/PayrollTable';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlayCircle, Download, CreditCard } from 'lucide-react';

export default function AdminPayrollPage() {
  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      <DashboardHeader
        title="Payroll Administration Hub"
        description="Run monthly salary cycles, review statutory PF & TDS deductions, and disburse employee payslips."
        action={
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" onClick={() => alert('Exporting payroll ledger report')}>
              <Download className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Export Ledger
            </Button>
            <Button size="sm" onClick={() => alert('Starting August 2026 Payroll Cycle run')}>
              <PlayCircle className="w-4 h-4 mr-1.5" /> Process August Cycle
            </Button>
          </div>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-[11px] text-slate-400 font-light">Estimated Disbursal (Aug)</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">₹1,02,40,000</div>
          <div className="text-xs text-slate-500 mt-1">128 Employees</div>
        </Card>
        <Card className="p-5">
          <div className="text-[11px] text-slate-400 font-light">Statutory PF & TDS</div>
          <div className="text-xl sm:text-2xl font-bold text-purple-400 mt-1">₹12,80,000</div>
          <div className="text-xs text-emerald-400 mt-1">✓ Statutory Compliant</div>
        </Card>
        <Card className="p-5">
          <div className="text-[11px] text-slate-400 font-light">Current Cycle Status</div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">Draft Review</div>
          <div className="text-xs text-slate-500 mt-1">Awaiting final sign-off</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="w-4 h-4 text-purple-400" />
            Staff Compensation Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PayrollTable onProcessIndividual={(id) => alert(`Managing individual payroll record ${id}`)} />
        </CardContent>
      </Card>
    </div>
  );
}
