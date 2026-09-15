import React from 'react';
import { 
  Calculator, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Coins, 
  Calendar, 
  TrendingUp, 
  ShieldCheck,
  Award,
  ArrowRight
} from 'lucide-react';
import { WEEKLY_SALARY_RANKS } from '../../../data/weeklySalaryData';

export const HowTotalRewardCalculated: React.FC = () => {
  const totalCumulativePotential = WEEKLY_SALARY_RANKS.reduce(
    (acc, r) => acc + r.totalPotentialUsdt, 
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
            Mathematical Compensation Model
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <span>HOW TOTAL REWARD IS CALCULATED</span>
          </h2>
        </div>
        <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Formula: Salary × Max Weeks</span>
        </span>
      </div>

      {/* Core Formula Display Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0b1410] via-[#0d1813] to-[#070e0a] border border-emerald-500/35 shadow-[0_0_40px_rgba(16,185,129,0.12)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Transparent On-Chain Logic
              </span>
              <h3 className="text-xl font-black text-white tracking-tight mt-1">
                The Exact Calculation Formula
              </h3>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-zinc-950/80 border border-emerald-500/30 font-mono text-xs text-zinc-300">
              Ecosystem Cumulative Ceiling: <strong className="text-emerald-400">${totalCumulativePotential.toLocaleString()} USDT</strong>
            </div>
          </div>

          {/* Mathematical Formula Callout */}
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/90 border border-emerald-500/30 shadow-inner">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-3 sm:gap-4 font-mono text-center">
              <div className="p-3 sm:p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 min-w-[200px] w-full lg:w-auto">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">VARIABLE A</span>
                <span className="text-base sm:text-lg font-black text-emerald-300 block">Weekly Salary</span>
                <span className="text-[11px] text-zinc-400">Fixed rate in USDT</span>
              </div>

              <div className="text-2xl font-black text-emerald-400">×</div>

              <div className="p-3 sm:p-4 rounded-xl bg-teal-950/40 border border-teal-500/30 min-w-[200px] w-full lg:w-auto">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">VARIABLE B</span>
                <span className="text-base sm:text-lg font-black text-teal-300 block">Maximum Weeks</span>
                <span className="text-[11px] text-zinc-400">10 to 13 claim cycles</span>
              </div>

              <div className="text-2xl font-black text-emerald-400">=</div>

              <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-400/50 min-w-[240px] w-full lg:w-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold block">OUTPUT RESULT</span>
                <span className="text-base sm:text-lg font-black text-white block">Total Potential Earnings</span>
                <span className="text-[11px] text-emerald-400 font-semibold">Guaranteed Max per Rank</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
            Unlike speculative yield structures, each rank carries a strictly defined weekly disbursement multiplied by an epoch duration cap. Once you unlock a rank, you are eligible to claim its weekly salary for each active weekly cycle up to the maximum weeks allotted.
          </p>
        </div>
      </div>

      {/* Rank by Rank Calculation Ledger (7 Ranks) */}
      <div className="rounded-3xl p-6 bg-zinc-900/40 border border-zinc-800 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              7-Rank Mathematical Breakdown
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Bronze through Crown Diamond
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[11px]">
                <th className="pb-3 font-semibold">RANK TIER</th>
                <th className="pb-3 font-semibold">DIRECTS REQ.</th>
                <th className="pb-3 font-semibold text-emerald-400">WEEKLY SALARY</th>
                <th className="pb-3 font-semibold text-teal-400">MAX WEEKS</th>
                <th className="pb-3 font-semibold text-right text-white">TOTAL POTENTIAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {WEEKLY_SALARY_RANKS.map((rank) => (
                <tr key={rank.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[10px] text-emerald-400">
                      0{rank.level}
                    </span>
                    <span>{rank.name}</span>
                  </td>
                  <td className="py-3 text-zinc-400">
                    <strong className="text-white">{rank.requiredDirects}</strong> directs
                    <span className="text-[10px] text-zinc-500 block">
                      {rank.level === 1 ? 'Initial milestone' : `+${rank.additionalDirects} additional`}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-emerald-400">
                    ${rank.weeklyRewardUsdt} USDT / wk
                  </td>
                  <td className="py-3 font-semibold text-teal-300">
                    {rank.maxWeeks} Weeks
                  </td>
                  <td className="py-3 text-right">
                    <div className="inline-flex flex-col items-end">
                      <span className="font-black text-sm text-white">
                        ${rank.totalPotentialUsdt.toLocaleString()} USDT
                      </span>
                      <span className="text-[10px] text-zinc-500 font-normal">
                        (${rank.weeklyRewardUsdt} × {rank.maxWeeks} wks)
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-emerald-500/40 bg-emerald-950/20 font-bold text-sm">
                <td colSpan={4} className="py-4 text-emerald-300 font-mono pl-3">
                  TOTAL POTENTIAL ACROSS ALL 7 RANKS (CUMULATIVE CEILING):
                </td>
                <td className="py-4 text-right pr-3 font-black text-emerald-400 text-base font-mono">
                  ${totalCumulativePotential.toLocaleString()} USDT
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3 Core Rules Callout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>7-Day Settlement</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Salary epochs conclude every Monday at 00:00 UTC. Payouts are credited directly to your pending contract vault.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Accumulation Vault</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              You do not lose rewards if you skip a week. Unclaimed weeks accumulate safely inside the contract with zero expiry penalty.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Permanent Progress</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Direct partners are cumulative. Moving to higher ranks only requires the differential partner gap and never resets your counter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
