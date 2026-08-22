import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-[#08080c]/70 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl transition-all hover:border-white/[0.14] ${className}`}
      style={{
        boxShadow:
          'inset 0 0 25px rgba(255, 255, 255, 0.015), inset 0 0 15px rgba(168, 85, 247, 0.03), 0 20px 40px -15px rgba(0, 0, 0, 0.8)',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`border-b border-white/[0.06] pb-3.5 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <h3 className={`text-sm sm:text-base font-semibold text-slate-100 tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return <div className={`${className}`} {...props}>{children}</div>;
};
