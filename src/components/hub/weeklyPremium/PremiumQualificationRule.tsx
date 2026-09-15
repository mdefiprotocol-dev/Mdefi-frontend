import React, { useState } from 'react';
import { Users, CheckCircle2, ChevronRight, Share2, Sparkles, Diamond } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const PremiumQualificationRule: React.FC = () => {
  const [activeTier, setActiveTier] = useState(3);

  const tiers = [
    { directs: 3, shares: 3, label: 'Minimum Qualification', status: 'Qualified', note: 'Base Leadership Tier' },
    { directs: 4, shares: 4, label: '+1 Direct', status: 'Scale Up', note: 'Expanded Allocation' },
    { directs: 5, shares: 5, label: '+2 Directs', status: 'High Performance', note: 'Strong Pool Weight' },
    { directs: 6, shares: 6, label: '+3 Directs', status: 'Top Quantum Leader', note: 'Maximum Weight' },
  ];

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="team" theme="purple" size="md" />
        <div>
          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
            Section 02 • Qualification Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            THE 3-DIRECT QUALIFICATION RULE
          </h2>
        </div>
      </div>

      {/* Primary Pipeline: 3 DIRECTS → 3 SHARES → QUALIFIED */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/30 via-zinc-900/60 to-cyan-950/30 border border-purple-500/30 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 font-mono font-black">
          <div className="px-4 py-2.5 rounded-xl bg-black/60 border border-purple-400/40 text-purple-300 text-sm sm:text-base shadow-sm">
            3 DIRECT ACTIVATIONS
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-500 hidden sm:block" />
          <div className="w-5 h-5 text-zinc-500 sm:hidden">↓</div>
          <div className="px-4 py-2.5 rounded-xl bg-black/60 border border-cyan-400/40 text-cyan-300 text-sm sm:text-base shadow-sm">
            3 SHARES
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-500 hidden sm:block" />
          <div className="w-5 h-5 text-zinc-500 sm:hidden">↓</div>
          <div className="px-4 py-2.5 rounded-xl bg-purple-950 border border-purple-400/60 text-purple-200 text-sm sm:text-base shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-300" />
            <span>QUALIFIED</span>
          </div>
        </div>
      </div>

      {/* Rule Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
          <span className="text-purple-400 font-mono font-bold text-xs block">
            The 3-Direct Quantum Benchmark
          </span>
          <p>
            To qualify for Weekly Reward Premium shares, the user must generate at least 3 new eligible direct Quantum Package activations during the current 7-day cycle.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
          <span className="text-cyan-400 font-mono font-bold text-xs block">
            Dynamic Scaling Beyond Minimum
          </span>
          <p>
            Every additional eligible direct activation after the first 3 adds one additional share, continuously compounding your proportional pool weight.
          </p>
        </div>
      </div>

      {/* Interactive Schedule Cards */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
          Quantum Direct-to-Share Progression
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tiers.map((t) => {
            const isSelected = activeTier === t.directs;
            return (
              <div
                key={t.directs}
                onClick={() => setActiveTier(t.directs)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-950/70 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/40'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-zinc-400">
                    {t.status}
                  </span>
                  <Diamond className="w-3.5 h-3.5 text-purple-400" />
                </div>

                <h4 className="text-sm font-mono font-bold text-white">
                  {t.directs} Directs
                </h4>
                <div className="text-xs font-mono font-black text-cyan-300 mt-0.5">
                  → {t.shares} Shares
                </div>

                <div className="mt-2 pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-400">
                  {t.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
