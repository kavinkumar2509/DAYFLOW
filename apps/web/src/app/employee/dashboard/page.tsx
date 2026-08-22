'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Clock,
  CalendarDays,
  Sparkles,
  ArrowRight,
  LogIn,
  LogOut,
  PlusCircle,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { DashboardHeader, StatCard } from '@/components/shared';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { authApi } from '@/lib/api/auth';
import { attendanceApi } from '@/lib/api/attendance';
import { leaveApi } from '@/lib/api/leave';
import type { User } from '@/types/user';
import type { AttendanceRecord, AttendanceSummary } from '@/types/attendance';
import type { LeaveRequest } from '@/types/leave';

export default function EmployeeDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary>({
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    leaveDays: 0,
    totalWorkingDays: 0,
  });
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string>('--:--');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      const [currentUser, records, sum, leaves] = await Promise.all([
        authApi.getCurrentUser(),
        attendanceApi.getEmployeeAttendance({ limit: 5 }),
        attendanceApi.getAttendanceSummary(),
        leaveApi.getMyLeaveRequests(),
      ]);

      if (currentUser) setUser(currentUser);
      setAttendanceList(records);
      setSummary(sum);
      setLeaveHistory(leaves);

      const todayStr = new Date().toISOString().split('T')[0];
      const today = records.find((r) => r.date === todayStr);
      if (today && today.checkIn && !today.checkOut) {
        setIsCheckedIn(true);
        setCheckInTime(today.checkIn);
      } else {
        setIsCheckedIn(false);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAttendance = async () => {
    setActionMessage(null);
    try {
      if (isCheckedIn) {
        const res = await attendanceApi.checkOut();
        setIsCheckedIn(false);
        setActionMessage({ type: 'success', text: `Punch Out recorded at ${res.checkOut || 'now'}. Work duration: ${res.totalHours || 0} hrs` });
      } else {
        const res = await attendanceApi.checkIn();
        setIsCheckedIn(true);
        setCheckInTime(res.checkIn || 'now');
        setActionMessage({ type: 'success', text: `Punch In recorded at ${res.checkIn || 'now'}` });
      }
      await loadData();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Action failed.' });
    }
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'Employee';

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* Welcome Section with Futuristic Ambient Glow */}
      <DashboardHeader
        title={`Welcome back, ${displayName}`}
        description="Here's your real-time DAYFLOW workforce overview for today."
        action={
          <div className="flex items-center gap-2.5">
            <Button
              variant={isCheckedIn ? 'outline' : 'primary'}
              size="sm"
              onClick={handleToggleAttendance}
              className={isCheckedIn ? 'text-rose-400 border-rose-500/30 hover:bg-rose-950/30' : ''}
            >
              {isCheckedIn ? (
                <>
                  <LogOut className="w-3.5 h-3.5 mr-1.5" /> Check Out
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 mr-1.5" /> Check In Now
                </>
              )}
            </Button>
            <Link href="/employee/leave">
              <Button variant="secondary" size="sm">
                <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Apply Leave
              </Button>
            </Link>
          </div>
        }
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

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Attendance"
          value={isCheckedIn ? 'Checked In' : 'Not Punched'}
          subtitle={isCheckedIn ? `In at ${checkInTime}` : 'Check in to begin shift'}
          icon={CalendarCheck}
          accentColor="emerald"
          badge={{
            text: isCheckedIn ? 'Present' : 'Pending',
            variant: isCheckedIn ? 'success' : 'warning',
          }}
        />
        <StatCard
          title="Days Present"
          value={`${summary.presentDays} Days`}
          subtitle={`Total tracked shifts: ${summary.totalWorkingDays}`}
          icon={Clock}
          accentColor="purple"
          badge={{
            text: 'Verified',
            variant: 'info',
          }}
        />
        <StatCard
          title="Leave Requests"
          value={`${leaveHistory.length} Total`}
          subtitle={`Approved: ${leaveHistory.filter((l) => l.status === 'APPROVED').length} | Pending: ${leaveHistory.filter((l) => l.status === 'PENDING').length}`}
          icon={CalendarDays}
          accentColor="orange"
          badge={{
            text: 'Available',
            variant: 'success',
          }}
        />
        <StatCard
          title="Department"
          value={user?.department || 'Engineering'}
          subtitle={`${user?.designation || 'Staff'} • ${user?.employeeId || 'EMP'}`}
          icon={Sparkles}
          accentColor="purple"
          badge={{
            text: user?.role || 'EMPLOYEE',
            variant: 'info',
          }}
        />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#08080c]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:border-purple-500/30 transition-all flex items-center justify-between group">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
              Daily Attendance
            </h4>
            <p className="text-[11px] text-slate-400 font-light">Log work hours & review punch logs</p>
          </div>
          <Link href="/employee/attendance">
            <Button variant="outline" size="sm" className="text-xs h-8 px-3">
              View <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="p-4 bg-[#08080c]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:border-purple-500/30 transition-all flex items-center justify-between group">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
              Time Off & Leaves
            </h4>
            <p className="text-[11px] text-slate-400 font-light">Submit requests & track approvals</p>
          </div>
          <Link href="/employee/leave">
            <Button variant="outline" size="sm" className="text-xs h-8 px-3">
              Apply <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="p-4 bg-[#08080c]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:border-purple-500/30 transition-all flex items-center justify-between group">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
              Compensation & Slips
            </h4>
            <p className="text-[11px] text-slate-400 font-light">Download payslips & tax reports</p>
          </div>
          <Link href="/employee/payroll">
            <Button variant="outline" size="sm" className="text-xs h-8 px-3">
              Payslips <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Grid: Recent Attendance + Leave History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Attendance Activity Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Recent Attendance Activity
                </CardTitle>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">Verified punch records from PostgreSQL backend</p>
              </div>
              <Link href="/employee/attendance">
                <Button variant="ghost" size="sm" className="text-xs text-purple-400 hover:text-purple-300">
                  Full History <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
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
                    {attendanceList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                          No recent punch records found.
                        </td>
                      </tr>
                    ) : (
                      attendanceList.map((row) => (
                        <tr key={row.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-3 px-3 font-medium text-slate-100 font-mono">{row.date}</td>
                          <td className="py-3 px-3 text-emerald-400 font-mono">{row.checkIn || '—'}</td>
                          <td className="py-3 px-3 text-rose-400 font-mono">{row.checkOut || '—'}</td>
                          <td className="py-3 px-3 text-slate-300 font-mono text-xs">
                            {row.totalHours !== undefined ? `${row.totalHours} hrs` : row.checkIn && !row.checkOut ? 'Active' : '—'}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Badge variant={row.status === 'PRESENT' ? 'success' : row.status === 'HALF_DAY' ? 'warning' : 'danger'}>
                              {row.status}
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

        {/* Leave Status History */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-purple-400" />
                  Leave Status
                </CardTitle>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">Recent leave applications</p>
              </div>
              <Link href="/employee/leave">
                <Button variant="ghost" size="sm" className="text-xs text-purple-400 hover:text-purple-300">
                  New Request
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaveHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No active leave applications.
                </div>
              ) : (
                leaveHistory.slice(0, 4).map((leave) => (
                  <div
                    key={leave.id}
                    className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] space-y-1.5 hover:border-white/[0.12] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">
                        {leave.leaveType} ({leave.totalDays}d)
                      </span>
                      <Badge variant={leave.status === 'APPROVED' ? 'success' : leave.status === 'REJECTED' ? 'danger' : 'warning'}>
                        {leave.status}
                      </Badge>
                    </div>
                    <div className="text-[11.5px] text-slate-400 font-light">{leave.startDate} to {leave.endDate}</div>
                    <div className="text-[11px] text-slate-500 italic">"{leave.reason}"</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
