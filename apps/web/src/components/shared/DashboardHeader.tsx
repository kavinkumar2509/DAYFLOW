import React from 'react';

export interface DashboardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] mb-6">
      {/* Subtle ambient backglow for header */}
      <div className="absolute -top-6 -left-6 w-48 h-16 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-100 font-sans">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="relative z-10 flex items-center gap-2.5 flex-wrap">{action}</div>}
    </div>
  );
};
