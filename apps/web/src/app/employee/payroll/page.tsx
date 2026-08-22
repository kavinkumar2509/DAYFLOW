'use client';

import React from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { PayrollCard } from '@/components/employee/PayrollCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function EmployeePayrollPage() {
  const slips = [
    { month: 'July 2026', gross: '₹85,000', net: '₹76,500', status: 'PAID' },
    { month: 'June 2026', gross: '₹85,000', net: '₹76,500', status: 'PAID' },
    { month: 'May 2026', gross: '₹85,000', net: '₹76,500', status: 'PAID' },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="My Payroll & Compensation"
        description="View salary slips, tax deductions, and payment histories."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <PayrollCard />
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Salary Slip Archive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-slate-500 uppercase border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-2">Month</th>
                      <th className="py-2">Gross Salary</th>
                      <th className="py-2">Net Pay</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-right">Payslip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {slips.map((slip, i) => (
                      <tr key={i} className="text-slate-700 dark:text-slate-300">
                        <td className="py-3 font-medium">{slip.month}</td>
                        <td className="py-3">{slip.gross}</td>
                        <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">{slip.net}</td>
                        <td className="py-3">
                          <Badge variant="success">{slip.status}</Badge>
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="ghost" size="sm" className="text-xs text-indigo-600">
                            Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
