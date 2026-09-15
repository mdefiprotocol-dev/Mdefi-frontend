import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface ProtocolDisclaimerProps {
  moduleName?: string;
  theme?: 'emerald' | 'purple' | 'amber';
}

export const ProtocolDisclaimer: React.FC<ProtocolDisclaimerProps> = ({
  moduleName = 'Weekly Reward Protocol',
  theme = 'emerald',
}) => {
  const getBorder = () => {
    switch (theme) {
      case 'amber':
        return 'border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-zinc-950/80 to-zinc-950/90 text-amber-300';
      case 'purple':
        return 'border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-zinc-950/80 to-zinc-950/90 text-purple-300';
      default:
        return 'border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-zinc-950/80 to-zinc-950/90 text-emerald-300';
    }
  };

  return (
    <div className={`rounded-3xl p-6 sm:p-7 border ${getBorder()} shadow-xl relative overflow-hidden backdrop-blur-md`}>
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        <div className="w-11 h-11 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Official Protocol Disclosure &amp; Rules
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-zinc-400">
              Smart Contract Architecture
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            Information shown here describes the configured reward mechanism. Actual qualification, share allocation, distribution and claim availability are subject to the applicable smart-contract state, eligibility rules and available pool funds.
          </p>

          <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-4 text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Non-custodial pool execution
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Automated 7-day settlement
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              No fixed or guaranteed profit claims
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
