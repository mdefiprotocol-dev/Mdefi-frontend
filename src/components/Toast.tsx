import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="pointer-events-auto p-3.5 rounded-2xl bg-[#0e1611]/95 border border-emerald-500/30 text-white shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 animate-in slide-in-from-right-4 fade-in">
      <div className="flex items-start gap-2.5">
        {getIcon()}
        <div>
          <h5 className="text-xs font-bold text-zinc-100">{toast.title}</h5>
          <p className="text-[11px] text-zinc-300 mt-0.5 leading-snug">{toast.description}</p>
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export interface ToastProps {
  message: string;
  type?: 'success' | 'warning' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 max-w-sm w-full pointer-events-auto p-3.5 rounded-2xl bg-[#0e1611]/95 border border-emerald-500/40 text-white shadow-[0_0_30px_rgba(16,185,129,0.2)] backdrop-blur-xl flex items-start justify-between gap-3 animate-in slide-in-from-right-4 fade-in">
      <div className="flex items-start gap-2.5">
        {getIcon()}
        <div>
          <h5 className="text-xs font-bold text-zinc-100 uppercase font-mono tracking-wider">
            {type === 'success' ? 'Confirmed' : type === 'warning' ? 'Alert' : 'Notification'}
          </h5>
          <p className="text-[11px] text-zinc-300 mt-0.5 leading-snug">{message}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
