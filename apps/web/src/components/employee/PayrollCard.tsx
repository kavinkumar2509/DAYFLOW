import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PayrollRecord } from '@/types/payroll';

export interface PayrollCardProps {
  latestPayroll?: Partial<PayrollRecord>;
  onDownloadSlip?: () => void;
}

export const PayrollCard: React.FC<PayrollCardProps> = ({
  latestPayroll = {
    month: 'July 2026',
    status: 'PAID',
    breakdown: {
      grossSalary: 85000,
      totalDeductions: 8500,
      netSalary: 76500,
      basic: 45000,
      hra: 22500,
      specialAllowance: 17500,
      bonus: 0,
      pfDeduction: 5400,
      taxDeduction: 3100,
      otherDeductions: 0,
    },
  },
  onDownloadSlip,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Latest Salary Summary</CardTitle>
          <p className="text-xs text-slate-500">{latestPayroll.month}</p>
        </div>
        <Badge variant={latestPayroll.status === 'PAID' ? 'success' : 'warning'}>
          {latestPayroll.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Net Take-Home Salary</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            ₹{latestPayroll.breakdown?.netSalary?.toLocaleString('en-IN') || '0'}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Gross Earnings:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              ₹{latestPayroll.breakdown?.grossSalary?.toLocaleString('en-IN') || '0'}
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Deductions (PF + Tax):</span>
            <span className="font-semibold text-rose-600">
              -₹{latestPayroll.breakdown?.totalDeductions?.toLocaleString('en-IN') || '0'}
            </span>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={onDownloadSlip} className="w-full">
          Download Payslip PDF
        </Button>
      </CardContent>
    </Card>
  );
};
