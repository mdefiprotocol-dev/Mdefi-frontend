import React from 'react';
import { Sparkles, Clock, Compass, Layers, ShieldCheck } from 'lucide-react';

export const MbttcClosingNotice: React.FC = () => {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-[#0a1610] via-[#0d2017] to-[#0a1610] border border-emerald-500/30 p-7 sm:p-9 shadow-[0_0_40px_rgba(16,185,129,0.12)] overflow-hidden text-center">
      {/* Animated Light Sweep Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent transform -skew-x-12 animate-light-sweep" />
      </div>

      {/* Ambient Glows */}
      <div className="absolute -top-16 left-1/4 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse duration-[4000ms]" />
      <div className="absolute -bottom-16 right-1/4 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse duration-[5000ms]" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.25)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>COMING SOON — MORE MBTTC FEATURES</span>
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Claim Your MBTTC Reward Every 4 Hours
        </h3>

        <p className="text-sm text-zinc-300 leading-relaxed max-w-xl mx-auto">
          More utilities and ecosystem features are on the way. Decentralized liquidity staking, multi-token farming pools, and governance voting will deploy in upcoming phases.
        </p>

        {/* Feature Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-zinc-950/70 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            4-Hour Cycle Minting
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-zinc-950/70 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            PancakeSwap V3 Pool (Phase 7)
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-zinc-950/70 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Audited Smart Contracts
          </span>
        </div>
      </div>
    </div>
  );
};
