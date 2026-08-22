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
    {
      id: 'pr-4',
      employeeId: 'EMP-014',
      employeeName: 'Rahul Verma',
      department: 'Backend Engineering',
      month: 'August 2026',
      breakdown: { grossSalary: 88000, totalDeductions: 8800, netSalary: 79200 } as any,
      status: 'PAID',
    },
  ],
  onProcessIndividual,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-xl">
      <table className="w-full text-left text-xs sm:text-sm text-slate-300">
        <thead className="bg-white/[0.03] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
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
        <tbody className="divide-y divide-white/[0.04]">
          {records.map((rec) => (
            <tr key={rec.id} className="hover:bg-white/[0.03] transition-colors">
              <td className="px-4 py-3.5">
                <div className="font-medium text-slate-100">{rec.employeeName}</div>
                <div className="text-[11px] text-slate-500 font-mono">{rec.employeeId}</div>
              </td>
              <td className="px-4 py-3.5 text-xs text-slate-400 font-light">{rec.month}</td>
              <td className="px-4 py-3.5 font-medium text-slate-200">₹{rec.breakdown?.grossSalary?.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3.5 text-rose-400 font-mono text-xs">-₹{rec.breakdown?.totalDeductions?.toLocaleString('en-IN')}</td>
              <td className="px-4 py-3.5 font-bold text-slate-100">
                ₹{rec.breakdown?.netSalary?.toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-3.5">
                <Badge
                  variant={
                    rec.status === 'PAID' ? 'success' : rec.status === 'PROCESSING' ? 'warning' : 'default'
                  }
                >
                  {rec.status}
                </Badge>
              </td>
              <td className="px-4 py-3.5 text-right">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-2.5 text-purple-400 hover:text-purple-300"
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
