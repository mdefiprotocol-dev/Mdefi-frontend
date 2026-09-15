import React from 'react';
import { PieChart, Divide, X, Equal, Info, Sparkles, ShieldCheck } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const StarterPoolDistribution: React.FC = () => {
  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="distribution" theme="amber" size="md" />
        <div>
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
            Section 05 • Mathematical Model
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            HOW THE WEEKLY POOL IS DISTRIBUTED
          </h2>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
        At the end of each 7-day cycle, the distribution amount is calculated for qualified participants according to their share allocation.
      </p>

      {/* Visual Formula Card */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#061009] via-black to-[#0a120b] border border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-3 right-4 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
          Proportional Formula
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 font-mono text-center my-2">
          {/* Fraction Fraction: YOUR SHARES / TOTAL QUALIFIED SHARES */}
          <div className="flex flex-col items-center">
            <div className="px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold text-sm sm:text-base">
              YOUR SHARES
            </div>
            <div className="w-full h-0.5 bg-emerald-400 my-2 shadow-[0_0_8px_#34d399]" />
            <div className="px-4 py-2 rounded-xl bg-zinc-900/90 border border-zinc-700 text-zinc-300 font-bold text-xs sm:text-sm">
              TOTAL QUALIFIED SHARES
            </div>
          </div>

          {/* Multiplication Operator */}
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            ×
          </div>

          {/* Distributable Pool Box */}
          <div className="px-5 py-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold text-sm sm:text-base shadow-sm">
            DISTRIBUTABLE POOL
          </div>

          {/* Equals Operator */}
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            =
          </div>

          {/* Result Box */}
          <div className="px-6 py-4 rounded-2xl bg-emerald-950/90 border border-emerald-400/80 text-emerald-300 font-black text-base sm:text-lg shadow-[0_0_25px_rgba(16,185,129,0.35)]">
            YOUR REWARD
          </div>
        </div>

        <p className="text-[11px] font-mono text-zinc-400 text-center mt-4">
          Conceptual share-based distribution model • No fixed dollar-per-share values are guaranteed
        </p>
      </div>

      {/* Conceptual Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-amber-300 font-bold block">1. Dynamic Denominator</span>
          <p className="text-zinc-400 font-sans text-xs">
            The total qualified shares count varies weekly based on active member qualification across the ecosystem.
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-cyan-300 font-bold block">2. Variable Pool Depth</span>
          <p className="text-zinc-400 font-sans text-xs">
            The distributable pool scale depends directly on weekly network activation volume plus carried forward liquidity.
          </p>
        </div>
      </div>
    </div>
  );
};
