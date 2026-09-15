import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const StarterCycleTimeline: React.FC = () => {
  const [activeDay, setActiveDay] = useState(4);

  const days = [
    { day: 1, label: 'Cycle Opens', desc: 'Epoch begins; weekly pool initialized.' },
    { day: 2, label: 'Direct Activity', desc: 'New S4 Senior Node activations register.' },
    { day: 3, label: 'Share Accumulation', desc: 'Directs convert into qualified shares.' },
    { day: 4, label: 'Share Accumulation', desc: 'Mid-week team expansion & liquidity inflow.' },
    { day: 5, label: 'Share Accumulation', desc: 'Dynamic pool funding updates on-chain.' },
    { day: 6, label: 'Final Activity', desc: 'Qualification deadline approaches.' },
    { day: 7, label: 'Cycle Closing', desc: 'Snapshot taken & 7-day cycle closes.' },
  ];

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="calendar" theme="amber" size="md" />
        <div>
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
            Section 04 • Epoch Schedule
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            THE 7-DAY REWARD CYCLE
          </h2>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
        The Weekly Reward Starter plan operates on a recurring 7-day cyclical epoch. Qualifications and pool funding synchronize across a transparent weekly calendar.
      </p>

      {/* 7-Day Interactive Epoch Grid / Circular Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400 font-semibold uppercase tracking-wider">
            7-Day Cycle Timeline
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
            Recurring Weekly Cadence
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {days.map((d) => {
            const isSelected = activeDay === d.day;
            return (
              <div
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-950/70 to-zinc-950 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
                    DAY {d.day}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold text-white leading-tight">
                    {d.label}
                  </h4>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {d.desc}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5 text-[9px] font-mono text-zinc-500">
                  {d.day === 7 ? 'Snapshot Epoch' : 'Active Intake'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cycle Completion Pipeline: WEEK CLOSED ↓ TOTAL SHARES CALCULATED ↓ DISTRIBUTION PREPARED */}
      <div className="p-5 rounded-2xl bg-[#080d0a] border border-emerald-500/25 space-y-3">
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
          Cycle Close &amp; Execution Sequence
        </span>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left font-mono text-xs">
          <div className="p-3 rounded-xl bg-black/60 border border-zinc-700 w-full sm:w-auto text-zinc-300 font-bold">
            WEEK CLOSED
          </div>

          <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 hidden sm:block" />
          <div className="w-4 h-4 text-emerald-400 sm:hidden">↓</div>

          <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/40 w-full sm:w-auto text-cyan-300 font-bold">
            TOTAL SHARES CALCULATED
          </div>

          <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 hidden sm:block" />
          <div className="w-4 h-4 text-emerald-400 sm:hidden">↓</div>

          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-400/60 w-full sm:w-auto text-emerald-300 font-black shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            DISTRIBUTION PREPARED
          </div>
        </div>
      </div>
    </div>
  );
};
