import React from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Mail, Building, Briefcase, Calendar, GitBranch } from 'lucide-react';
import { mockEmployeeProfile } from '@/lib/mock/dashboardData';

export default function EmployeeProfilePage() {
  const profile = mockEmployeeProfile;

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      <DashboardHeader
        title="My Profile"
        description="Your personal, organization, and compliance identity records."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="text-center p-6 space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600/90 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{profile.name}</h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">{profile.role}</p>
            <Badge variant="success" className="mt-2.5 inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Aadhaar Verified
            </Badge>
          </div>
          <div className="border-t border-white/[0.06] pt-4 text-xs text-slate-400 space-y-1.5 font-light">
            <div>Employee ID: <span className="font-mono font-semibold text-slate-200">{profile.employeeId}</span></div>
            <div>Joined: <span className="text-slate-200">{profile.joinedDate}</span></div>
          </div>
        </Card>

        {/* Detailed Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Employment & Compliance Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3 p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                  <Mail className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <div className="text-[11px] text-slate-500 font-light">Work Email</div>
                    <div className="font-medium text-slate-200 mt-0.5">{profile.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                  <Building className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <div className="text-[11px] text-slate-500 font-light">Department</div>
                    <div className="font-medium text-slate-200 mt-0.5">{profile.department}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                  <Briefcase className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <div className="text-[11px] text-slate-500 font-light">Designation</div>
                    <div className="font-medium text-slate-200 mt-0.5">{profile.role}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                  <GitBranch className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <div className="text-[11px] text-slate-500 font-light">Active Git Branch</div>
                    <div className="font-mono text-xs font-bold text-purple-400 mt-0.5">adithya</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
