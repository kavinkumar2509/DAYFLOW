'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
        <CardTitle>Attendance Tracker</CardTitle>
        <Badge variant={isCheckedIn ? 'success' : 'default'}>
          {isCheckedIn ? 'Checked In' : 'Not Checked In'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{summary.presentDays}</div>
            <div className="text-xs text-slate-500">Present</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-xl font-bold text-amber-600">{summary.lateDays}</div>
            <div className="text-xs text-slate-500">Late</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-xl font-bold text-rose-600">{summary.absentDays}</div>
            <div className="text-xs text-slate-500">Absent</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-xl font-bold text-indigo-600">{summary.leaveDays}</div>
            <div className="text-xs text-slate-500">Leaves</div>
          </div>
        </div>

        <div className="flex gap-3">
          {!isCheckedIn ? (
            <Button onClick={onCheckIn} className="w-full">
              Check In
            </Button>
          ) : (
            <Button onClick={onCheckOut} variant="danger" className="w-full">
              Check Out
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
