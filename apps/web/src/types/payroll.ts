export type PayrollStatus = 'DRAFT' | 'PROCESSING' | 'PAID' | 'FAILED';

export interface SalaryBreakdown {
  basic: number;
  hra: number;
  specialAllowance: number;
  bonus: number;
  grossSalary: number;
  pfDeduction: number;
  taxDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string; // e.g. "August 2026"
  year: number;
  breakdown: SalaryBreakdown;
  status: PayrollStatus;
  paymentDate?: string;
  transactionRef?: string;
}

export interface SalarySlip {
  id: string;
  payrollId: string;
  employeeId: string;
  month: string;
  year: number;
  downloadUrl: string;
}

export interface PayrollSummary {
  totalDisbursed: number;
  totalPending: number;
  totalEmployees: number;
  month: string;
}
