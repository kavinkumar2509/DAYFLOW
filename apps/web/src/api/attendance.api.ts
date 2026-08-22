import { apiClient } from './client';
import { AttendanceRecord, CheckInRequest, CheckOutRequest, AttendanceFilterParams } from '@dayflow/shared-types';

export interface AttendanceRecordWithRemarks extends AttendanceRecord {
  remarks?: string;
}

export const attendanceApi = {
  /**
   * Employee daily check-in (POST /attendance/check-in)
   */
  async checkIn(payload: CheckInRequest = {}): Promise<AttendanceRecordWithRemarks> {
    return apiClient<AttendanceRecordWithRemarks>('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Employee daily check-out (POST /attendance/check-out)
   */
  async checkOut(payload: CheckOutRequest = {}): Promise<AttendanceRecordWithRemarks> {
    return apiClient<AttendanceRecordWithRemarks>('/attendance/check-out', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * View authenticated employee attendance history (GET /attendance/me)
   */
  async getOwnAttendance(filter: AttendanceFilterParams = {}): Promise<AttendanceRecordWithRemarks[]> {
    const params = new URLSearchParams();
    if (filter.from) params.set('from', filter.from);
    if (filter.to) params.set('to', filter.to);
    if (filter.status) params.set('status', filter.status);
    if (filter.limit) params.set('limit', String(filter.limit));

    const queryString = params.toString();
    const endpoint = `/attendance/me${queryString ? `?${queryString}` : ''}`;

    return apiClient<AttendanceRecordWithRemarks[]>(endpoint, {
      method: 'GET',
    });
  },
};
