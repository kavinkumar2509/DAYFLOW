'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';

const employeeNavItems = [
  { label: 'Dashboard', href: '/employee/dashboard' },
  { label: 'Attendance', href: '/employee/attendance' },
  { label: 'Apply Leave', href: '/employee/leave' },
  { label: 'My Payroll', href: '/employee/payroll' },
  { label: 'My Profile', href: '/employee/profile' },
];

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <Sidebar items={employeeNavItems} title="DAYFLOW" roleBadge="EMPLOYEE" />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName="Adithya R" userRole="Employee" onLogout={handleLogout} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
