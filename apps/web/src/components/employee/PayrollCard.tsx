import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Download } from 'lucide-react';
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
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-400" />
            Compensation
          </CardTitle>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{latestPayroll.month}</p>
        </div>
        <Badge variant={latestPayroll.status === 'PAID' ? 'success' : 'warning'}>
          {latestPayroll.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-purple-950/20 rounded-xl border border-purple-500/20 shadow-xs shadow-purple-500/5">
          <div className="text-xs font-medium text-purple-400">Net Take-Home Salary</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1 tracking-tight">
            ₹{latestPayroll.breakdown?.netSalary?.toLocaleString('en-IN') || '0'}
          </div>
        </div>

        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-slate-400 font-light">
            <span>Gross Earnings:</span>
            <span className="font-medium text-slate-200">
              ₹{latestPayroll.breakdown?.grossSalary?.toLocaleString('en-IN') || '0'}
            </span>
          </div>
          <div className="flex justify-between text-slate-400 font-light">
            <span>Statutory Deductions (PF/Tax):</span>
            <span className="font-medium text-rose-400">
              -₹{latestPayroll.breakdown?.totalDeductions?.toLocaleString('en-IN') || '0'}
            </span>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={onDownloadSlip} className="w-full">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Download Payslip PDF
        </Button>
      </CardContent>
    </Card>
  );
};
