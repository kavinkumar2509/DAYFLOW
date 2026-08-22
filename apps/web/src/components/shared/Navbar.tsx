'use client';

import React from 'react';
import { Menu, LogOut, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface NavbarProps {
  userName?: string;
  userRole?: string;
  onMenuToggle?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName = 'Adithya R',
  userRole = 'Employee',
  onMenuToggle,
  onLogout,
}) => {
  return (
    <header className="h-16 bg-[#050508]/80 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-lg shadow-black/40">
      {/* Left: Mobile hamburger + Portal breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] lg:hidden transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="font-bold text-slate-200 tracking-tight">DAYFLOW</span>
          <span className="text-slate-600">/</span>
          <span className="font-mono text-xs text-purple-400/90 capitalize flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            {userRole} Portal
          </span>
        </div>
      </div>

      {/* Right: Notifications, User Pill & Sign Out */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-white/[0.06] border border-white/5 transition-all relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-black shadow-xs shadow-purple-500 animate-pulse"></span>
        </button>

        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

        {/* User Details Pill */}
        <div className="flex items-center gap-2.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/80 text-white font-bold flex items-center justify-center text-xs border border-indigo-400/30 flex-shrink-0 shadow-sm shadow-indigo-600/20">
            {userName.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">
              {userName}
            </div>
            <div className="text-[10px] text-slate-500 capitalize">{userRole}</div>
          </div>
        </div>

        {/* Sign Out Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="text-xs text-slate-300 hover:text-rose-300 hover:border-rose-500/30 px-2.5 sm:px-3 h-8"
        >
          <LogOut className="w-3.5 h-3.5 sm:mr-1.5 text-slate-400" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
};
