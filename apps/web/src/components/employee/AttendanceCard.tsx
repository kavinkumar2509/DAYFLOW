'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, LogIn, LogOut } from 'lucide-react';
import type { AttendanceSummary } from '@/types/attendance';

export interface AttendanceCardProps {
  summary?: AttendanceSummary;
  isCheckedIn?: boolean;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  summary = {
    presentDays: 18,
    absentDays: 1,
    lateDays: 2,
    leaveDays: 1,
    totalWorkingDays: 22,
  },
  isCheckedIn = false,
  onCheckIn,
  onCheckOut,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          Attendance Tracker
        </CardTitle>
        <Badge variant={isCheckedIn ? 'success' : 'warning'}>
          {isCheckedIn ? 'Checked In' : 'Not Checked In'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-center">
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <div className="text-xl font-bold text-slate-100">{summary.presentDays}</div>
            <div className="text-[11px] text-slate-400 font-light mt-0.5">Present</div>
          </div>
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <div className="text-xl font-bold text-amber-400">{summary.lateDays}</div>
            <div className="text-[11px] text-slate-400 font-light mt-0.5">Late</div>
          </div>
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <div className="text-xl font-bold text-rose-400">{summary.absentDays}</div>
            <div className="text-[11px] text-slate-400 font-light mt-0.5">Absent</div>
          </div>
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <div className="text-xl font-bold text-purple-400">{summary.leaveDays}</div>
            <div className="text-[11px] text-slate-400 font-light mt-0.5">Leaves</div>
          </div>
        </div>

        <div>
          {!isCheckedIn ? (
            <Button onClick={onCheckIn} className="w-full">
              <LogIn className="w-4 h-4 mr-2" /> Check In Now
            </Button>
          ) : (
            <Button onClick={onCheckOut} variant="danger" className="w-full">
              <LogOut className="w-4 h-4 mr-2" /> Check Out
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
