'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { ApprovalCard } from '@/components/admin/ApprovalCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Sparkles } from 'lucide-react';
import { mockAdminDashboardData } from '@/lib/mock/dashboardData';

export default function AdminApprovalsPage() {
  const [requests, setRequests] = useState(mockAdminDashboardData.pendingApprovals);

  const handleApprove = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  const handleReject = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      <DashboardHeader
        title="Leave Approvals Management"
        description="Review, approve, or decline employee time off applications across all business units."
      />

      <div className="flex items-center gap-2.5 pb-2">
        <Badge variant="warning" className="px-3 py-1 text-xs">
          Pending Review ({requests.length})
        </Badge>
        <span className="text-xs text-slate-400 font-light">
          Showing requests submitted in the last 7 days
        </span>
      </div>

      {requests.length === 0 ? (
        <Card className="text-center py-12">
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2 opacity-60" />
          <p className="text-sm font-medium text-slate-300">
            No pending leave requests requiring action.
          </p>
          <p className="text-xs text-slate-500 font-light mt-1">All employee leave queues are up to date.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <ApprovalCard
              key={req.id}
              request={{
                id: req.id,
                employeeName: req.employeeName,
                employeeId: req.employeeId,
                department: req.department,
                leaveType: req.leaveType as any,
                startDate: req.dates.split(' - ')[0],
                endDate: req.dates.split(' - ')[1] || req.dates,
                totalDays: req.totalDays,
                reason: req.reason,
                status: 'PENDING',
              }}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
