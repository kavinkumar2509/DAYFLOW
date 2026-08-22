export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  HALF_DAY = 'HALF_DAY',
  LEAVE = 'LEAVE',
}

export enum LeaveType {
  PAID = 'PAID',
  SICK = 'SICK',
  UNPAID = 'UNPAID',
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum PayrollStatus {
  DRAFT = 'DRAFT',
  GENERATED = 'GENERATED',
  PAID = 'PAID',
}

export enum NotificationType {
  LEAVE_STATUS = 'LEAVE_STATUS',
  ATTENDANCE_ALERT = 'ATTENDANCE_ALERT',
  PAYROLL_ALERT = 'PAYROLL_ALERT',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}
