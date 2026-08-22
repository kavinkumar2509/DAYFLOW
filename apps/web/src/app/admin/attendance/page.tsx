'use client';

import React from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function AdminAttendancePage() {
  const attendanceLogs = [
    { id: '1', emp: 'Adithya R', empId: 'EMP-001', dept: 'Engineering', checkIn: '09:15 AM', checkOut: '--', status: 'PRESENT' as const },
    { id: '2', emp: 'Sneha Patel', empId: 'EMP-002', dept: 'Product Design', checkIn: '09:02 AM', checkOut: '06:15 PM', status: 'PRESENT' as const },
    { id: '3', emp: 'Rahul Verma', empId: 'EMP-014', dept: 'Engineering', checkIn: '--', checkOut: '--', status: 'ON_LEAVE' as const },
    { id: '4', emp: 'Karthik Nair', empId: 'EMP-003', dept: 'HR', checkIn: '09:48 AM', checkOut: '--', status: 'LATE' as const },
    { id: '5', emp: 'Pooja Sharma', empId: 'EMP-028', dept: 'Marketing', checkIn: '08:55 AM', checkOut: '05:45 PM', status: 'PRESENT' as const },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Attendance Monitoring"
        description="Live daily check-in statuses, department shifts, and punctuality tracking."
      />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle>Today's Log (August 22, 2026)</CardTitle>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Filter by name or ID..."
              className="w-48 text-xs py-1"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500 uppercase border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Check In</th>
                  <th className="py-2.5 px-3">Check Out</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{log.emp}</div>
                      <div className="text-xs text-slate-400 font-mono">{log.empId}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{log.dept}</td>
                    <td className="py-3 px-3">{log.checkIn}</td>
                    <td className="py-3 px-3">{log.checkOut}</td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          log.status === 'PRESENT'
                            ? 'success'
                            : log.status === 'LATE'
                            ? 'warning'
                            : 'info'
                        }
                      >
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
