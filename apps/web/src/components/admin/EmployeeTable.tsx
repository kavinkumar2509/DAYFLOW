'use client';

import React from 'react';
import type { User } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface EmployeeTableProps {
  employees?: Partial<User>[];
  onViewDetails?: (id: string) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees = [
    { id: '1', employeeId: 'EMP-001', name: 'Adithya R', email: 'adithya@dayflow.internal', role: 'EMPLOYEE', department: 'Engineering', isAadhaarVerified: true },
    { id: '2', employeeId: 'EMP-002', name: 'Sneha Patel', email: 'sneha@dayflow.internal', role: 'EMPLOYEE', department: 'Product Design', isAadhaarVerified: true },
    { id: '3', employeeId: 'EMP-003', name: 'Karthik Nair', email: 'karthik@dayflow.internal', role: 'HR', department: 'Human Resources', isAadhaarVerified: true },
  ],
  onViewDetails,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="px-4 py-3">Emp ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Aadhaar Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="px-4 py-3 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {emp.employeeId}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900 dark:text-slate-100">{emp.name}</div>
                <div className="text-xs text-slate-400">{emp.email}</div>
              </td>
              <td className="px-4 py-3">{emp.department || 'General'}</td>
              <td className="px-4 py-3">
                <Badge variant={emp.role === 'ADMIN' ? 'danger' : emp.role === 'HR' ? 'warning' : 'default'}>
                  {emp.role}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant={emp.isAadhaarVerified ? 'success' : 'warning'}>
                  {emp.isAadhaarVerified ? 'Verified' : 'Pending'}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => emp.id && onViewDetails?.(emp.id)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
