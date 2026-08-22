'use client';

import React, { useState } from 'react';
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
  FileText,
  Activity,
} from 'lucide-react';
import { DashboardHeader, StatCard } from '@/components/shared';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  mockEmployeeProfile,
  mockEmployeeDashboardData,
} from '@/lib/mock/dashboardData';

export default function EmployeeDashboardPage() {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState(mockEmployeeDashboardData.attendanceToday.checkInTime);
  const data = mockEmployeeDashboardData;

  const handleToggleAttendance = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
    } else {
      setIsCheckedIn(true);
      const now = new Date();
      setCheckInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* Welcome Section with Futuristic Ambient Glow */}
      <DashboardHeader
        title={`Welcome back, ${mockEmployeeProfile.name.split(' ')[0]}`}
        description="Here's your DAYFLOW overview for today."
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

      {/* Summary KPI Cards with Login Theme Palettes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Attendance"
          value={isCheckedIn ? 'Checked In' : 'Not Checked In'}
          subtitle={isCheckedIn ? `In at ${checkInTime}` : 'Check in to start shift'}
          icon={CalendarCheck}
          accentColor="emerald"
          badge={{
            text: isCheckedIn ? 'Present' : 'Pending',
            variant: isCheckedIn ? 'success' : 'warning',
          }}
        />
        <StatCard
          title="Working Hours"
          value={data.attendanceToday.workDuration}
          subtitle={`Week total: ${data.attendanceToday.weeklyDuration}`}
          icon={Clock}
          accentColor="purple"
          badge={{
            text: 'On Schedule',
            variant: 'info',
          }}
        />
        <StatCard
          title="Leave Balance"
          value={`${data.leaveBalance.totalAvailable} Days`}
          subtitle={`Casual: ${data.leaveBalance.casualRemaining} | Sick: ${data.leaveBalance.sickRemaining}`}
          icon={CalendarDays}
          accentColor="orange"
          badge={{
            text: 'Available',
            variant: 'success',
          }}
        />
        <StatCard
          title="Upcoming Holiday"
          value={data.upcomingHoliday.name}
          subtitle={`${data.upcomingHoliday.date} • ${data.upcomingHoliday.type}`}
          icon={Sparkles}
          accentColor="purple"
          badge={{
            text: data.upcomingHoliday.daysAway,
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
                <p className="text-[11px] text-slate-400 font-light mt-0.5">Last 5 recorded work shifts</p>
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
                    {data.recentAttendance.map((row) => (
                      <tr key={row.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-100">{row.date}</td>
                        <td className="py-3 px-3 text-slate-300">{row.inTime}</td>
                        <td className="py-3 px-3 text-slate-300">{row.outTime}</td>
                        <td className="py-3 px-3 text-slate-400 font-mono text-xs">{row.duration}</td>
                        <td className="py-3 px-3 text-right">
                          <Badge variant={row.status === 'PRESENT' ? 'success' : 'warning'}>
                            {row.status}
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
              {data.leaveHistory.map((leave) => (
                <div
                  key={leave.id}
                  className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] space-y-1.5 hover:border-white/[0.12] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">
                      {leave.type} ({leave.days}d)
                    </span>
                    <Badge variant={leave.status === 'APPROVED' ? 'success' : 'warning'}>
                      {leave.status}
                    </Badge>
                  </div>
                  <div className="text-[11.5px] text-slate-400 font-light">{leave.dates}</div>
                  <div className="text-[11px] text-slate-500 italic">"{leave.reason}"</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
