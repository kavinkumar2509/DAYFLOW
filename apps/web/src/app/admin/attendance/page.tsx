'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Clock, Users, AlertCircle } from 'lucide-react';

export default function AdminAttendancePage() {
  const [search, setSearch] = useState('');

  const attendanceLogs = [
    { id: '1', emp: 'Adithya R', empId: 'EMP-001', dept: 'Engineering', checkIn: '09:15 AM', checkOut: '--', status: 'PRESENT' as const },
    { id: '2', emp: 'Sneha Patel', empId: 'EMP-002', dept: 'Product Design', checkIn: '09:02 AM', checkOut: '06:15 PM', status: 'PRESENT' as const },
    { id: '3', emp: 'Rahul Verma', empId: 'EMP-014', dept: 'Engineering', checkIn: '--', checkOut: '--', status: 'ON_LEAVE' as const },
    { id: '4', emp: 'Karthik Nair', empId: 'EMP-003', dept: 'HR', checkIn: '09:48 AM', checkOut: '--', status: 'LATE' as const },
    { id: '5', emp: 'Pooja Sharma', empId: 'EMP-028', dept: 'Marketing', checkIn: '08:55 AM', checkOut: '05:45 PM', status: 'PRESENT' as const },
    { id: '6', emp: 'Vikram Roy', empId: 'EMP-033', dept: 'Engineering', checkIn: '09:10 AM', checkOut: '--', status: 'PRESENT' as const },
  ];

  const filteredLogs = attendanceLogs.filter(
    (log) =>
      log.emp.toLowerCase().includes(search.toLowerCase()) ||
      log.empId.toLowerCase().includes(search.toLowerCase()) ||
      log.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      <DashboardHeader
        title="Live Attendance Monitoring"
        description="Real-time check-in status, attendance rates by department, and punctuality audit logs."
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 shadow-xs shadow-emerald-500/10">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-light">Present Today</div>
            <div className="text-xl font-bold text-slate-100">119 / 128 (93%)</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-950/40 text-amber-400 border border-amber-500/20 shadow-xs shadow-amber-500/10">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-light">Late Arrivals</div>
            <div className="text-xl font-bold text-amber-400">4 Employees</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-950/40 text-purple-400 border border-purple-500/20 shadow-xs shadow-purple-500/10">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-light">On Approved Leave</div>
            <div className="text-xl font-bold text-purple-400">9 Employees</div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base">Daily Punch Log (August 22, 2026)</CardTitle>
          <div className="w-full sm:w-64 relative">
            <Input
              type="text"
              placeholder="Search by name, ID, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs py-1.5 pl-8"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="text-[11px] text-slate-400 uppercase border-b border-white/[0.06] bg-white/[0.02]">
                <tr>
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Check In</th>
                  <th className="py-2.5 px-3">Check Out</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-100">{log.emp}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{log.empId}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{log.dept}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-xs">{log.checkIn}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-xs">{log.checkOut}</td>
                    <td className="py-3 px-3 text-right">
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
