import type {
  PayrollRecord,
  PayrollSummary,
  SalarySlip,
} from '@/types/payroll';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Payroll API Client (Placeholder for backend integration)
 */
export const payrollApi = {
  /**
   * Get payroll history for current employee
   */
  async getMyPayroll(params?: { year?: number }): Promise<PayrollRecord[]> {
    const query = params?.year ? `?year=${params.year}` : '';
    const response = await fetch(`${API_BASE_URL}/payroll/my-records${query}`);
    if (!response.ok) throw new Error('Failed to fetch employee payroll');
    return response.json();
  },

  /**
   * Get salary slip download URL or blob
   */
  async getSalarySlip(payrollId: string): Promise<SalarySlip> {
    const response = await fetch(`${API_BASE_URL}/payroll/slip/${payrollId}`);
    if (!response.ok) throw new Error('Failed to fetch salary slip');
    return response.json();
  },

  /**
   * Admin/HR: Get company payroll overview
   */
  async getPayrollSummary(month?: string): Promise<PayrollSummary> {
    const query = month ? `?month=${month}` : '';
    const response = await fetch(`${API_BASE_URL}/admin/payroll/summary${query}`);
    if (!response.ok) throw new Error('Failed to fetch payroll summary');
    return response.json();
  },

  /**
   * Admin/HR: Get all employee payrolls for a cycle
   */
  async getAllPayrolls(params?: { month?: string; department?: string }): Promise<PayrollRecord[]> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`${API_BASE_URL}/admin/payroll?${query}`);
    if (!response.ok) throw new Error('Failed to fetch payroll records');
    return response.json();
  },

  /**
   * Admin/HR: Process/Run payroll for month
   */
  async processPayroll(month: string, year: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/admin/payroll/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, year }),
    });
    if (!response.ok) throw new Error('Failed to process payroll');
    return response.json();
  },
};
