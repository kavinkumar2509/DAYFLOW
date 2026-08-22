'use client';

import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { AttendanceCard } from '@/components/employee/AttendanceCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { attendanceApi } from '@/lib/api/attendance';
import type { AttendanceRecord, AttendanceSummary } from '@/types/attendance';

export default function EmployeeAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary>({
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    leaveDays: 0,
    totalWorkingDays: 0,
  });
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadAttendance = async () => {
    setIsLoading(true);
    setActionMessage(null);
    try {
      const list = await attendanceApi.getEmployeeAttendance({ limit: 30 });
      setRecords(list);

      // Compute today's status
      const todayStr = new Date().toISOString().split('T')[0];
      const todayRecord = list.find((r) => r.date === todayStr);
      setIsCheckedIn(!!todayRecord?.checkIn && !todayRecord?.checkOut);

      // Summary
      const sum = await attendanceApi.getAttendanceSummary();
      setSummary(sum);
    } catch (err: any) {
      console.error('Error fetching attendance records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleCheckIn = async () => {
    setActionMessage(null);
    try {
      const record = await attendanceApi.checkIn({ notes: 'Web portal check-in' });
      setIsCheckedIn(true);
      setActionMessage({ type: 'success', text: `Punch In recorded at ${record.checkIn || 'now'}` });
      await loadAttendance();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'You have already checked in for today.' });
    }
  };

  const handleCheckOut = async () => {
    setActionMessage(null);
    try {
      const record = await attendanceApi.checkOut({ notes: 'Web portal check-out' });
      setIsCheckedIn(false);
      setActionMessage({ type: 'success', text: `Punch Out recorded at ${record.checkOut || 'now'}. Work duration: ${record.totalHours || 0} hrs` });
      await loadAttendance();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'You have already checked out for today.' });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      <DashboardHeader
        title="Attendance & Work Logs"
        description="Daily check-in / check-out records, punctuality status, and monthly shift tracking from backend."
      />

      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{actionMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Action & Summary */}
        <div className="lg:col-span-1">
          <AttendanceCard
            summary={summary}
            isCheckedIn={isCheckedIn}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        </div>

        {/* Attendance Log Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarCheck className="w-4 h-4 text-purple-400" />
                Verified Attendance History Log
              </CardTitle>
              <button
                onClick={loadAttendance}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
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
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                          Loading attendance records...
                        </td>
                      </tr>
                    ) : records.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                          No attendance records found. Click "Check In Now" above to log today.
                        </td>
                      </tr>
                    ) : (
                      records.map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-3 px-3 font-medium text-slate-100 font-mono">{log.date}</td>
                          <td className="py-3 px-3 text-emerald-400 font-mono">{log.checkIn || '—'}</td>
                          <td className="py-3 px-3 text-rose-400 font-mono">{log.checkOut || '—'}</td>
                          <td className="py-3 px-3 text-slate-300 font-mono text-xs">
                            {log.totalHours !== undefined ? `${log.totalHours} hrs` : log.checkIn && !log.checkOut ? 'Active' : '—'}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Badge
                              variant={
                                log.status === 'PRESENT'
                                  ? 'success'
                                  : log.status === 'HALF_DAY'
                                  ? 'warning'
                                  : 'danger'
                              }
                            >
                              {log.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
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
