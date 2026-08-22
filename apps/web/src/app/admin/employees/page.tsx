'use client';

import React from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { EmployeeTable } from '@/components/admin/EmployeeTable';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserPlus, Download, Users } from 'lucide-react';

export default function AdminEmployeesPage() {
  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      <DashboardHeader
        title="Employee Directory"
        description="Comprehensive organizational roster, department allocations, and Aadhaar KYC verification status."
        action={
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" onClick={() => alert('Exporting directory as CSV')}>
              <Download className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Export CSV
            </Button>
            <Button size="sm" onClick={() => alert('Add employee modal placeholder')}>
              <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Add New Employee
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-4 h-4 text-purple-400" />
            Active Staff Directory (128 Records)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeTable />
        </CardContent>
      </Card>
    </div>
  );
}
