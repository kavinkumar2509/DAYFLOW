export interface AttendanceReportSummary {
  totalEmployees: number;
  totalPresent: number;
  totalAbsent: number;
  totalHalfDay: number;
  totalLeave: number;
  averageAttendanceRate: number;
  period: {
    from: string;
    to: string;
  };
}

export interface PayrollReportSummary {
  totalEmployeesPaid: number;
  totalBaseSalaries: number;
  totalAllowances: number;
  totalDeductions: number;
  totalNetDisbursed: number;
  month: number;
  year: number;
}
