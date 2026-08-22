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
    { id: '4', employeeId: 'EMP-014', name: 'Rahul Verma', email: 'rahul@dayflow.internal', role: 'EMPLOYEE', department: 'Backend Engineering', isAadhaarVerified: true },
    { id: '5', employeeId: 'EMP-028', name: 'Pooja Sharma', email: 'pooja@dayflow.internal', role: 'EMPLOYEE', department: 'Growth & Marketing', isAadhaarVerified: false },
  ],
  onViewDetails,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-xl">
      <table className="w-full text-left text-xs sm:text-sm text-slate-300">
        <thead className="bg-white/[0.03] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
          <tr>
            <th className="px-4 py-3">Emp ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Aadhaar Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-white/[0.03] transition-colors">
              <td className="px-4 py-3.5 font-mono text-xs font-semibold text-purple-400">
                {emp.employeeId}
              </td>
              <td className="px-4 py-3.5">
                <div className="font-medium text-slate-100">{emp.name}</div>
                <div className="text-[11px] text-slate-500 font-light">{emp.email}</div>
              </td>
              <td className="px-4 py-3.5 text-slate-300">{emp.department || 'General'}</td>
              <td className="px-4 py-3.5">
                <Badge variant={emp.role === 'ADMIN' ? 'danger' : emp.role === 'HR' ? 'warning' : 'default'}>
                  {emp.role}
                </Badge>
              </td>
              <td className="px-4 py-3.5">
                <Badge variant={emp.isAadhaarVerified ? 'success' : 'warning'}>
                  {emp.isAadhaarVerified ? 'Verified' : 'Pending'}
                </Badge>
              </td>
              <td className="px-4 py-3.5 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => emp.id && onViewDetails?.(emp.id)}
                  className="text-xs text-purple-400 hover:text-purple-300 h-7 px-2.5"
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
