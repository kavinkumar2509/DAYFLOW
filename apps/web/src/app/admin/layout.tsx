'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';
import { DashboardBackgroundMesh } from '@/components/shared/DashboardBackgroundMesh';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/; SameSite=Lax';
    document.cookie = 'user_role=; Max-Age=0; path=/; SameSite=Lax';
    window.location.href = '/login';
  };

  return (
    <div className="relative min-h-screen bg-[#000000] text-slate-100 flex overflow-x-hidden">
      {/* Seamless Ambient Mesh Waves in Background */}
      <DashboardBackgroundMesh />

      {/* Role-based Futuristic Sidebar */}
      <Sidebar
        role="ADMIN"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Layout Shell */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          userName="Karthik Nair"
          userRole="Admin / HR"
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
