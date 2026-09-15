import React from 'react';
import { Share2, Users, ArrowRight, Sparkles, Diamond, ShieldCheck } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const PremiumShareComparison: React.FC = () => {
  const comparisons = [
    { directs: 3, shares: 3, weight: '1.0× Baseline Weight', badge: 'Base Leader', desc: 'Standard qualification tier' },
    { directs: 4, shares: 4, weight: '1.33× Baseline Weight', badge: 'Tier Up', desc: '+1 Share expanded distribution' },
    { directs: 5, shares: 5, weight: '1.67× Baseline Weight', badge: 'Leadership Acceleration', desc: '+2 Shares accelerated weight' },
    { directs: 10, shares: 10, weight: '3.33× Baseline Weight', badge: 'Top Tier Leader', desc: 'Highest impact distribution weight' },
  ];

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="share" theme="purple" size="md" />
        <div>
          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
            Section 03 • Proportional Weighting
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            MORE SHARES, LARGER POOL ALLOCATION
          </h2>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
          In a share-based pool, your reward is not fixed. As your direct team activates more Quantum packages, your share count increases relative to the entire qualified participant base.
        </p>
      </div>

      {/* Visual Token Inflow Graphic */}
      <div className="p-5 rounded-2xl bg-[#090612] border border-purple-500/30 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-purple-300 font-bold">Glowing Digital Share Tokens Entering The Common Vault</span>
          <span className="text-[10px] text-zinc-500">Smart Contract Vault</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 py-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-400/60 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-pulse motion-reduce:animate-none"
            >
              <Diamond className="w-5 h-5" />
            </div>
          ))}
          <ArrowRight className="w-5 h-5 text-purple-400 mx-2" />
          <div className="px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-950 to-cyan-950 border border-cyan-400/50 text-cyan-300 font-mono font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            COMMON PREMIUM POOL
          </div>
        </div>
      </div>

      {/* Comparison Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {comparisons.map((c) => (
          <div
            key={c.directs}
            className="p-5 rounded-2xl bg-[#08050e] border border-purple-500/30 shadow-lg space-y-3 relative overflow-hidden group hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-black/60 border border-white/10 text-zinc-400">
                {c.badge}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-zinc-600 group-hover:text-purple-400 transition-colors" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-mono font-bold text-white">
                <Users className="w-4 h-4 text-purple-400" />
                <span>{c.directs} Directs</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <ArrowRight className="w-3 h-3 text-zinc-500" />
                <span className="font-mono font-bold text-cyan-300">{c.shares} Shares</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-purple-300/90">
              {c.weight}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
