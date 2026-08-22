'use client';

import React from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { PayrollCard } from '@/components/employee/PayrollCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, FileSpreadsheet } from 'lucide-react';

export default function EmployeePayrollPage() {
  const slips = [
    { month: 'July 2026', gross: '₹85,000', net: '₹76,500', pf: '₹5,400', tax: '₹3,100', status: 'PAID' },
    { month: 'June 2026', gross: '₹85,000', net: '₹76,500', pf: '₹5,400', tax: '₹3,100', status: 'PAID' },
    { month: 'May 2026', gross: '₹85,000', net: '₹76,500', pf: '₹5,400', tax: '₹3,100', status: 'PAID' },
    { month: 'April 2026', gross: '₹85,000', net: '₹76,500', pf: '₹5,400', tax: '₹3,100', status: 'PAID' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      <DashboardHeader
        title="Payroll & Compensation"
        description="Access monthly salary payslips, view tax deductions, and track annual earnings."
        action={
          <Button variant="outline" size="sm" onClick={() => alert('Downloading Annual IT Statement Form 16')}>
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-purple-400" /> Annual Tax Statement
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Salary Card */}
        <div className="lg:col-span-1">
          <PayrollCard onDownloadSlip={() => alert('Downloading salary slip PDF for July 2026')} />
        </div>

        {/* Salary History Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="w-4 h-4 text-purple-400" />
                Payslip History (FY 2026-27)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="text-[11px] text-slate-400 uppercase border-b border-white/[0.06] bg-white/[0.02]">
                    <tr>
                      <th className="py-2.5 px-3">Cycle</th>
                      <th className="py-2.5 px-3">Gross</th>
                      <th className="py-2.5 px-3">Deductions</th>
                      <th className="py-2.5 px-3">Net Pay</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Slip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {slips.map((slip, i) => (
                      <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-100">{slip.month}</td>
                        <td className="py-3 px-3 text-slate-300">{slip.gross}</td>
                        <td className="py-3 px-3 text-rose-400 text-xs">{slip.pf} + {slip.tax}</td>
                        <td className="py-3 px-3 font-semibold text-slate-100">{slip.net}</td>
                        <td className="py-3 px-3">
                          <Badge variant="success">{slip.status}</Badge>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => alert(`Downloading payslip for ${slip.month}`)}
                            className="text-xs text-purple-400 hover:text-purple-300"
                          >
                            <Download className="w-3.5 h-3.5 mr-1" /> PDF
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
