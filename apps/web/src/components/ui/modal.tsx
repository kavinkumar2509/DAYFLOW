import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div
        className="bg-[#08080c]/90 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/[0.12] transition-all text-slate-100"
        style={{
          boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.02), 0 25px 60px -15px rgba(0, 0, 0, 0.95)',
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <h3 className="text-base font-semibold text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-white/[0.06]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
