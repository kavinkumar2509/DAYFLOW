'use client';

import React, { useState } from 'react';
import { User, Lock, ChevronDown } from 'lucide-react';

export interface LoginFormData {
  username: string;
  password: string;
  role: 'EMPLOYEE' | 'ADMIN';
  rememberMe: boolean;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void> | void;
  isLoading?: boolean;
  errorMessage?: string | null;
  onFirstLoginDetected?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  errorMessage = null,
  onFirstLoginDetected,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'ADMIN'>('EMPLOYEE');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    // Detect first-time login trigger if username has 'first' or 'new'
    if (username.toLowerCase().includes('first') || username.toLowerCase().includes('new')) {
      onFirstLoginDetected?.();
      return;
    }

    onSubmit({
      username,
      password,
      role,
      rememberMe,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-[215px] sm:w-[225px] flex flex-col items-center select-none">
      {/* 1. LOGIN Heading */}
      <div className="w-full text-left mb-3 pl-0.5">
        <span className="text-[13px] font-semibold text-slate-100 tracking-wider font-sans">
          LOGIN
        </span>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="w-full text-[10px] text-rose-400 mb-2.5 text-center bg-rose-950/40 py-1 px-2 rounded border border-rose-900/50">
          {errorMessage}
        </div>
      )}

      {/* Inputs Container */}
      <div className="w-full space-y-2.5">
        {/* 2. Username / Employee ID Field */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Username / Employee ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
            className="w-full h-8 pl-2.5 pr-7 text-xs text-slate-200 placeholder:text-slate-400/70 bg-black/40 border border-white/15 rounded-md focus:outline-none focus:border-white/35 transition-colors"
          />
          <User className="w-3.5 h-3.5 text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* 3. Password Field */}
        <div className="relative w-full">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            className="w-full h-8 pl-2.5 pr-7 text-xs text-slate-200 placeholder:text-slate-400/70 bg-black/40 border border-white/15 rounded-md focus:outline-none focus:border-white/35 transition-colors tracking-widest font-mono"
          />
          <Lock className="w-3.5 h-3.5 text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* 4. Job Role Field (Dropdown) */}
        <div className="relative w-full">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'EMPLOYEE' | 'ADMIN')}
            disabled={isLoading}
            className="w-full h-8 pl-2.5 pr-7 text-xs text-slate-200 bg-black/40 border border-white/15 rounded-md focus:outline-none focus:border-white/35 transition-colors appearance-none cursor-pointer"
          >
            <option value="EMPLOYEE" className="bg-[#121217] text-slate-200">
              Employee
            </option>
            <option value="ADMIN" className="bg-[#121217] text-slate-200">
              Admin
            </option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 5. LOGIN Button */}
      <div className="mt-3.5 flex justify-center w-full">
        <button
          type="submit"
          disabled={isLoading}
          className="w-[85px] h-[28px] flex items-center justify-center bg-[#18181f] hover:bg-[#23232c] active:bg-[#121217] text-slate-200 text-[10.5px] font-semibold tracking-wider uppercase rounded border border-white/15 shadow-sm transition-all disabled:opacity-50"
        >
          {isLoading ? '...' : 'LOGIN'}
        </button>
      </div>

      {/* 6. Bottom Options: Remember me & Forgot password? */}
      <div className="w-full flex items-center justify-between mt-3 text-[9.5px] text-slate-400/90 font-light px-0.5">
        <button
          type="button"
          onClick={() => setRememberMe(!rememberMe)}
          className={`hover:text-slate-200 transition-colors ${rememberMe ? 'text-slate-200 font-normal' : ''}`}
        >
          Remember me
        </button>
        <button
          type="button"
          onClick={() => alert('Password recovery link dispatched to registered email.')}
          className="hover:text-slate-200 transition-colors"
        >
          Forgot password?
        </button>
      </div>
    </form>
  );
};
