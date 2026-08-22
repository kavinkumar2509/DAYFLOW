'use client';

import React, { useState } from 'react';
import { LoginBackgroundMesh, LoginForm, AadhaarVerificationModal } from '@/components/auth';
import type { LoginFormData } from '@/components/auth/LoginForm';
import { authApi } from '@/lib/api/auth';
import { setAuthToken } from '@/lib/api/client';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAadhaarModal, setShowAadhaarModal] = useState(false);
  const [targetRole, setTargetRole] = useState<'EMPLOYEE' | 'ADMIN'>('EMPLOYEE');
  const [pendingEmail, setPendingEmail] = useState<string>('');

  /**
   * Handle user login submission with backend API
   */
  const handleLogin = async (formData: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTargetRole(formData.role);

    const email = formData.username.includes('@')
      ? formData.username.trim().toLowerCase()
      : `${formData.username.trim().toLowerCase()}@dayflow.com`;

    setPendingEmail(email);

    try {
      const response = await authApi.login({
        email,
        password: formData.password,
      });

      if (response.firstLogin) {
        setShowAadhaarModal(true);
        setIsLoading(false);
        return;
      }

      if (response.token) {
        setAuthToken(response.token, response.user.role);
      }

      // Role-based redirection via window.location to ensure cookies are sent with HTTP request
      const targetUrl = response.user.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard';
      window.location.href = targetUrl;
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password.');
      setIsLoading(false);
    }
  };

  /**
   * Handle first-time login Aadhaar verification step
   */
  const handleFirstLoginTriggered = () => {
    setShowAadhaarModal(true);
  };

  /**
   * Post-Aadhaar verification redirect
   */
  const handleAadhaarSuccess = () => {
    setShowAadhaarModal(false);
    const targetUrl = targetRole === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard';
    window.location.href = targetUrl;
  };

  return (
    <main className="relative w-full min-h-screen bg-[#000000] text-slate-100 flex items-center justify-center overflow-hidden">
      {/* Decorative Abstract Wireframe Mesh Waves */}
      <LoginBackgroundMesh />

      {/* Main Enlarged Circular Glassmorphism Container */}
      <div className="relative z-10 flex items-center justify-center p-4 transform translate-y-0 lg:-translate-x-8">
        <div
          className="relative w-[340px] h-[340px] sm:w-[410px] sm:h-[410px] md:w-[430px] md:h-[430px] rounded-full flex items-center justify-center bg-[#07070a]/75 backdrop-blur-xl border border-white/[0.09] shadow-2xl transition-all"
          style={{
            boxShadow:
              'inset 0 0 50px rgba(255, 255, 255, 0.025), inset -16px -16px 36px rgba(20, 184, 166, 0.04), inset 16px 16px 36px rgba(168, 85, 247, 0.06), 0 30px 60px -15px rgba(0, 0, 0, 0.9)',
          }}
        >
          {/* Subtle internal atmospheric lights */}
          <div className="absolute top-12 left-12 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-12 right-12 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-8 left-16 w-24 h-24 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Centered Form */}
          <div className="relative z-20 flex flex-col items-center justify-center">
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onFirstLoginDetected={handleFirstLoginTriggered}
            />
          </div>
        </div>
      </div>

      {/* Subtle branding mark in bottom-left corner of the screen */}
      <div className="absolute bottom-5 left-6 z-20 flex items-center gap-1.5 opacity-40 hover:opacity-75 transition-opacity select-none">
        <div className="w-2.5 h-2.5 rounded-xs bg-indigo-500/70" />
        <span className="text-[10px] font-mono tracking-widest text-slate-500">
          DAYFLOW HRMS
        </span>
      </div>

      {/* Modular First-Login Aadhaar Modal */}
      <AadhaarVerificationModal
        isOpen={showAadhaarModal}
        email={pendingEmail}
        onClose={() => setShowAadhaarModal(false)}
        onVerifySuccess={handleAadhaarSuccess}
      />
    </main>
  );
}
