'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  User,
  Users,
  CheckSquare,
  Layers,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const EMPLOYEE_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
  { label: 'Attendance', href: '/employee/attendance', icon: CalendarCheck },
  { label: 'Leave', href: '/employee/leave', icon: CalendarDays },
  { label: 'Payroll', href: '/employee/payroll', icon: CreditCard },
  { label: 'Profile', href: '/employee/profile', icon: User },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Employees', href: '/admin/employees', icon: Users },
  { label: 'Approvals', href: '/admin/approvals', icon: CheckSquare },
  { label: 'Attendance', href: '/admin/attendance', icon: Clock },
  { label: 'Payroll', href: '/admin/payroll', icon: CreditCard },
];

export interface SidebarProps {
  role: 'EMPLOYEE' | 'ADMIN' | 'HR';
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();
  const navItems = role === 'EMPLOYEE' ? EMPLOYEE_NAV_ITEMS : ADMIN_NAV_ITEMS;
  const roleBadge = role === 'EMPLOYEE' ? 'EMPLOYEE' : 'ADMIN / HR';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#050508]/85 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          boxShadow: 'inset -1px 0 0 rgba(255, 255, 255, 0.04), 10px 0 30px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/[0.08]">
          <Link
            href={role === 'EMPLOYEE' ? '/employee/dashboard' : '/admin/dashboard'}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30 border border-indigo-400/30 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100 leading-none tracking-tight flex items-center gap-1.5">
                DAYFLOW
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              </div>
              <div className="text-[10px] font-mono font-medium text-purple-400/90 tracking-wider mt-0.5">
                {roleBadge}
              </div>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/employee/dashboard' &&
                item.href !== '/admin/dashboard' &&
                pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-purple-950/40 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10 font-semibold'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Futuristic Footer Tag */}
        <div className="p-4 border-t border-white/[0.08] text-[10.5px] text-slate-500 flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-400/80" />
            AI HRMS
          </span>
          <span className="text-slate-600">v0.2.0</span>
        </div>
      </aside>
    </>
  );
};
