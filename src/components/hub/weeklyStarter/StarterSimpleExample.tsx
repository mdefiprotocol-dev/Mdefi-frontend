import React from 'react';
import { HelpCircle, Users, Share2, Scale, Info, Sparkles } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const StarterSimpleExample: React.FC = () => {
  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="share" theme="amber" size="md" />
        <div>
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
            Section 09 • Scenario Walkthrough
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            SIMPLE EXAMPLE
          </h2>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
        Observe how relative team performance determines share weight between two qualified community members.
      </p>

      {/* User A vs User B Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* User A */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#090e0b] border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300">
              PARTICIPANT A
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Baseline Qualifier</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-zinc-400">Eligible Direct Activations:</span>
              <span className="text-amber-300 font-bold">2 Directs</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-zinc-400">Resulting Share Count:</span>
              <span className="text-cyan-300 font-bold">2 Shares</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-zinc-400">Pool Weight:</span>
              <span className="text-emerald-300 font-bold">Base Allocation</span>
            </div>
          </div>
        </div>

        {/* User B */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#090e0b] border border-cyan-500/40 space-y-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              PARTICIPANT B
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Active Builder</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-zinc-400">Eligible Direct Activations:</span>
              <span className="text-amber-300 font-bold">5 Directs</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-zinc-400">Resulting Share Count:</span>
              <span className="text-cyan-300 font-bold">5 Shares</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/5">
              <span className="text-zinc-400">Pool Weight:</span>
              <span className="text-emerald-300 font-bold">2.5× Larger Allocation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytical Conclusion */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-900/90 via-black to-zinc-900/90 border border-zinc-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Core Takeaway</span>
        </div>
        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
          Therefore, User B has a larger share allocation than User A within the same qualified distribution pool. The actual reward depends on the distributable pool and total qualified shares for that cycle.
        </p>
      </div>
    </div>
  );
};
