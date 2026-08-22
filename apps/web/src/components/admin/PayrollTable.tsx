'use client';

import React from 'react';
import type { PayrollRecord } from '@/types/payroll';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface PayrollTableProps {
  records?: Partial<PayrollRecord>[];
  onProcessIndividual?: (id: string) => void;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({
  records = [
    {
      id: 'pr-1',
      employeeId: 'EMP-001',
      employeeName: 'Adithya R',
      department: 'Engineering',
      month: 'August 2026',
      breakdown: { grossSalary: 95000, totalDeductions: 9500, netSalary: 85500 } as any,
      status: 'PAID',
    },
    {
      id: 'pr-2',
      employeeId: 'EMP-002',
      employeeName: 'Sneha Patel',
      department: 'Product Design',
      month: 'August 2026',
      breakdown: { grossSalary: 82000, totalDeductions: 8200, netSalary: 73800 } as any,
      status: 'PROCESSING',
    },
    {
      id: 'pr-3',
      employeeId: 'EMP-003',
      employeeName: 'Karthik Nair',
      department: 'Human Resources',
      month: 'August 2026',
      breakdown: { grossSalary: 78000, totalDeductions: 7800, netSalary: 70200 } as any,
      status: 'DRAFT',
    },
  ],
  onProcessIndividual,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="px-4 py-3">Employee</th>
            <th className="px-4 py-3">Cycle</th>
            <th className="px-4 py-3">Gross</th>
            <th className="px-4 py-3">Deductions</th>
            <th className="px-4 py-3">Net Pay</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
          {records.map((rec) => (
            <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900 dark:text-slate-100">{rec.employeeName}</div>
                <div className="text-xs text-slate-400 font-mono">{rec.employeeId}</div>
              </td>
              <td className="px-4 py-3 text-xs">{rec.month}</td>
              <td className="px-4 py-3 font-medium">₹{rec.breakdown?.grossSalary?.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3 text-rose-500 font-medium">-₹{rec.breakdown?.totalDeductions?.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">
                ₹{rec.breakdown?.netSalary?.toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    rec.status === 'PAID' ? 'success' : rec.status === 'PROCESSING' ? 'warning' : 'default'
                  }
                >
                  {rec.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => rec.id && onProcessIndividual?.(rec.id)}
                >
                  Manage
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
