import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white/[0.05] text-slate-300 border border-white/10',
    success: 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 shadow-xs shadow-emerald-500/10',
    warning: 'bg-amber-950/40 text-amber-300 border border-amber-500/30 shadow-xs shadow-amber-500/10',
    danger: 'bg-rose-950/40 text-rose-300 border border-rose-500/30 shadow-xs shadow-rose-500/10',
    info: 'bg-purple-950/40 text-purple-300 border border-purple-500/30 shadow-xs shadow-purple-500/10',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
