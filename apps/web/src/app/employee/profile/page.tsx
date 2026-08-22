import React from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EmployeeProfilePage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="My Profile"
        description="Your personal, organization, and compliance identity details."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6 space-y-4">
          <div className="w-24 h-24 rounded-full bg-indigo-600 text-white font-bold text-3xl flex items-center justify-center mx-auto shadow-md">
            A
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Adithya R</h3>
            <p className="text-sm text-slate-500">Frontend Engineer</p>
            <Badge variant="success" className="mt-2">Aadhaar Verified</Badge>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-500 space-y-1">
            <div>Employee ID: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">EMP-001</span></div>
            <div>Joined: <span className="text-slate-700 dark:text-slate-300">January 2025</span></div>
          </div>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal & Employment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400">Email Address</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">adithya@dayflow.internal</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Department</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">Engineering</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Designation</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">Frontend Developer</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Reports To</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">Tech Lead / Engineering Manager</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Compliance Status</div>
                  <div className="font-medium text-emerald-600">KYC & Aadhaar Completed</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Branch Working On</div>
                  <div className="font-mono text-xs text-indigo-600 font-bold">adithya</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
