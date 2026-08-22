'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export interface NavbarProps {
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName = 'Adithya (Demo)',
  userRole = 'Employee',
  onLogout,
}) => {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-slate-500">
          DAYFLOW HRMS Portal
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
            {userName}
          </div>
          <div className="text-xs text-slate-400 capitalize">{userRole}</div>
        </div>

        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-sm border border-indigo-200 dark:border-indigo-800">
          {userName.charAt(0)}
        </div>

        <Button variant="ghost" size="sm" onClick={onLogout} className="text-xs">
          Sign Out
        </Button>
      </div>
    </header>
  );
};
