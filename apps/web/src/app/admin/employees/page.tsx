'use client';

import React from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { EmployeeTable } from '@/components/admin/EmployeeTable';
import { Button } from '@/components/ui/button';

export default function AdminEmployeesPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Employee Directory"
        description="Manage company employees, track Aadhaar KYC status, and update assignments."
        action={
          <Button size="sm">
            + Add New Employee
          </Button>
        }
      />

      <EmployeeTable />
    </div>
  );
}
