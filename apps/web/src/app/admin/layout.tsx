'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';

const adminNavItems = [
  { label: 'Admin Dashboard', href: '/admin/dashboard' },
  { label: 'Employees', href: '/admin/employees' },
  { label: 'Leave Approvals', href: '/admin/approvals' },
  { label: 'Attendance Monitor', href: '/admin/attendance' },
  { label: 'Payroll Management', href: '/admin/payroll' },
];

export default function AdminLayout({
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
      <Sidebar items={adminNavItems} title="DAYFLOW HR" roleBadge="ADMIN / HR" />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar userName="HR Admin" userRole="Admin" onLogout={handleLogout} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
