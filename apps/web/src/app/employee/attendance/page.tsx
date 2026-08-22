'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { AttendanceCard } from '@/components/employee/AttendanceCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EmployeeAttendancePage() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const sampleLogs = [
    { date: '2026-08-22', inTime: '09:15 AM', outTime: '--', status: 'PRESENT' as const, hours: '3.5 hrs' },
    { date: '2026-08-21', inTime: '09:05 AM', outTime: '06:15 PM', status: 'PRESENT' as const, hours: '9.1 hrs' },
    { date: '2026-08-20', inTime: '09:42 AM', outTime: '06:30 PM', status: 'LATE' as const, hours: '8.8 hrs' },
    { date: '2026-08-19', inTime: '09:00 AM', outTime: '06:00 PM', status: 'PRESENT' as const, hours: '9.0 hrs' },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="My Attendance"
        description="Daily check-in, check-out, and monthly attendance log."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <AttendanceCard
            isCheckedIn={isCheckedIn}
            onCheckIn={() => setIsCheckedIn(true)}
            onCheckOut={() => setIsCheckedIn(false)}
          />
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-slate-500 uppercase border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-2">Date</th>
                      <th className="py-2">Check In</th>
                      <th className="py-2">Check Out</th>
                      <th className="py-2">Duration</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sampleLogs.map((log, i) => (
                      <tr key={i} className="text-slate-700 dark:text-slate-300">
                        <td className="py-3 font-medium">{log.date}</td>
                        <td className="py-3">{log.inTime}</td>
                        <td className="py-3">{log.outTime}</td>
                        <td className="py-3 text-slate-500">{log.hours}</td>
                        <td className="py-3">
                          <Badge variant={log.status === 'PRESENT' ? 'success' : 'warning'}>
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
      </div>
    </div>
  );
}
