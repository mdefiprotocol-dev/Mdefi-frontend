import React from 'react';
import { Coins, Plus, ArrowDown, Sparkles, Layers, DollarSign } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const StarterPoolFunding: React.FC = () => {
  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header with Icon */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="pool" theme="amber" size="md" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
              Section 01 • Liquidity Architecture
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            HOW THE REWARD POOL IS FUNDED
          </h2>
        </div>
      </div>

      {/* Explanation Text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs">
            <Layers className="w-4 h-4" />
            <span>Matrix Package Inflow</span>
          </div>
          <p>
            Whenever a user activates a package in the ecosystem, the matrix contract allocates the configured reward-pool contribution directly to the Weekly Reward Starter pool.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Carry-Forward Integration</span>
          </div>
          <p>
            Any eligible carry-forward amount from the previous cycle and new funds entering during the current cycle are combined to determine the current week's reward pool.
          </p>
        </div>
      </div>

      {/* Animated Visual Pool Flow Diagram */}
      <div className="relative rounded-2xl p-6 bg-[#050c08] border border-emerald-500/25 overflow-hidden">
        {/* Ambient Pool Center Glow */}
        <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto space-y-6 text-center">
          {/* Top Sources Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Previous Week Carry Forward */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-cyan-500/30 shadow-md">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                PREVIOUS WEEK
              </span>
              <span className="text-sm font-mono font-black text-white mt-1 block">
                Carry Forward
              </span>
              <p className="text-[11px] text-zinc-400 mt-1">
                Unallocated / rolling protocol balance
              </p>
            </div>

            {/* Current Week Inflow */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-amber-500/30 shadow-md">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                CURRENT WEEK
              </span>
              <span className="text-sm font-mono font-black text-white mt-1 block">
                New Pool Funding
              </span>
              <p className="text-[11px] text-zinc-400 mt-1">
                Direct activations from S4 Senior Nodes
              </p>
            </div>
          </div>

          {/* Flow Connector Arrow & Animation */}
          <div className="flex flex-col items-center justify-center gap-2 text-zinc-500">
            <div className="flex items-center gap-3">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-emerald-500/60" />
              <Plus className="w-4 h-4 text-emerald-400" />
              <div className="w-16 h-[1px] bg-gradient-to-r from-emerald-500/60 via-amber-500/40 to-transparent" />
            </div>

            {/* Animated Flow Stream (USDT particles) */}
            <div className="flex items-center gap-1.5 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce motion-reduce:animate-none" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-150 motion-reduce:animate-none" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-300 motion-reduce:animate-none" />
            </div>

            <ArrowDown className="w-5 h-5 text-emerald-400 animate-pulse motion-reduce:animate-none" />
          </div>

          {/* Central Animated Pool */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-950/60 via-zinc-950 to-black border border-emerald-400/50 shadow-[0_0_35px_rgba(16,185,129,0.25)] relative group">
            {/* Corner status tag */}
            <span className="absolute top-3 right-4 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase">
              Smart Contract Vault
            </span>

            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-400/60 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <Coins className="w-8 h-8 text-emerald-400 animate-pulse motion-reduce:animate-none" />
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-mono font-black text-white tracking-wide">
              TOTAL WEEKLY REWARD POOL
            </h3>

            <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
              Combined liquidity available for proportional share distribution at the end of the active 7-day epoch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
