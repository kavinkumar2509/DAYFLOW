import { PayrollStatus } from './enums';

export interface PayrollRecord {
  id: string;
  userId: string;
  employeeId?: string;
  employeeName?: string;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  paymentDate?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePayrollRequest {
  baseSalary?: number;
  allowances?: number;
  deductions?: number;
  status?: PayrollStatus;
  paymentDate?: string;
  remarks?: string;
}

export interface GeneratePayrollRequest {
  month: number;
  year: number;
  userIds?: string[];
}

export interface SalarySlip {
  payrollId: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  designation?: string;
  month: number;
  year: number;
  payPeriod: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate?: string;
  status: PayrollStatus;
}
