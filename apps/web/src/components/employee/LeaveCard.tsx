import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import type { LeaveBalance } from '@/types/leave';

export interface LeaveCardProps {
  balances?: LeaveBalance;
}

export const LeaveCard: React.FC<LeaveCardProps> = ({
  balances = {
    casualLeave: { total: 12, used: 3, remaining: 9 },
    sickLeave: { total: 10, used: 2, remaining: 8 },
    paidLeave: { total: 15, used: 5, remaining: 10 },
  },
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-purple-400" />
          Leave Quotas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          <div>
            <div className="text-xs sm:text-sm font-medium text-slate-200">Casual Leave</div>
            <div className="text-[11px] text-slate-400 font-light">Used: {balances.casualLeave.used} of {balances.casualLeave.total}</div>
          </div>
          <Badge variant="info">{balances.casualLeave.remaining} Available</Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          <div>
            <div className="text-xs sm:text-sm font-medium text-slate-200">Sick Leave</div>
            <div className="text-[11px] text-slate-400 font-light">Used: {balances.sickLeave.used} of {balances.sickLeave.total}</div>
          </div>
          <Badge variant="warning">{balances.sickLeave.remaining} Available</Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          <div>
            <div className="text-xs sm:text-sm font-medium text-slate-200">Paid Leave</div>
            <div className="text-[11px] text-slate-400 font-light">Used: {balances.paidLeave.used} of {balances.paidLeave.total}</div>
          </div>
          <Badge variant="success">{balances.paidLeave.remaining} Available</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
