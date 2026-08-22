'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authApi } from '@/lib/api/auth';

export interface AadhaarVerificationModalProps {
  isOpen: boolean;
  email?: string;
  onClose: () => void;
  onVerifySuccess: () => void;
}

export const AadhaarVerificationModal: React.FC<AadhaarVerificationModalProps> = ({
  isOpen,
  email,
  onClose,
  onVerifySuccess,
}) => {
  const [step, setStep] = useState<'AADHAAR_INPUT' | 'OTP_INPUT' | 'SUCCESS'>('AADHAAR_INPUT');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('123456');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = aadhaarNumber.replace(/\s+/g, '');
    if (cleanNumber.length !== 12 || !/^\d+$/.test(cleanNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('OTP_INPUT');
    }, 400);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter the OTP sent to your linked mobile.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      await authApi.verifyAadhaar({
        aadhaarNumber: aadhaarNumber.replace(/\s+/g, ''),
        otp,
        email: email || undefined,
      } as any);

      setIsSubmitting(false);
      setStep('SUCCESS');
      setTimeout(() => {
        onVerifySuccess();
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Aadhaar verification failed. Please check details.');
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setStep('AADHAAR_INPUT');
    setAadhaarNumber('');
    setOtp('123456');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={resetModal} title="First-Time Login Verification">
      <div className="space-y-4">
        {step === 'AADHAAR_INPUT' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                As a new employee on DAYFLOW, please complete your Aadhaar identity verification to activate your workspace account.
              </p>
            </div>

            <Input
              label="12-Digit Aadhaar Number"
              type="text"
              maxLength={14}
              placeholder="123456789012"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              error={error}
              helperText="Encrypted and processed directly with UIDAI verification servers."
              required
            />

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Send Verification OTP
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}

        {step === 'OTP_INPUT' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-900/50">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                An OTP (use <strong>123456</strong> for sandbox) has been dispatched to your registered Aadhaar mobile.
              </p>
            </div>

            <Input
              label="Enter 6-Digit OTP"
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={error}
              required
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('AADHAAR_INPUT')}
                className="w-1/3"
              >
                Back
              </Button>
              <Button type="submit" className="w-2/3" isLoading={isSubmitting}>
                Verify & Continue
              </Button>
            </div>
          </form>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Identity Verified Successfully
            </h4>
            <p className="text-xs text-slate-500">
              Redirecting you to your employee dashboard...
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
