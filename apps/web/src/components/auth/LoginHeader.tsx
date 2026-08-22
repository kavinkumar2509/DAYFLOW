import React from 'react';

export interface LoginHeaderProps {
  title?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ title = 'LOGIN' }) => {
  return (
    <div className="w-full text-left mb-3 pl-0.5">
      <span className="text-[13px] font-semibold text-slate-100 tracking-wider font-sans">
        {title}
      </span>
    </div>
  );
};
