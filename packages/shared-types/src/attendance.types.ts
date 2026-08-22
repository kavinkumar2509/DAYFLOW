import { AttendanceStatus } from './enums';

export interface AttendanceRecord {
  id: string;
  userId: string;
  employeeId?: string;
  employeeName?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workHours?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CheckInRequest {
  remarks?: string;
}

export interface CheckOutRequest {
  remarks?: string;
}

export interface AttendanceFilterParams {
  from?: string;
  to?: string;
  employeeId?: string;
  status?: AttendanceStatus;
  page?: number;
  limit?: number;
}
