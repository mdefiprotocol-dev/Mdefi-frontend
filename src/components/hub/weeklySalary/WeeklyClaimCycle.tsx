import React from 'react';
import { 
  Clock, 
  ArrowRight, 
  ArrowDown, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Calendar, 
  Wallet,
  Coins
} from 'lucide-react';

interface WeeklyClaimCycleProps {
  liveClaimableUsdt?: number;
  livePendingWeeks?: number;
  isEligibleToClaim?: boolean;
}

export const WeeklyClaimCycle: React.FC<WeeklyClaimCycleProps> = ({
  liveClaimableUsdt,
  livePendingWeeks,
  isEligibleToClaim = false,
}) => {
  return (
    <div className="space-y-8">
      {/* ── SECTION 8: 7-DAY WEEKLY CLAIM CYCLE ── */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-cyan-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
              Epoch Cadence
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>7-DAY WEEKLY CLAIM CYCLE</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30 font-bold">
            168-Hour Epoch
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          Once the applicable rank becomes eligible, the weekly reward follows the configured 7-day cycle. Rewards mature at the completion of each 168-hour epoch, unlocking claim transactions for verified eligible accounts.
        </p>

        {/* Circular Progress & Stage Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Circular Visual Indicator */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3 text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* SVG Ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-zinc-800/80"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-cyan-400 transition-all duration-1000 motion-reduce:transition-none"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset="66"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              {/* Inner Stats */}
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-2xl font-black text-white">168h</span>
                <span className="text-[10px] text-cyan-400 font-semibold">FULL CYCLE</span>
              </div>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              7 Days = 168 Hours (604,800 Seconds)
            </span>
          </div>

          {/* Day 0 → Day 1-6 → Day 7 Flow */}
          <div className="lg:col-span-2 space-y-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 font-bold border border-zinc-700">
                  DAY 0
                </span>
                <div>
                  <h4 className="text-white font-bold">RANK QUALIFIED</h4>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Threshold met and validated on-chain
                  </p>
                </div>
              </div>
              <span className="text-emerald-400 text-[11px] font-semibold">Triggered</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/80 border border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40">
                  DAY 1–6
                </span>
                <div>
                  <h4 className="text-cyan-300 font-bold">CYCLE IN PROGRESS</h4>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Weekly epoch actively counting down
                  </p>
                </div>
              </div>
              <span className="text-cyan-400 text-[11px] font-semibold">Active Epoch</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/80 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40">
                  DAY 7
                </span>
                <div>
                  <h4 className="text-emerald-300 font-bold">CLAIM ELIGIBLE</h4>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Smart-contract verifies status and releases reward
                  </p>
                </div>
              </div>
              <span className="text-emerald-400 text-[11px] font-semibold">Unlocked</span>
            </div>
          </div>
        </div>

        {/* Claim Notice: No fake claim button */}
        <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5 text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Claim actions execute strictly through the live contract interface.
            </span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 text-[11px]">
            {isEligibleToClaim ? 'Verified Eligible to Claim' : 'Follow Contract Epoch State'}
          </div>
        </div>
      </div>

      {/* ── SECTION 9: SALARY ACCUMULATION (ILLUSTRATIVE EXAMPLE) ── */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold block">
              Pending Rollover Framework
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Coins className="w-5 h-5 text-indigo-400" />
              <span>SALARY ACCUMULATION</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
            Illustrative Accumulation Model
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          If an eligible weekly reward is not claimed immediately upon epoch maturity, the eligible amount can remain pending according to the implemented contract rules.
        </p>

        {/* Illustrative Pending Visual */}
        <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-4">
          <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider font-bold block">
            Illustrative Multi-Week Accumulation (e.g. Bronze Rank @ $15/wk)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 block uppercase">Cycle 1</span>
              <span className="text-white font-bold block">WEEK 1</span>
              <span className="text-indigo-400 font-bold text-sm block">$15.00 USDT</span>
              <span className="text-[10px] text-amber-400 block">Pending</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 block uppercase">Cycle 2</span>
              <span className="text-white font-bold block">WEEK 2</span>
              <span className="text-indigo-400 font-bold text-sm block">$15.00 USDT</span>
              <span className="text-[10px] text-amber-400 block">Pending</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 block uppercase">Cycle 3</span>
              <span className="text-white font-bold block">WEEK 3</span>
              <span className="text-indigo-400 font-bold text-sm block">$15.00 USDT</span>
              <span className="text-[10px] text-amber-400 block">Pending</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 gap-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-white font-semibold">Cumulative Eligible Pending:</span>
            </div>
            <span className="text-base font-bold text-emerald-400">
              $45.00 USDT (3 Unclaimed Weeks)
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-amber-500/20 text-xs text-zinc-400 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-amber-300">Disclaimer:</strong> The above multi-week example is provided for instructional purposes. Unclaimed balances are maintained under smart-contract logic and subject to available pool liquidity and rank term limits.
          </p>
        </div>
      </div>
    </div>
  );
};
