'use client';

import React from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { ApprovalCard } from '@/components/admin/ApprovalCard';

export default function AdminApprovalsPage() {
  const pendingRequests = [
    {
      id: 'req-1',
      employeeName: 'Sneha Patel',
      employeeId: 'EMP-002',
      department: 'Product Design',
      leaveType: 'CASUAL' as const,
      startDate: '2026-08-25',
      endDate: '2026-08-27',
      totalDays: 3,
      reason: 'Family function in hometown.',
      status: 'PENDING' as const,
    },
    {
      id: 'req-2',
      employeeName: 'Rahul Verma',
      employeeId: 'EMP-014',
      department: 'Backend Engineering',
      leaveType: 'SICK' as const,
      startDate: '2026-08-23',
      endDate: '2026-08-24',
      totalDays: 2,
      reason: 'Viral fever, doctor advised rest.',
      status: 'PENDING' as const,
    },
    {
      id: 'req-3',
      employeeName: 'Pooja Sharma',
      employeeId: 'EMP-028',
      department: 'Marketing',
      leaveType: 'PAID' as const,
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      totalDays: 5,
      reason: 'Annual vacation with family.',
      status: 'PENDING' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Leave Approvals"
        description="Review and process pending leave applications submitted across departments."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingRequests.map((req) => (
          <ApprovalCard
            key={req.id}
            request={req}
            onApprove={(id) => alert(`Approved request ${id}`)}
            onReject={(id) => alert(`Rejected request ${id}`)}
          />
        ))}
      </div>
    </div>
  );
}
