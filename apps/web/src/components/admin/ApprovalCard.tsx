'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Check, X } from 'lucide-react';
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
    <Card className="border-l-2 border-l-purple-500/80">
      <CardHeader className="flex flex-row items-center justify-between pb-2.5">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-100">{request.employeeName}</CardTitle>
          <p className="text-[11px] text-slate-500 font-light mt-0.5">{request.department} • <span className="font-mono text-purple-400">{request.employeeId}</span></p>
        </div>
        <Badge variant="warning">{request.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-purple-300">{request.leaveType} LEAVE</span>
          {' • '}
          <span className="text-slate-400 font-light">{request.startDate} to {request.endDate} ({request.totalDays} days)</span>
        </div>
        <p className="text-xs italic text-slate-400 bg-white/[0.03] p-3 rounded-xl border border-white/[0.06] font-light leading-relaxed">
          "{request.reason}"
        </p>
        <div className="flex gap-2.5 pt-1">
          <Button
            size="sm"
            variant="primary"
            className="w-full text-xs h-8"
            onClick={() => request.id && onApprove?.(request.id)}
          >
            <Check className="w-3.5 h-3.5 mr-1" /> Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs h-8 text-rose-400 hover:text-rose-300 hover:border-rose-500/40"
            onClick={() => request.id && onReject?.(request.id)}
          >
            <X className="w-3.5 h-3.5 mr-1" /> Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
