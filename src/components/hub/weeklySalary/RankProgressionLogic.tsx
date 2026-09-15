import React from 'react';
import { 
  TrendingUp, 
  ArrowDown, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { WEEKLY_SALARY_RANKS } from '../../../data/weeklySalaryData';

export const RankProgressionLogic: React.FC = () => {
  const progressionSteps = [
    {
      rank: 'BRONZE',
      totalDirects: 10,
      additionalDirects: 10,
      note: 'Initial qualification milestone',
      color: 'text-amber-400',
      badge: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
    },
    {
      rank: 'SILVER',
      totalDirects: 25,
      additionalDirects: 15,
      note: '+15 Additional Directs beyond Bronze',
      color: 'text-slate-300',
      badge: 'bg-slate-800 border-slate-500/40 text-slate-200',
    },
    {
      rank: 'GOLD',
      totalDirects: 50,
      additionalDirects: 25,
      note: '+25 Additional Directs beyond Silver',
      color: 'text-yellow-400',
      badge: 'bg-yellow-950/60 border-yellow-500/40 text-yellow-300',
    },
    {
      rank: 'PLATINUM',
      totalDirects: 100,
      additionalDirects: 50,
      note: '+50 Additional Directs beyond Gold',
      color: 'text-cyan-400',
      badge: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300',
    },
    {
      rank: 'DIAMOND',
      totalDirects: 250,
      additionalDirects: 150,
      note: '+150 Additional Directs beyond Platinum',
      color: 'text-blue-400',
      badge: 'bg-blue-950/60 border-blue-500/40 text-blue-300',
    },
    {
      rank: 'BLUE DIAMOND',
      totalDirects: 500,
      additionalDirects: 250,
      note: '+250 Additional Directs beyond Diamond',
      color: 'text-indigo-400',
      badge: 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300',
    },
    {
      rank: 'CROWN DIAMOND',
      totalDirects: 1000,
      additionalDirects: 500,
      note: '+500 Additional Directs beyond Blue Diamond',
      color: 'text-emerald-400',
      badge: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── SECTION 7: YOUR TEAM KEEPS GROWING ── */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
              Cumulative Growth Mechanics
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>YOUR TEAM KEEPS GROWING</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
            Zero Direct-Counter Resets
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          Your qualifying direct partners continue to count as your direct team. <strong className="text-white">You do not start over when moving to the next rank</strong>. Each new rank only requires the differential gap of additional qualifying directs.
        </p>

        {/* Step-by-Step Additional Directs Visualization */}
        <div className="space-y-3">
          {progressionSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${step.badge}`}>
                  0{idx + 1}
                </div>
                <div>
                  <h4 className={`text-sm font-bold font-mono ${step.color}`}>
                    {step.rank}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    {step.note}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs">
                {idx > 0 && (
                  <div className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1.5">
                    <Plus className="w-3 h-3 text-emerald-400" />
                    <span>{step.additionalDirects} Additional</span>
                  </div>
                )}
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold">
                  {step.totalDirects} Total Directs
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 10: KEEP YOUR PROGRESS (RANK UPGRADE EXAMPLE) ── */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-teal-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-semibold block">
              Permanent Elevation
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span>KEEP YOUR PROGRESS</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-teal-300 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30 font-bold">
            Continuous Upgrades
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          When your direct team reaches the next rank threshold, your rank progresses without rebuilding the previous team. The previous qualifying directs remain part of the cumulative direct count.
        </p>

        {/* Upgrade Chain Visual */}
        <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-center text-xs">
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-amber-500/30 space-y-1">
              <span className="text-[10px] text-zinc-400 block uppercase">Level 1</span>
              <span className="text-base font-black text-amber-400 block">10 DIRECTS</span>
              <span className="text-xs text-zinc-300 font-semibold block">BRONZE</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-slate-500/30 space-y-1">
              <span className="text-[10px] text-zinc-400 block uppercase">Level 2</span>
              <span className="text-base font-black text-slate-300 block">25 DIRECTS</span>
              <span className="text-xs text-zinc-300 font-semibold block">SILVER</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-yellow-500/30 space-y-1">
              <span className="text-[10px] text-zinc-400 block uppercase">Level 3</span>
              <span className="text-base font-black text-yellow-400 block">50 DIRECTS</span>
              <span className="text-xs text-zinc-300 font-semibold block">GOLD</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-cyan-500/30 space-y-1">
              <span className="text-[10px] text-zinc-400 block uppercase">Level 4</span>
              <span className="text-base font-black text-cyan-400 block">100 DIRECTS</span>
              <span className="text-xs text-zinc-300 font-semibold block">PLATINUM</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            <strong className="text-zinc-200">Protocol Guarantee:</strong> The smart-contract counter strictly tracks monotonic cumulative directs. Your score will never be reset or decremented.
          </span>
        </div>
      </div>
    </div>
  );
};
