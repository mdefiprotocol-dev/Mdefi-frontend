import React from 'react';
import { ArrowDown, RotateCcw, ChevronRight, Coins, ShieldCheck, Sparkles } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const StarterCarryForward: React.FC = () => {
  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="usdt-pool" theme="amber" size="md" />
        <div>
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
            Section 06 • Liquidity Preservation
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            REWARD POOL CARRY-FORWARD
          </h2>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
          Reward funds do not simply disappear when a cycle closes. Any applicable remaining pool amount is carried forward according to the configured pool mechanism and can contribute to the next weekly cycle.
        </p>
      </div>

      {/* Animated Visual Flow: WEEK 01 POOL ↓ DISTRIBUTION ↓ REMAINING BALANCE ↓ CARRY FORWARD ↓ WEEK 02 POOL */}
      <div className="p-6 rounded-2xl bg-[#060c08] border border-cyan-500/25 space-y-4">
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold text-center sm:text-left">
          Epoch Liquidity Transition Flow
        </span>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 font-mono text-xs">
          {/* Week 01 Pool */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-amber-500/30 text-center w-full lg:w-auto min-w-[140px]">
            <span className="text-[10px] text-amber-400 font-bold block uppercase">Epoch N</span>
            <span className="text-sm font-black text-white mt-1 block">WEEK 01 POOL</span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Initial Funds</span>
          </div>

          <ChevronRight className="w-5 h-5 text-cyan-400 shrink-0 hidden lg:block" />
          <ArrowDown className="w-5 h-5 text-cyan-400 shrink-0 lg:hidden" />

          {/* Distribution */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 text-center w-full lg:w-auto min-w-[140px]">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase">Payout</span>
            <span className="text-sm font-black text-white mt-1 block">DISTRIBUTION</span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Qualified Users</span>
          </div>

          <ChevronRight className="w-5 h-5 text-cyan-400 shrink-0 hidden lg:block" />
          <ArrowDown className="w-5 h-5 text-cyan-400 shrink-0 lg:hidden" />

          {/* Remaining Balance */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-cyan-500/30 text-center w-full lg:w-auto min-w-[140px]">
            <span className="text-[10px] text-cyan-400 font-bold block uppercase">Residual</span>
            <span className="text-sm font-black text-white mt-1 block">REMAINING BALANCE</span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Unclaimed / Surplus</span>
          </div>

          <ChevronRight className="w-5 h-5 text-cyan-400 shrink-0 hidden lg:block" />
          <ArrowDown className="w-5 h-5 text-cyan-400 shrink-0 lg:hidden" />

          {/* Carry Forward */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-purple-500/40 text-center w-full lg:w-auto min-w-[140px]">
            <span className="text-[10px] text-purple-400 font-bold block uppercase">Protocol Rule</span>
            <span className="text-sm font-black text-white mt-1 block">CARRY FORWARD</span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Rollover Bridge</span>
          </div>

          <ChevronRight className="w-5 h-5 text-cyan-400 shrink-0 hidden lg:block" />
          <ArrowDown className="w-5 h-5 text-cyan-400 shrink-0 lg:hidden" />

          {/* Week 02 Pool */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-zinc-950 border border-emerald-400/60 text-center w-full lg:w-auto min-w-[140px] shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <span className="text-[10px] text-emerald-300 font-bold block uppercase">Epoch N+1</span>
            <span className="text-sm font-black text-white mt-1 block">WEEK 02 POOL</span>
            <span className="text-[10px] text-emerald-400/80 mt-1 block">Augmented Base</span>
          </div>
        </div>
      </div>
    </div>
  );
};
