import React from 'react';
import { Zap, DollarSign, Coins, ArrowDown, ChevronRight, Sparkles, Layers } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const PremiumPoolFunding: React.FC = () => {
  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="quantum-node" theme="purple" size="md" />
        <div>
          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
            Section 01 • Quantum Inflow Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            HOW THE PREMIUM POOL IS FUNDED
          </h2>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
          Whenever a leader activates the $70 Quantum Package, the configured $8 USDT contribution from that activation is added to the Weekly Reward Premium pool.
        </p>
      </div>

      {/* Animated Visual Flow: $70 QUANTUM ACTIVATION ↓ $8 USDT ↓ PREMIUM REWARD POOL */}
      <div className="relative rounded-2xl p-6 bg-[#090510] border border-purple-500/30 overflow-hidden">
        {/* Ambient Purple Ray */}
        <div className="absolute inset-0 bg-radial from-purple-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto space-y-6 text-center">
          {/* Step 1: Package Activation */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-purple-500/40 shadow-md">
            <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest block font-bold">
              NODE ACTIVATION TRIGGER
            </span>
            <span className="text-base font-mono font-black text-white mt-1 block">
              $70 QUANTUM PACKAGE
            </span>
            <p className="text-[11px] text-zinc-400 mt-1">
              High-tier matrix leadership activation
            </p>
          </div>

          {/* Animated Downward Flow */}
          <div className="flex flex-col items-center justify-center gap-1 text-zinc-500">
            <div className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-mono font-bold text-xs shadow-sm">
              $8 USDT Configured Inflow
            </div>
            <ArrowDown className="w-5 h-5 text-cyan-400 animate-bounce motion-reduce:animate-none" />
          </div>

          {/* Step 2: Premium Pool Vault */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-950/70 via-zinc-950 to-black border border-purple-400/60 shadow-[0_0_35px_rgba(168,85,247,0.25)] relative group">
            <span className="absolute top-3 right-4 text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 uppercase">
              Smart Contract Reserve
            </span>

            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-950 border border-purple-400/60 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <Coins className="w-8 h-8 text-purple-400 animate-pulse motion-reduce:animate-none" />
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-mono font-black text-white tracking-wide">
              PREMIUM REWARD POOL
            </h3>

            <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
              Aggregated weekly capital reserved strictly for qualified leaders generating 3+ direct Quantum activations.
            </p>
          </div>

          {/* Dynamic Expansion Formula */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 flex items-center justify-center gap-3 font-mono text-xs">
            <span className="text-purple-300 font-bold">MULTIPLE ACTIVATIONS</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
            <span className="text-cyan-300 font-bold">LARGER WEEKLY POOL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
