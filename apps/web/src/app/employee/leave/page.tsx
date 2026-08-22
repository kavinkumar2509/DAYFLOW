'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { LeaveCard } from '@/components/employee/LeaveCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Send, CheckCircle2 } from 'lucide-react';
import { mockEmployeeDashboardData } from '@/lib/mock/dashboardData';

export default function EmployeeLeavePage() {
  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReason('');
      setStartDate('');
      setEndDate('');
    }, 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      <DashboardHeader
        title="Leave Management"
        description="Apply for time off, check current leave quotas, and track approval status."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Balances Card */}
        <div className="lg:col-span-1 space-y-4">
          <LeaveCard />
        </div>

        {/* Leave Application Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="w-4 h-4 text-purple-400" />
                Apply for Time Off
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="p-4 bg-emerald-950/40 text-emerald-300 rounded-xl border border-emerald-500/30 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Leave application submitted successfully. Awaiting manager approval.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Leave Type
                    </label>
                    <select
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-white/15 bg-black/50 text-slate-100 focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/60 focus:outline-none transition-colors"
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                    >
                      <option value="CASUAL" className="bg-[#121217] text-slate-200">Casual Leave (CL) - 9 days remaining</option>
                      <option value="SICK" className="bg-[#121217] text-slate-200">Sick Leave (SL) - 8 days remaining</option>
                      <option value="PAID" className="bg-[#121217] text-slate-200">Paid / Earned Leave (PL) - 10 days remaining</option>
                      <option value="UNPAID" className="bg-[#121217] text-slate-200">Leave Without Pay (LWP)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                    <Input
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Reason for Request
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-white/15 bg-black/50 text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/60 focus:outline-none transition-colors"
                      placeholder="Please mention the purpose of leave..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Leave History List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Leave History & Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {mockEmployeeDashboardData.leaveHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06] flex items-center justify-between hover:border-white/[0.12] transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200">
                        {item.type} ({item.days} day{item.days > 1 ? 's' : ''})
                      </div>
                      <div className="text-[11.5px] text-slate-400 font-light">{item.dates} • "{item.reason}"</div>
                    </div>
                    <Badge variant={item.status === 'APPROVED' ? 'success' : 'warning'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
