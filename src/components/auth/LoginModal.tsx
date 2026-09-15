import React, { useState, useEffect } from 'react';
import { 
  X, 
  LogIn, 
  Wallet, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { formatCompactAddress } from '../../utils/formatAddress';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedWalletAddress?: string;
  onLoginSuccess: (userIdentifier: string) => void;
  onSwitchToRegister: () => void;
  onSwitchWallet?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  connectedWalletAddress = '0x71C839Fa24e93C298B321f8a84620a3b221B389',
  onLoginSuccess,
  onSwitchToRegister,
  onSwitchWallet,
}) => {
  const [identifier, setIdentifier] = useState('MDF-08421');

  if (!isOpen) return null;

  const shortenAddress = (addr: string) => {
    return formatCompactAddress(addr);
  };

  const handleWalletLogin = () => {
    onLoginSuccess(connectedWalletAddress);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim()) {
      onLoginSuccess(identifier.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl select-none overflow-y-auto">
      <div 
        className="relative w-full max-w-md my-auto max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#081810] via-[#05110a] to-[#030906] border-2 border-emerald-500/40 shadow-[0_0_70px_rgba(16,185,129,0.3)] p-5 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Account Login
              </h3>
              <span className="text-xs text-zinc-400 font-mono">
                Access MDeFi Web3 Dashboard
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Connected Wallet Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider block">
              Connected Web3 Wallet
            </span>
            {onSwitchWallet && (
              <button
                type="button"
                onClick={onSwitchWallet}
                className="text-[11px] font-mono text-emerald-400 hover:underline cursor-pointer"
              >
                Change Wallet
              </button>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-mono font-bold text-white block">
                  {shortenAddress(connectedWalletAddress)}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  BNB Smart Chain (Active)
                </span>
              </div>
            </div>

            <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          {/* Direct Wallet Login Button */}
          <button
            onClick={handleWalletLogin}
            className="w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <span>ENTER WITH CONNECTED WALLET</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Or via MDeFi User ID</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        {/* Form: Enter ID */}
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300 block">
              MDeFi User ID:
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. MDF-08421"
                className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 focus:border-emerald-400 text-sm font-mono text-white placeholder-zinc-600 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-zinc-200 hover:text-white bg-zinc-900 border border-zinc-700/80 hover:border-emerald-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>LOGIN WITH USER ID</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch to Register */}
        <div className="pt-2 text-center text-xs text-zinc-400 border-t border-zinc-900">
          Don't have an account yet?{' '}
          <button
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            className="text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            Register Account
          </button>
        </div>
      </div>
    </div>
  );
};
