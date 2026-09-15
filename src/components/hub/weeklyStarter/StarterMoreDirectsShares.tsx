import React from 'react';
import { TrendingUp, Users, Share2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const StarterMoreDirectsShares: React.FC = () => {
  const comparisons = [
    { directs: 2, shares: 2, weight: 'Base Qualification (2 shares)', badge: 'Qualified', color: 'border-amber-500/40 text-amber-300' },
    { directs: 3, shares: 3, weight: '1.5× Base Weight (3 shares)', badge: 'Tier Up', color: 'border-cyan-500/40 text-cyan-300' },
    { directs: 5, shares: 5, weight: '2.5× Base Weight (5 shares)', badge: 'High Activity', color: 'border-emerald-500/40 text-emerald-300' },
    { directs: 10, shares: 10, weight: '5.0× Base Weight (10 shares)', badge: 'Top Performer', color: 'border-purple-500/40 text-purple-300' },
  ];

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="share" theme="amber" size="md" />
        <div>
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
            Section 03 • Share Scaling
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            MORE DIRECTS = MORE SHARES
          </h2>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
          The greater your number of eligible direct activations during the weekly cycle, the greater your share count within the distribution pool.
        </p>
      </div>

      {/* Premium Comparison Panel */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
          Your Weekly Direct Activations vs Pool Share Allocation
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {comparisons.map((c) => (
            <div
              key={c.directs}
              className={`p-5 rounded-2xl bg-[#090d0b] border ${c.color} shadow-lg space-y-3 relative overflow-hidden group hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-black/60 border border-white/10 text-zinc-400">
                  {c.badge}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-zinc-600 group-hover:text-amber-400 transition-colors" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-mono font-bold text-white">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>{c.directs} Directs</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <ArrowRight className="w-3 h-3 text-zinc-500" />
                  <span className="font-mono font-bold text-cyan-300">{c.shares} Shares</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400">
                {c.weight}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Guarantee Protocol Note */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          Share allocation determines proportional distribution rights only. Distribution amounts fluctuate with pool volume and total active network shares.
        </span>
      </div>
    </div>
  );
};
