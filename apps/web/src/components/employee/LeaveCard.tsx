import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
        <CardTitle>Leave Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Casual Leave</div>
            <div className="text-xs text-slate-500">Used: {balances.casualLeave.used} of {balances.casualLeave.total}</div>
          </div>
          <Badge variant="info">{balances.casualLeave.remaining} Available</Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Sick Leave</div>
            <div className="text-xs text-slate-500">Used: {balances.sickLeave.used} of {balances.sickLeave.total}</div>
          </div>
          <Badge variant="warning">{balances.sickLeave.remaining} Available</Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Paid Leave</div>
            <div className="text-xs text-slate-500">Used: {balances.paidLeave.used} of {balances.paidLeave.total}</div>
          </div>
          <Badge variant="success">{balances.paidLeave.remaining} Available</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
