import type {
  AttendanceRecord,
  AttendanceSummary,
  CheckInPayload,
  CheckOutPayload,
} from '@/types/attendance';
import { fetchApi } from './client';

function mapRecord(item: any): AttendanceRecord {
  const inTime = item.checkIn
    ? new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : undefined;
  const outTime = item.checkOut
    ? new Date(item.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : undefined;

  return {
    id: item.id,
    userId: item.userId,
    employeeId: item.employeeId || '',
    employeeName: item.employeeName || 'Employee',
    date: item.date,
    checkIn: inTime,
    checkOut: outTime,
    totalHours: item.workHours !== null && item.workHours !== undefined ? Number(item.workHours) : undefined,
    status: item.status,
    notes: item.remarks,
  };
}

export const attendanceApi = {
  /**
   * Get attendance records for current employee (GET /attendance/me)
   */
  async getEmployeeAttendance(params?: { from?: string; to?: string; status?: string; limit?: number }): Promise<AttendanceRecord[]> {
    const queryParams = new URLSearchParams();
    if (params?.from) queryParams.set('from', params.from);
    if (params?.to) queryParams.set('to', params.to);
    if (params?.status) queryParams.set('status', params.status);
    if (params?.limit) queryParams.set('limit', String(params.limit));

    const qs = queryParams.toString();
    const rawList = await fetchApi<any[]>(`/attendance/me${qs ? `?${qs}` : ''}`);

    if (!Array.isArray(rawList)) return [];
    return rawList.map(mapRecord);
  },

  /**
   * Get employee attendance summary stats computed from real history
   */
  async getAttendanceSummary(): Promise<AttendanceSummary> {
    const records = await this.getEmployeeAttendance({ limit: 60 });
    
    let presentDays = 0;
    let absentDays = 0;
    let lateDays = 0;
    let leaveDays = 0;

    for (const r of records) {
      if (r.status === 'PRESENT') presentDays++;
      else if (r.status === 'HALF_DAY') {
        presentDays++;
        lateDays++;
      } else if (r.status === 'ABSENT') absentDays++;
      else if (r.status === 'ON_LEAVE') leaveDays++;
    }

    return {
      presentDays,
      absentDays,
      lateDays,
      leaveDays,
      totalWorkingDays: Math.max(records.length, presentDays + absentDays + leaveDays),
    };
  },

  /**
   * Daily check-in (POST /attendance/check-in)
   */
  async checkIn(payload?: CheckInPayload): Promise<AttendanceRecord> {
    const data = await fetchApi<any>('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({
        remarks: payload?.notes || payload?.location || 'Office Check-in',
      }),
    });
    return mapRecord(data);
  },

  /**
   * Daily check-out (POST /attendance/check-out)
   */
  async checkOut(payload?: CheckOutPayload): Promise<AttendanceRecord> {
    const data = await fetchApi<any>('/attendance/check-out', {
      method: 'POST',
      body: JSON.stringify({
        remarks: payload?.notes || 'Day Check-out',
      }),
    });
    return mapRecord(data);
  },

  /**
   * Admin/HR: Get all employee attendance records (GET /admin/attendance)
   */
  async getAllAttendance(params?: { date?: string; department?: string; employeeId?: string }): Promise<AttendanceRecord[]> {
    const queryParams = new URLSearchParams();
    if (params?.date) {
      queryParams.set('from', params.date);
      queryParams.set('to', params.date);
    }
    if (params?.employeeId) queryParams.set('employeeId', params.employeeId);

    const qs = queryParams.toString();
    const result = await fetchApi<any>(`/admin/attendance${qs ? `?${qs}` : ''}`);

    const items = Array.isArray(result) ? result : result?.items || [];
    return items.map(mapRecord);
  },
};
