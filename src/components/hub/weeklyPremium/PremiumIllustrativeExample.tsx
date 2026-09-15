import React from 'react';
import { Diamond, Scale, Info, Sparkles } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const PremiumIllustrativeExample: React.FC = () => {
  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="share" theme="purple" size="md" />
        <div>
          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
            Section 09 • Scenario Walkthrough
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            ILLUSTRATIVE EXAMPLE
          </h2>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
        Compare how varying levels of Quantum direct team expansion affect share weight within the same active cycle.
      </p>

      {/* Leader A vs Leader B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Leader A */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#090510] border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300">
              LEADER A
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Baseline Qualifier</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-zinc-400">Direct Quantum Activations:</span>
              <span className="text-purple-300 font-bold">3 Directs</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-zinc-400">Allocated Shares:</span>
              <span className="text-cyan-300 font-bold">3 Shares</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-zinc-400">Relative Weight:</span>
              <span className="text-emerald-300 font-bold">Base Pool Proportion</span>
            </div>
          </div>
        </div>

        {/* Leader B */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#090510] border border-cyan-500/40 space-y-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              LEADER B
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Accelerated Quantum Leader</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-zinc-400">Direct Quantum Activations:</span>
              <span className="text-purple-300 font-bold">6 Directs</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-zinc-400">Allocated Shares:</span>
              <span className="text-cyan-300 font-bold">6 Shares</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-zinc-400">Relative Weight:</span>
              <span className="text-emerald-300 font-bold">2.0× Higher Allocation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytical Conclusion */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-900/90 via-black to-zinc-900/90 border border-zinc-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
          <Scale className="w-4 h-4 text-purple-400" />
          <span>Core Takeaway</span>
        </div>
        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
          Leader B earns double the share allocation of Leader A within the same cycle pool. The actual reward amount depends on the distributable pool and total qualified shares for that cycle.
        </p>
      </div>
    </div>
  );
};
