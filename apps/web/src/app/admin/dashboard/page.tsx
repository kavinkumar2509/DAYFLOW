'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CalendarCheck,
  CheckSquare,
  UserX,
  UserPlus,
  ArrowRight,
  Clock,
  ShieldCheck,
  Activity,
  Sparkles,
} from 'lucide-react';
import { DashboardHeader, StatCard } from '@/components/shared';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockAdminDashboardData } from '@/lib/mock/dashboardData';

export default function AdminDashboardPage() {
  const [approvals, setApprovals] = useState(mockAdminDashboardData.pendingApprovals);
  const data = mockAdminDashboardData;

  const handleApprove = (id: string) => {
    setApprovals(approvals.filter((item) => item.id !== id));
  };

  const handleReject = (id: string) => {
    setApprovals(approvals.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* Header & Quick Action Buttons */}
      <DashboardHeader
        title="Admin & HR Command Center"
        description="Real-time organizational intelligence, staff compliance, and operational workflows."
        action={
          <div className="flex items-center gap-2.5">
            <Link href="/admin/employees">
              <Button size="sm">
                <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Add Employee
              </Button>
            </Link>
            <Link href="/admin/approvals">
              <Button variant="secondary" size="sm">
                <CheckSquare className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> View Approvals
              </Button>
            </Link>
          </div>
        }
      />

      {/* Summary KPI Cards with Glowing Themes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Headcount"
          value={data.stats.totalEmployees}
          subtitle={data.stats.totalEmployeesChange}
          icon={Users}
          accentColor="purple"
          badge={{
            text: 'Active',
            variant: 'info',
          }}
        />
        <StatCard
          title="Present Today"
          value={data.stats.presentToday}
          subtitle={data.stats.presentPercentage}
          icon={CalendarCheck}
          accentColor="emerald"
          badge={{
            text: '93% Rate',
            variant: 'success',
          }}
        />
        <StatCard
          title="Pending Approvals"
          value={`${approvals.length} Requests`}
          subtitle={data.stats.pendingApprovalsSubtitle}
          icon={CheckSquare}
          accentColor="orange"
          badge={{
            text: 'Action Needed',
            variant: 'warning',
          }}
        />
        <StatCard
          title="Employees On Leave"
          value={`${data.stats.onLeaveTodayCount} Members`}
          subtitle={data.stats.onLeaveSubtitle}
          icon={UserX}
          accentColor="purple"
          badge={{
            text: 'Planned',
            variant: 'info',
          }}
        />
      </div>

      {/* Quick Action Navigation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#08080c]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:border-purple-500/30 transition-all flex items-center justify-between group">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
              Employee Directory
            </h4>
            <p className="text-[11px] text-slate-400 font-light">128 records • Aadhaar KYC compliance</p>
          </div>
          <Link href="/admin/employees">
            <Button variant="outline" size="sm" className="text-xs h-8 px-3">
              Manage <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="p-4 bg-[#08080c]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:border-purple-500/30 transition-all flex items-center justify-between group">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
              Attendance Monitor
            </h4>
            <p className="text-[11px] text-slate-400 font-light">Live check-in times & punctuality</p>
          </div>
          <Link href="/admin/attendance">
            <Button variant="outline" size="sm" className="text-xs h-8 px-3">
              Live Feed <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="p-4 bg-[#08080c]/70 backdrop-blur-xl rounded-2xl border border-white/[0.08] hover:border-purple-500/30 transition-all flex items-center justify-between group">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
              Payroll Processing
            </h4>
            <p className="text-[11px] text-slate-400 font-light">August cycle • Disbursal review</p>
          </div>
          <Link href="/admin/payroll">
            <Button variant="outline" size="sm" className="text-xs h-8 px-3">
              Payroll Hub <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Sections: Pending Approvals & Attendance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Pending Approvals & Department Attendance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Approvals Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-purple-400" />
                  Pending Leave Approvals
                </CardTitle>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">Requires manager or HR sign-off</p>
              </div>
              <Link href="/admin/approvals">
                <Button variant="ghost" size="sm" className="text-xs text-purple-400 hover:text-purple-300">
                  View All ({approvals.length}) <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {approvals.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 font-light">
                  ✨ No pending approvals at this time.
                </div>
              ) : (
                approvals.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-slate-100">
                          {req.employeeName}
                        </span>
                        <span className="text-[11px] font-mono text-purple-400">
                          {req.employeeId}
                        </span>
                        <Badge variant="warning" className="text-[10px]">
                          {req.leaveType}
                        </Badge>
                      </div>
                      <div className="text-[11.5px] text-slate-400 font-light">
                        {req.department} • {req.dates} ({req.totalDays} days)
                      </div>
                      <div className="text-[11px] text-slate-400 italic font-light">
                        "{req.reason}"
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleApprove(req.id)}
                        className="text-xs h-7.5 px-3"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(req.id)}
                        className="text-xs h-7.5 px-3 text-rose-400 hover:text-rose-300 hover:border-rose-500/40"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Department Attendance Overview Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Department Attendance Overview
                </CardTitle>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">Today's workforce presence by unit</p>
              </div>
              <Link href="/admin/attendance">
                <Button variant="ghost" size="sm" className="text-xs text-purple-400 hover:text-purple-300">
                  Live Feed <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="text-[11px] text-slate-400 uppercase border-b border-white/[0.06] bg-white/[0.02]">
                    <tr>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Headcount</th>
                      <th className="py-2.5 px-3">Present</th>
                      <th className="py-2.5 px-3">On Leave</th>
                      <th className="py-2.5 px-3 text-right">Presence Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {data.departmentAttendance.map((dept, i) => (
                      <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-100">
                          {dept.department}
                        </td>
                        <td className="py-3 px-3 text-slate-300">{dept.total}</td>
                        <td className="py-3 px-3 font-semibold text-emerald-400">{dept.present}</td>
                        <td className="py-3 px-3 text-slate-400">{dept.onLeave}</td>
                        <td className="py-3 px-3 text-right font-mono font-medium text-purple-300">
                          {dept.rate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 col): Recent Activity Feed */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Recent System Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {data.recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0 shadow-xs shadow-purple-500" />
                  <div className="space-y-0.5 flex-1">
                    <p className="text-slate-200 leading-snug font-light">{act.message}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
