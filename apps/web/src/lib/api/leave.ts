import type {
  LeaveRequest,
  LeaveApplicationPayload,
  LeaveApprovalPayload,
  LeaveBalance,
} from '@/types/leave';
import { fetchApi } from './client';

function mapLeave(item: any): LeaveRequest {
  return {
    id: item.id,
    userId: item.userId,
    employeeId: item.employeeId || '',
    employeeName: item.employeeName || 'Employee',
    department: item.department || 'Engineering',
    leaveType: item.leaveType,
    startDate: item.startDate ? item.startDate.split('T')[0] : '',
    endDate: item.endDate ? item.endDate.split('T')[0] : '',
    totalDays: item.totalDays || 1,
    reason: item.reason || '',
    status: item.status,
    appliedOn: item.createdAt || new Date().toISOString(),
    reviewedBy: item.reviewedBy,
    reviewComment: item.adminRemarks,
  };
}

export const leaveApi = {
  /**
   * Get leave applications for the current employee (GET /leave/me)
   */
  async getMyLeaveRequests(): Promise<LeaveRequest[]> {
    const raw = await fetchApi<any>('/leave/me');
    const items = Array.isArray(raw) ? raw : raw?.items || [];
    return items.map(mapLeave);
  },

  /**
   * Get leave balances for the current employee
   */
  async getLeaveBalance(): Promise<LeaveBalance> {
    const requests = await this.getMyLeaveRequests();
    const approvedDays = requests
      .filter((r) => r.status === 'APPROVED')
      .reduce((sum, r) => sum + r.totalDays, 0);

    return {
      casualLeave: { total: 12, used: Math.min(approvedDays, 12), remaining: Math.max(0, 12 - approvedDays) },
      sickLeave: { total: 10, used: 0, remaining: 10 },
      paidLeave: { total: 15, used: 0, remaining: 15 },
    };
  },

  /**
   * Apply for a new leave (POST /leave)
   */
  async applyLeave(payload: LeaveApplicationPayload): Promise<LeaveRequest> {
    const raw = await fetchApi<any>('/leave', {
      method: 'POST',
      body: JSON.stringify({
        leaveType: payload.leaveType,
        startDate: payload.startDate,
        endDate: payload.endDate,
        reason: payload.reason,
      }),
    });
    return mapLeave(raw);
  },

  /**
   * Admin/HR: Get all pending & historical leave requests (GET /admin/leave)
   */
  async getAllLeaveRequests(status?: string): Promise<LeaveRequest[]> {
    const qs = status ? `?status=${status}` : '';
    const raw = await fetchApi<any>(`/admin/leave${qs}`);
    const items = Array.isArray(raw) ? raw : raw?.items || [];
    return items.map(mapLeave);
  },

  /**
   * Admin/HR: Approve or Reject leave request (PATCH /admin/leave/:id/approve or reject)
   */
  async reviewLeave(payload: LeaveApprovalPayload): Promise<LeaveRequest> {
    const action = payload.status === 'APPROVED' ? 'approve' : 'reject';
    const raw = await fetchApi<any>(`/admin/leave/${payload.requestId}/${action}`, {
      method: 'PATCH',
      body: JSON.stringify({
        adminRemarks: payload.reviewComment || `${payload.status} by Admin`,
      }),
    });
    return mapLeave(raw);
  },
};
