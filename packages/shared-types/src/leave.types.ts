import { LeaveType, LeaveStatus } from './enums';

export interface LeaveRequestRecord {
  id: string;
  userId: string;
  employeeId?: string;
  employeeName?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  adminRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaveRequest {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ReviewLeaveRequest {
  adminRemarks?: string;
}

export interface LeaveFilterParams {
  status?: LeaveStatus;
  leaveType?: LeaveType;
  employeeId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
