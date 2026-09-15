import React from 'react';
import { RotateCcw, ChevronRight, ArrowDown, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const PremiumWeeklyContinuation: React.FC = () => {
  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="calendar" theme="purple" size="md" />
        <div>
          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
            Section 06 • Cycle Continuity
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            A NEW WEEK. A NEW QUALIFICATION CYCLE.
          </h2>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
          After each weekly cycle closes, the system moves into the next weekly cycle. Eligible leaders can participate again by meeting the qualification requirements for the new cycle.
        </p>
      </div>

      {/* Visual Pipeline: WEEK 01 ↓ CLOSE ↓ DISTRIBUTION ↓ WEEK 02 ↓ NEW QUALIFICATION ↓ NEW SHARES */}
      <div className="p-6 rounded-2xl bg-[#080410] border border-purple-500/30 space-y-4">
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold text-center sm:text-left">
          Epoch Renewal Flow
        </span>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-purple-500/30 text-center w-full lg:w-auto">
            <span className="text-[10px] text-purple-400 font-bold block uppercase">Cycle N</span>
            <span className="text-sm font-black text-white mt-0.5 block">WEEK 01</span>
          </div>

          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 hidden lg:block" />
          <ArrowDown className="w-4 h-4 text-purple-400 shrink-0 lg:hidden" />

          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-700 text-center w-full lg:w-auto">
            <span className="text-[10px] text-zinc-400 font-bold block uppercase">Checkpoint</span>
            <span className="text-sm font-black text-white mt-0.5 block">CLOSE</span>
          </div>

          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 hidden lg:block" />
          <ArrowDown className="w-4 h-4 text-purple-400 shrink-0 lg:hidden" />

          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-emerald-500/40 text-center w-full lg:w-auto">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase">Settlement</span>
            <span className="text-sm font-black text-emerald-300 mt-0.5 block">DISTRIBUTION</span>
          </div>

          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 hidden lg:block" />
          <ArrowDown className="w-4 h-4 text-purple-400 shrink-0 lg:hidden" />

          <div className="p-3.5 rounded-xl bg-purple-950/70 border border-purple-400/50 text-center w-full lg:w-auto">
            <span className="text-[10px] text-purple-300 font-bold block uppercase">Cycle N+1</span>
            <span className="text-sm font-black text-white mt-0.5 block">WEEK 02</span>
          </div>

          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 hidden lg:block" />
          <ArrowDown className="w-4 h-4 text-purple-400 shrink-0 lg:hidden" />

          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-cyan-500/40 text-center w-full lg:w-auto">
            <span className="text-[10px] text-cyan-400 font-bold block uppercase">Requirement</span>
            <span className="text-sm font-black text-white mt-0.5 block">NEW QUALIFICATION</span>
          </div>

          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 hidden lg:block" />
          <ArrowDown className="w-4 h-4 text-purple-400 shrink-0 lg:hidden" />

          <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950 to-cyan-950 border border-cyan-400/60 text-center w-full lg:w-auto shadow-md">
            <span className="text-[10px] text-cyan-300 font-bold block uppercase">Allocation</span>
            <span className="text-sm font-black text-cyan-200 mt-0.5 block">NEW SHARES</span>
          </div>
        </div>
      </div>
    </div>
  );
};
