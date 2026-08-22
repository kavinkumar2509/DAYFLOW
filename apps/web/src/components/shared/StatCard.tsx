import React from 'react';
import { Card } from '@/components/ui/card';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  accentColor?: 'purple' | 'orange' | 'teal' | 'emerald';
  badge?: {
    text: string;
    variant?: 'success' | 'warning' | 'info' | 'danger';
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'purple',
  badge,
  className = '',
}) => {
  const badgeStyles = {
    success: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 shadow-xs shadow-emerald-500/10',
    warning: 'bg-amber-950/40 text-amber-300 border-amber-500/30 shadow-xs shadow-amber-500/10',
    info: 'bg-purple-950/40 text-purple-300 border-purple-500/30 shadow-xs shadow-purple-500/10',
    danger: 'bg-rose-950/40 text-rose-300 border-rose-500/30 shadow-xs shadow-rose-500/10',
  };

  const iconAccentStyles = {
    purple: 'text-purple-400 bg-purple-950/30 border-purple-500/20 shadow-purple-500/10',
    orange: 'text-orange-400 bg-orange-950/30 border-orange-500/20 shadow-orange-500/10',
    teal: 'text-teal-400 bg-teal-950/30 border-teal-500/20 shadow-teal-500/10',
    emerald: 'text-emerald-400 bg-emerald-950/30 border-emerald-500/20 shadow-emerald-500/10',
  };

  return (
    <Card className={`p-4 sm:p-5 flex flex-col justify-between group hover:scale-[1.01] transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 tracking-wide">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight font-sans">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`p-2.5 rounded-xl border shadow-sm transition-transform group-hover:scale-105 flex-shrink-0 ${
              iconAccentStyles[accentColor]
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || badge) && (
        <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs">
          {subtitle && <span className="text-slate-400 truncate text-[11.5px] font-light">{subtitle}</span>}
          {badge && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium border flex-shrink-0 ${
                badgeStyles[badge.variant || 'info']
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
