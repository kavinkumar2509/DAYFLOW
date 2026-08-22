'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';
import { DashboardBackgroundMesh } from '@/components/shared/DashboardBackgroundMesh';
import { authApi } from '@/lib/api/auth';
import type { User } from '@/types/user';

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    authApi.getCurrentUser().then((u) => {
      if (u) setUser(u);
    });
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    window.location.href = '/login';
  };

  const displayName = user?.name || user?.employeeId || 'Employee';

  return (
    <div className="relative min-h-screen bg-[#000000] text-slate-100 flex overflow-x-hidden">
      {/* Seamless Ambient Mesh Waves in Background */}
      <DashboardBackgroundMesh />

      {/* Role-based Futuristic Sidebar */}
      <Sidebar
        role="EMPLOYEE"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Layout Shell */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          userName={displayName}
          userRole="Employee"
          onMenuToggle={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
