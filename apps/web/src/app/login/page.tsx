'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'ADMIN' | 'HR'>('EMPLOYEE');
  const [isLoading, setIsLoading] = useState(false);

  // Aadhaar first-login state
  const [showAadhaarModal, setShowAadhaarModal] = useState(false);
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [aadhaarStep, setAadhaarStep] = useState<'NUMBER' | 'OTP'>('NUMBER');
  const [aadhaarError, setAadhaarError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Backend integration placeholder:
      // const res = await authApi.login({ email, password });
      // In starter demo, simulate first-login detection or role redirect
      
      // Simulate first-login scenario if email has 'first' in it or role is EMPLOYEE (demo placeholder)
      const isFirstLoginDemo = email.includes('new') || email.includes('first');

      if (isFirstLoginDemo) {
        setShowAadhaarModal(true);
        setIsLoading(false);
        return;
      }

      // Role-based redirect logic:
      if (role === 'ADMIN' || role === 'HR') {
        router.push('/admin/dashboard');
      } else {
        router.push('/employee/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAadhaarVerify = async () => {
    if (aadhaarStep === 'NUMBER') {
      if (aadhaarInput.replace(/\s/g, '').length !== 12) {
        setAadhaarError('Please enter a valid 12-digit Aadhaar number');
        return;
      }
      setAadhaarError('');
      setAadhaarStep('OTP');
      return;
    }

    if (aadhaarStep === 'OTP') {
      // Forward Aadhaar payload to backend without local persistence
      // await authApi.verifyAadhaar({ aadhaarNumber: aadhaarInput, otp: aadhaarOtp });
      setShowAadhaarModal(false);
      setAadhaarInput('');
      setAadhaarOtp('');
      
      // Post-verification role redirect
      if (role === 'ADMIN' || role === 'HR') {
        router.push('/admin/dashboard');
      } else {
        router.push('/employee/dashboard');
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 shadow-md">
            D
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign in to DAYFLOW</h1>
          <p className="text-xs text-slate-500 mt-1">Single sign-on for all organizational roles</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">Single Login Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Work Email / Employee ID"
                type="text"
                placeholder="name@dayflow.internal or EMP-001"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Demo role selector to test role-based redirects before backend is attached */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-500">
                  Select Role (Starter Simulation)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['EMPLOYEE', 'ADMIN', 'HR'] as const).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all ${
                        role === r
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-semibold dark:bg-indigo-950 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* First-Login Aadhaar Verification Modal */}
      <Modal
        isOpen={showAadhaarModal}
        onClose={() => setShowAadhaarModal(false)}
        title="First-Time Login Verification"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Welcome to DAYFLOW. As part of your first-time onboarding, please complete your Aadhaar identity verification.
          </p>

          {aadhaarStep === 'NUMBER' ? (
            <div className="space-y-3">
              <Input
                label="12-Digit Aadhaar Number"
                type="text"
                maxLength={12}
                placeholder="XXXX XXXX XXXX"
                value={aadhaarInput}
                onChange={(e) => setAadhaarInput(e.target.value.replace(/\D/g, ''))}
                error={aadhaarError}
                helperText="Secure verification via official UIDAI gateway."
              />
              <Button onClick={handleAadhaarVerify} className="w-full">
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                label="Enter 6-Digit OTP"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={aadhaarOtp}
                onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, ''))}
                helperText="OTP sent to mobile linked with Aadhaar"
              />
              <Button onClick={handleAadhaarVerify} className="w-full">
                Complete Verification & Enter
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </main>
  );
}
