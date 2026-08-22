'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { AttendanceCard } from '@/components/employee/AttendanceCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, Filter } from 'lucide-react';
import { mockEmployeeDashboardData } from '@/lib/mock/dashboardData';

export default function EmployeeAttendancePage() {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const logs = mockEmployeeDashboardData.recentAttendance;

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      <DashboardHeader
        title="Attendance & Work Logs"
        description="Daily check-in / check-out records, punctuality status, and monthly shift tracking."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Action & Summary */}
        <div className="lg:col-span-1">
          <AttendanceCard
            isCheckedIn={isCheckedIn}
            onCheckIn={() => setIsCheckedIn(true)}
            onCheckOut={() => setIsCheckedIn(false)}
          />
        </div>

        {/* Attendance Log Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarCheck className="w-4 h-4 text-purple-400" />
                Monthly Shift History (August 2026)
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5 text-purple-400" /> All Shifts
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="text-[11px] text-slate-400 uppercase border-b border-white/[0.06] bg-white/[0.02]">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Check In</th>
                      <th className="py-2.5 px-3">Check Out</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-100">{log.date}</td>
                        <td className="py-3 px-3 text-slate-300">{log.inTime}</td>
                        <td className="py-3 px-3 text-slate-300">{log.outTime}</td>
                        <td className="py-3 px-3 text-slate-400 font-mono text-xs">{log.duration}</td>
                        <td className="py-3 px-3 text-right">
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
