'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { LeaveRequest } from '@/types/leave';

export interface ApprovalCardProps {
  request?: Partial<LeaveRequest>;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  request = {
    id: 'req-1',
    employeeName: 'Sneha Patel',
    employeeId: 'EMP-002',
    department: 'Product Design',
    leaveType: 'CASUAL',
    startDate: '2026-08-25',
    endDate: '2026-08-27',
    totalDays: 3,
    reason: 'Family function in hometown.',
    status: 'PENDING',
  },
  onApprove,
  onReject,
}) => {
  return (
    <Card className="border-l-4 border-l-amber-500">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-semibold">{request.employeeName}</CardTitle>
          <p className="text-xs text-slate-400">{request.department} • ID: {request.employeeId}</p>
        </div>
        <Badge variant="warning">{request.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-slate-100">{request.leaveType} LEAVE</span>
          {' • '}
          {request.startDate} to {request.endDate} ({request.totalDays} days)
        </div>
        <p className="text-xs italic text-slate-500 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg">
          "{request.reason}"
        </p>
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="primary"
            className="w-full text-xs"
            onClick={() => request.id && onApprove?.(request.id)}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
            onClick={() => request.id && onReject?.(request.id)}
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
