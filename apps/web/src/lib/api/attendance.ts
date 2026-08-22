import type {
  AttendanceRecord,
  AttendanceSummary,
  CheckInPayload,
  CheckOutPayload,
} from '@/types/attendance';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Attendance API Client (Placeholder for backend integration)
 */
export const attendanceApi = {
  /**
   * Get attendance records for current employee
   */
  async getEmployeeAttendance(params?: { month?: string; year?: number }): Promise<AttendanceRecord[]> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`${API_BASE_URL}/attendance/my-records?${query}`);
    if (!response.ok) throw new Error('Failed to fetch attendance');
    return response.json();
  },

  /**
   * Get employee attendance summary stats
   */
  async getAttendanceSummary(): Promise<AttendanceSummary> {
    const response = await fetch(`${API_BASE_URL}/attendance/summary`);
    if (!response.ok) throw new Error('Failed to fetch attendance summary');
    return response.json();
  },

  /**
   * Daily check-in
   */
  async checkIn(payload?: CheckInPayload): Promise<AttendanceRecord> {
    const response = await fetch(`${API_BASE_URL}/attendance/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    if (!response.ok) throw new Error('Check-in failed');
    return response.json();
  },

  /**
   * Daily check-out
   */
  async checkOut(payload?: CheckOutPayload): Promise<AttendanceRecord> {
    const response = await fetch(`${API_BASE_URL}/attendance/check-out`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    if (!response.ok) throw new Error('Check-out failed');
    return response.json();
  },

  /**
   * Admin/HR: Get all employee attendance records
   */
  async getAllAttendance(params?: { date?: string; department?: string }): Promise<AttendanceRecord[]> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`${API_BASE_URL}/admin/attendance?${query}`);
    if (!response.ok) throw new Error('Failed to fetch admin attendance');
    return response.json();
  },
};
