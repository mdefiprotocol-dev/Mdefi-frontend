import React from 'react';
import { 
  RotateCcw, 
  ArrowDown, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Search, 
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';

export const CycleRecycleSection: React.FC = () => {
  const cycleFlow = [
    { step: '01', title: 'MATRIX OPEN', desc: 'Root node registered, initial matrix ID initialized', color: 'border-zinc-700 bg-zinc-900/90 text-zinc-300' },
    { step: '02', title: 'LEVEL 1 (2 POS)', desc: 'Inner ring slots #1 & #2 populated via placement logic', color: 'border-indigo-500/40 bg-indigo-950/80 text-indigo-300' },
    { step: '03', title: 'LEVEL 2 (4 POS)', desc: 'Ring 2 slots #3 to #6 filled (20% matrix value distributed)', color: 'border-indigo-500/40 bg-indigo-950/80 text-indigo-300' },
    { step: '04', title: 'LEVEL 3 (8 POS)', desc: 'Ring 3 slots #7 to #14 filled (30% matrix value distributed)', color: 'border-cyan-500/40 bg-cyan-950/80 text-cyan-300' },
    { step: '05', title: 'LEVEL 4 (16 POS)', desc: 'Outer ring slots #15 to #30 filled (50% matrix value distributed)', color: 'border-emerald-500/40 bg-emerald-950/80 text-emerald-300' },
    { step: '06', title: 'MATRIX COMPLETE', desc: 'All 30 radial slots verified filled on-chain', color: 'border-amber-500/40 bg-amber-950/80 text-amber-300 font-bold' },
    { step: '07', title: 'RECYCLE / RE-ENTRY', desc: 'Contract automatically executes reinvestment mechanism', color: 'border-rose-500/40 bg-rose-950/80 text-rose-300 font-bold' },
    { step: '08', title: 'FREE REFERRER', desc: 'On-chain search identifies available free matrix parent', color: 'border-purple-500/40 bg-purple-950/80 text-purple-300' },
    { step: '09', title: 'NEW PLACEMENT', desc: 'New slot assigned under active sponsor or upline parent', color: 'border-teal-500/40 bg-teal-950/80 text-teal-300' },
    { step: '10', title: 'NEW MATRIX CYCLE', desc: 'Subsequent cycle starts with fresh 30-slot availability', color: 'border-indigo-500/40 bg-indigo-950/80 text-indigo-300 font-bold' },
  ];

  return (
    <div className="space-y-8">
      {/* SECTION 10: MATRIX CYCLE COMPLETION */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold block">
              Contract Lifecycle Engine
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-indigo-400" />
              <span>MATRIX CYCLE COMPLETION PIPELINE</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
            Auto Reinvestment at Slot #30
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          When the fourth-level matrix reaches its completion condition (all 30 positions filled), the smart contract triggers the existing reinvestment/re-entry mechanism. The protocol automatically recycles the node without requiring additional manual gas authorization.
        </p>

        {/* Visual Step-by-Step Flow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {cycleFlow.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${item.color} space-y-2 flex flex-col justify-between`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                  STAGE {item.step}
                </span>
                <span className="text-xs font-mono font-black text-white block">
                  {item.title}
                </span>
              </div>
              <p className="text-[10px] text-zinc-300 leading-snug">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Technical Contract Terminology Breakdown */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
            Contract Execution Sequence &amp; State Mutation:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-zinc-300">
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">increments reinvestCount</strong>
                <p className="text-[11px] text-zinc-400 mt-0.5">Tracks total completed matrix turnovers for the user account.</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">increments packageRecycleCount</strong>
                <p className="text-[11px] text-zinc-400 mt-0.5">Updates package-level cycle count counter on-chain.</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">clears completed matrix arrays</strong>
                <p className="text-[11px] text-zinc-400 mt-0.5">Resets the active 30-slot referral array for the fresh cycle.</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">searches for free referrer</strong>
                <p className="text-[11px] text-zinc-400 mt-0.5">Runs on-chain algorithm to place the re-entry in the closest open slot.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 11: UNLIMITED / RECURRING CYCLE EXPLANATION */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold block">
              Continuous Matrix Mechanics
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              HOW RECURRING MATRIX CYCLES WORK
            </h2>
          </div>
          <span className="text-xs font-mono text-purple-400 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-500/30">
            Multi-Cycle Architecture
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          The completed matrix is not treated as the permanent end of the user's matrix record. After completion, the existing contract clears the completed matrix structure and performs re-entry/reinvestment through the available free-referrer logic. This creates a <strong className="text-white">recurring matrix cycle mechanism</strong>.
        </p>

        {/* Visual Cycle Progression */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
            {/* Cycle 01 */}
            <div className="w-full md:w-auto p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">Initial Round</span>
              <span className="text-sm font-bold text-white block">CYCLE 01</span>
              <span className="text-[11px] text-emerald-400 block font-semibold">30 Slots Fill</span>
            </div>

            <ArrowRight className="w-5 h-5 text-zinc-500 hidden md:block" />
            <ArrowDown className="w-5 h-5 text-zinc-500 md:hidden" />

            {/* Recycle 01 */}
            <div className="w-full md:w-auto p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-center space-y-1">
              <span className="text-[10px] text-rose-300 uppercase">Contract Trigger</span>
              <span className="text-sm font-bold text-rose-300 block">AUTO-RECYCLE</span>
              <span className="text-[11px] text-zinc-400 block">reinvestCount +1</span>
            </div>

            <ArrowRight className="w-5 h-5 text-zinc-500 hidden md:block" />
            <ArrowDown className="w-5 h-5 text-zinc-500 md:hidden" />

            {/* Cycle 02 */}
            <div className="w-full md:w-auto p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">Next Round</span>
              <span className="text-sm font-bold text-white block">CYCLE 02</span>
              <span className="text-[11px] text-cyan-400 block font-semibold">Fresh 30 Slots</span>
            </div>

            <ArrowRight className="w-5 h-5 text-zinc-500 hidden md:block" />
            <ArrowDown className="w-5 h-5 text-zinc-500 md:hidden" />

            {/* Recycle 02 */}
            <div className="w-full md:w-auto p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-center space-y-1">
              <span className="text-[10px] text-rose-300 uppercase">Contract Trigger</span>
              <span className="text-sm font-bold text-rose-300 block">AUTO-RECYCLE</span>
              <span className="text-[11px] text-zinc-400 block">reinvestCount +2</span>
            </div>

            <ArrowRight className="w-5 h-5 text-zinc-500 hidden md:block" />
            <ArrowDown className="w-5 h-5 text-zinc-500 md:hidden" />

            {/* Cycle 03+ */}
            <div className="w-full md:w-auto p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/50 text-center space-y-1">
              <span className="text-[10px] text-indigo-300 uppercase">Ongoing</span>
              <span className="text-sm font-bold text-indigo-300 block">CYCLE 03...</span>
              <span className="text-[11px] text-zinc-400 block">Recurring Engine</span>
            </div>
          </div>
        </div>

        {/* Compliance Note */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2.5">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            Compliance Directive: Characterized strictly as a <strong className="text-zinc-200">"Recurring matrix cycle mechanism"</strong>. Never described as unlimited guaranteed income. Turnovers require real participant placement activity.
          </span>
        </div>
      </div>
    </div>
  );
};
