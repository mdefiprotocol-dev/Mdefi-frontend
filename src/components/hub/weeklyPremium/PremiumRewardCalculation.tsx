import React from 'react';
import { Divide, X, Equal, Info, Sparkles, ShieldCheck } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const PremiumRewardCalculation: React.FC = () => {
  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="distribution" theme="purple" size="md" />
        <div>
          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
            Section 05 • Calculation Formula
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            HOW YOUR PREMIUM REWARD IS CALCULATED
          </h2>
        </div>
      </div>

      {/* Visual Formula Card */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#0c0515] via-black to-[#06030c] border border-purple-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-3 right-4 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40">
          Proportional Share Allocation
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 font-mono text-center my-2">
          {/* Fraction: YOUR SHARES / TOTAL QUALIFIED SHARES */}
          <div className="flex flex-col items-center">
            <div className="px-4 py-2 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 font-bold text-sm sm:text-base">
              YOUR SHARES
            </div>
            <div className="w-full h-0.5 bg-purple-400 my-2 shadow-[0_0_8px_#a855f7]" />
            <div className="px-4 py-2 rounded-xl bg-zinc-900/90 border border-zinc-700 text-zinc-300 font-bold text-xs sm:text-sm">
              TOTAL QUALIFIED SHARES
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-purple-400">
            ×
          </div>

          <div className="px-5 py-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold text-sm sm:text-base shadow-sm">
            DISTRIBUTABLE PREMIUM POOL
          </div>

          <div className="text-xl sm:text-2xl font-black text-purple-400">
            =
          </div>

          <div className="px-6 py-4 rounded-2xl bg-purple-950/90 border border-purple-400/80 text-purple-200 font-black text-base sm:text-lg shadow-[0_0_25px_rgba(168,85,247,0.35)]">
            YOUR PREMIUM REWARD
          </div>
        </div>
      </div>

      {/* Illustrative Calculation Example */}
      <div className="p-5 rounded-2xl bg-[#090610] border border-purple-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Hypothetical Share Calculation Model
          </span>
          <span className="text-[10px] font-mono text-cyan-400">Illustrative Only</span>
        </div>

        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
          If the configured distribution produces an effective resulting value of $100 per qualified share:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-black/60 border border-purple-500/30 flex items-center justify-between">
            <span className="text-zinc-400">3 Shares (3 Directs):</span>
            <span className="text-purple-300 font-bold text-sm">$300 USDT</span>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-purple-500/30 flex items-center justify-between">
            <span className="text-zinc-400">5 Shares (5 Directs):</span>
            <span className="text-cyan-300 font-bold text-sm">$500 USDT</span>
          </div>
        </div>

        {/* Mandatory Explicit Label */}
        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] font-mono text-purple-200 flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            Illustrative calculation only. Actual distribution depends on the applicable pool and total qualified shares.
          </span>
        </div>
      </div>
    </div>
  );
};
