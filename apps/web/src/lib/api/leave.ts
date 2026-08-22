import type {
  LeaveRequest,
  LeaveApplicationPayload,
  LeaveApprovalPayload,
  LeaveBalance,
} from '@/types/leave';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Leave Management API Client (Placeholder for backend integration)
 */
export const leaveApi = {
  /**
   * Get leave applications for the current employee
   */
  async getMyLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await fetch(`${API_BASE_URL}/leaves/my-leaves`);
    if (!response.ok) throw new Error('Failed to fetch leave requests');
    return response.json();
  },

  /**
   * Get leave balances for the current employee
   */
  async getLeaveBalance(): Promise<LeaveBalance> {
    const response = await fetch(`${API_BASE_URL}/leaves/balance`);
    if (!response.ok) throw new Error('Failed to fetch leave balance');
    return response.json();
  },

  /**
   * Apply for a new leave
   */
  async applyLeave(payload: LeaveApplicationPayload): Promise<LeaveRequest> {
    const response = await fetch(`${API_BASE_URL}/leaves/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to apply for leave');
    return response.json();
  },

  /**
   * Admin/HR: Get all pending & historical leave requests
   */
  async getAllLeaveRequests(status?: string): Promise<LeaveRequest[]> {
    const query = status ? `?status=${status}` : '';
    const response = await fetch(`${API_BASE_URL}/admin/leaves${query}`);
    if (!response.ok) throw new Error('Failed to fetch admin leave requests');
    return response.json();
  },

  /**
   * Admin/HR: Approve or Reject leave request
   */
  async reviewLeave(payload: LeaveApprovalPayload): Promise<LeaveRequest> {
    const response = await fetch(`${API_BASE_URL}/admin/leaves/${payload.requestId}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to update leave status');
    return response.json();
  },
};
