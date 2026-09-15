import React from 'react';
import { 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp,
  Award,
  Layers,
  Repeat
} from 'lucide-react';
import { WEEKLY_SALARY_RANKS } from '../../../data/weeklySalaryData';

export const DirectTeamProgress: React.FC = () => {
  const steps = [
    { count: 10, rank: 'Bronze', reward: '$15/wk', weeks: '10 Wks' },
    { count: 25, rank: 'Silver', reward: '$30/wk', weeks: '11 Wks' },
    { count: 50, rank: 'Gold', reward: '$50/wk', weeks: '12 Wks' },
    { count: 100, rank: 'Platinum', reward: '$100/wk', weeks: '12 Wks' },
    { count: 250, rank: 'Diamond', reward: '$250/wk', weeks: '13 Wks' },
    { count: 500, rank: 'Blue Diamond', reward: '$500/wk', weeks: '12 Wks' },
    { count: 1000, rank: 'Crown Diamond', reward: '$1,000/wk', weeks: '12 Wks' },
  ];

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
            Direct Referral Metric
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>BUILD YOUR DIRECT TEAM</span>
          </h2>
        </div>
        <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
          Non-Resetting Cumulative Count
        </span>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
        When a qualifying participant activates the <strong className="text-white">$120 Nexus Prime</strong> package through your personal referral link, your qualifying direct count increases by one. Previous qualifying directs permanently remain counted toward future ranks—<strong className="text-emerald-400">you never need to rebuild your previous rank team</strong>.
      </p>

      {/* 1 Direct = 1 Count Highlight Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-zinc-950 to-zinc-950 border border-emerald-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Conversion Rule</span>
            <div className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
              <span className="text-emerald-400">1 Qualifying Direct</span>
              <span className="text-zinc-500">=</span>
              <span className="text-white">1 Direct Count</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Verified Nexus Prime activation ($120 USDT)
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/50 via-zinc-950 to-zinc-950 border border-teal-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Team Retention Invariant</span>
            <div className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
              <span className="text-teal-300">Permanent</span>
              <span className="text-zinc-500">•</span>
              <span className="text-white">No Team Resets</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Direct partners aggregate continuously toward all 7 ranks
            </p>
          </div>
          <div className="p-3 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-300">
            <Repeat className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Animated Direct Progression Path */}
      <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider font-bold">
            Cumulative Direct Progression Path (10 → 1,000)
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            7 Sequential Milestones
          </span>
        </div>

        {/* Step Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 font-mono text-xs">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="relative p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/40 transition-all text-center space-y-1.5 group"
            >
              <div className="flex items-center justify-center">
                <span className="text-[10px] text-zinc-500 uppercase">Rank {idx + 1}</span>
              </div>
              <div className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
                {s.count}
              </div>
              <div className="text-[11px] font-semibold text-emerald-400">
                {s.rank}
              </div>
              <div className="text-[10px] text-zinc-400 border-t border-zinc-800 pt-1">
                {s.reward}
              </div>
            </div>
          ))}
        </div>

        {/* Connecting visual ribbon */}
        <div className="relative h-2 rounded-full bg-zinc-900 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 opacity-70" />
        </div>
      </div>
    </div>
  );
};
