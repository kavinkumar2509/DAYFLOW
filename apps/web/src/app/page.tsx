import React from 'react';
import Link from 'next/link';
import { LoginBackgroundMesh } from '@/components/auth';

export default function HomePage() {
  return (
    <main className="relative w-full min-h-screen bg-[#000000] text-slate-100 flex items-center justify-center overflow-hidden p-4">
      {/* Decorative Abstract Wireframe Mesh Waves (Red/Orange lower-left, Purple upper-right) */}
      <LoginBackgroundMesh />

      {/* Main Enlarged Circular Glassmorphism Container */}
      <div className="relative z-10 flex items-center justify-center">
        <div
          className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[500px] md:h-[500px] rounded-full flex flex-col items-center justify-center p-6 sm:p-10 bg-[#07070a]/75 backdrop-blur-xl border border-white/[0.09] shadow-2xl transition-all text-center select-none"
          style={{
            boxShadow:
              'inset 0 0 60px rgba(255, 255, 255, 0.025), inset -20px -20px 40px rgba(20, 184, 166, 0.04), inset 20px 20px 40px rgba(168, 85, 247, 0.06), 0 35px 70px -15px rgba(0, 0, 0, 0.95)',
          }}
        >
          {/* Subtle internal atmospheric lights */}
          <div className="absolute top-12 left-12 w-36 h-36 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-12 right-12 w-36 h-36 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-8 left-16 w-28 h-28 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Centered Content Structure */}
          <div className="relative z-20 flex flex-col items-center justify-center max-w-[280px] sm:max-w-[340px] space-y-3 sm:space-y-4">
            {/* 1. DAYFLOW "D" LOGO */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl sm:text-2xl font-extrabold shadow-md shadow-indigo-500/25 border border-indigo-400/20">
              D
            </div>

            {/* 2. Main Title & 3. Subtitle */}
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
                DAYFLOW HRMS
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-snug">
                Streamlined Employee & HR Operations Portal
              </p>
            </div>

            {/* 4. Welcome Message */}
            <p className="text-[10px] sm:text-[11.5px] text-slate-400/80 leading-relaxed px-2">
              Single entry point for Employees, HR Managers, and Admins.
            </p>

            {/* 5. Proceed to Login Button */}
            <div className="pt-1 sm:pt-2 w-full max-w-[200px] sm:max-w-[220px]">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center h-8 sm:h-9 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md shadow-indigo-600/25 transition-all border border-indigo-400/30"
              >
                Proceed to Login
              </Link>
            </div>

            {/* 6. Feature Items */}
            <div className="pt-1 text-[9.5px] sm:text-[11px] text-slate-400/80 flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3 gap-y-1">
              <span>• Attendance Tracking</span>
              <span>• Leave Approvals</span>
              <span>• Payroll Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle branding mark in bottom-left corner of the screen */}
      <div className="absolute bottom-5 left-6 z-20 flex items-center gap-1.5 opacity-40 hover:opacity-75 transition-opacity select-none">
        <div className="w-2.5 h-2.5 rounded-xs bg-indigo-500/70" />
        <span className="text-[10px] font-mono tracking-widest text-slate-500">
          DAYFLOW
        </span>
      </div>
    </main>
  );
}
