import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, CheckCircle2, Diamond, RefreshCw } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const PremiumCycleTimeline: React.FC = () => {
  const [activeDay, setActiveDay] = useState(4);

  const days = [
    { day: 1, label: 'Cycle Opens', desc: 'New epoch begins; $8 USDT contributions route to pool.' },
    { day: 2, label: 'Direct Activity', desc: 'Quantum Package activations register on-chain.' },
    { day: '3-5', label: 'Share Growth', desc: 'Accelerated direct referrals build leadership shares.' },
    { day: 6, label: 'Final Qualification', desc: 'Final hours to meet the 3-direct qualification threshold.' },
    { day: 7, label: 'Cycle Closing', desc: 'Snapshot recorded; pool finalized and prepared for distribution.' },
  ];

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="calendar" theme="purple" size="md" />
        <div>
          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
            Section 04 • Epoch Sequence
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            THE 7-DAY PREMIUM CYCLE
          </h2>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
        The Premium pool runs on an automated 7-day cyclical epoch. Every Sunday at 23:59 UTC, the cycle snapshots and prepares the distribution.
      </p>

      {/* Cycle Epoch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {days.map((d, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-zinc-900/50 border border-purple-500/30 flex flex-col justify-between space-y-2 hover:border-purple-400/60 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                DAY {d.day}
              </span>
              <Diamond className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-white">
                {d.label}
              </h4>
              <p className="text-[10px] text-zinc-400 font-sans mt-0.5 leading-relaxed">
                {d.desc}
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 text-[9px] font-mono text-zinc-500">
              Automated smart contract checkpoint
            </div>
          </div>
        ))}
      </div>

      {/* Cycle Settlement Pipeline: POOL FINALIZED ↓ SHARES CALCULATED ↓ QUALIFIED LEADERS ↓ DISTRIBUTION */}
      <div className="p-5 rounded-2xl bg-[#090510] border border-purple-500/30 space-y-3">
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold text-center sm:text-left">
          Settlement Sequence
        </span>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left font-mono text-xs">
          <div className="p-3 rounded-xl bg-black/60 border border-zinc-700 w-full sm:w-auto text-zinc-300 font-bold">
            POOL FINALIZED
          </div>

          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 hidden sm:block" />
          <div className="w-4 h-4 text-purple-400 sm:hidden">↓</div>

          <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/40 w-full sm:w-auto text-cyan-300 font-bold">
            SHARES CALCULATED
          </div>

          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 hidden sm:block" />
          <div className="w-4 h-4 text-purple-400 sm:hidden">↓</div>

          <div className="p-3 rounded-xl bg-black/60 border border-purple-500/40 w-full sm:w-auto text-purple-300 font-bold">
            QUALIFIED LEADERS
          </div>

          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 hidden sm:block" />
          <div className="w-4 h-4 text-purple-400 sm:hidden">↓</div>

          <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-400/60 w-full sm:w-auto text-purple-200 font-black shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            DISTRIBUTION
          </div>
        </div>
      </div>
    </div>
  );
};
