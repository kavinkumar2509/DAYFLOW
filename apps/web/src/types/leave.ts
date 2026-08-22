export type LeaveType = 'CASUAL' | 'SICK' | 'PAID' | 'UNPAID' | 'MATERNITY' | 'PATERNITY';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveRequest {
  id: string;
  userId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewComment?: string;
}

export interface LeaveApplicationPayload {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface LeaveApprovalPayload {
  requestId: string;
  status: 'APPROVED' | 'REJECTED';
  reviewComment?: string;
}

export interface LeaveBalance {
  casualLeave: { total: number; used: number; remaining: number };
  sickLeave: { total: number; used: number; remaining: number };
  paidLeave: { total: number; used: number; remaining: number };
}
