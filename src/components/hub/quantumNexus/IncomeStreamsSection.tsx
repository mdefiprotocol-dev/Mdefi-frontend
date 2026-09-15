import React from 'react';
import { 
  Users, 
  Sparkles, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Gift, 
  Coins, 
  AlertCircle,
  Percent,
  Check,
  TrendingUp,
  Info
} from 'lucide-react';

export const IncomeStreamsSection: React.FC = () => {
  const nexusGenerations = [
    { level: 'L1', amount: '$10.00', pct: '8.33%', color: 'text-emerald-400 font-bold' },
    { level: 'L2', amount: '$6.00', pct: '5.00%', color: 'text-emerald-400' },
    { level: 'L3', amount: '$5.00', pct: '4.17%', color: 'text-teal-400' },
    { level: 'L4', amount: '$4.00', pct: '3.33%', color: 'text-teal-400' },
    { level: 'L5', amount: '$3.00', pct: '2.50%', color: 'text-cyan-400' },
    { level: 'L6', amount: '$3.00', pct: '2.50%', color: 'text-cyan-400' },
    { level: 'L7', amount: '$2.00', pct: '1.67%', color: 'text-indigo-400' },
    { level: 'L8', amount: '$2.00', pct: '1.67%', color: 'text-indigo-400' },
    { level: 'L9', amount: '$2.00', pct: '1.67%', color: 'text-indigo-400' },
    { level: 'L10', amount: '$1.50', pct: '1.25%', color: 'text-purple-400' },
    { level: 'L11', amount: '$1.50', pct: '1.25%', color: 'text-purple-400' },
  ];

  const magicLevels = Array.from({ length: 10 }, (_, i) => ({
    level: `Level ${i + 1}`,
    amount: '$1.50 USDT',
    calc: '10% of $15 Pool',
  }));

  return (
    <div className="space-y-8">
      {/* SECTION 12: DIRECT SPONSOR INCOME */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
              Immediate Commission Layer
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>DIRECT SPONSOR INCOME</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
            Per Eligible Node Activation
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          Direct sponsor income is credited instantly upon node purchase to the eligible inviter. Quantum credits <strong className="text-emerald-400">$12 USDT</strong> per activation, while Nexus Prime credits <strong className="text-cyan-400">$15 USDT</strong>.
        </p>

        {/* 2 Direct Cards & Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quantum Direct */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Quantum Node Direct</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                $12.00 USDT
              </span>
            </div>
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-2xl font-black text-white">$12.00</span>
              <span className="text-xs text-emerald-400 font-bold">17.14% of $70 Entry</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Paid to the sponsor on every direct Quantum referral, subject to verified active package status.
            </p>
          </div>

          {/* Nexus Direct */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Nexus Prime Direct</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                $15.00 USDT
              </span>
            </div>
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-2xl font-black text-white">$15.00</span>
              <span className="text-xs text-cyan-400 font-bold">12.50% of $120 Entry</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Paid to the sponsor on every direct Nexus referral, verifying active Nexus qualification before transfer.
            </p>
          </div>
        </div>

        {/* Visual Pipeline */}
        <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono text-center">
            <span className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-bold">
              SPONSOR
            </span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <span className="px-4 py-2 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold">
              ELIGIBLE ACTIVATION
            </span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <span className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
              DIRECT INCOME ($12 / $15)
            </span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <span className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-bold">
              SPONSOR WALLET
            </span>
          </div>
        </div>

        {/* Eligibility Rule Notice */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-amber-500/20 text-xs text-zinc-400 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-amber-300">Eligibility Rule:</strong> Direct income is strictly subject to the contract's active-status rules. If the direct sponsor is inactive for that specific tier, the contract invokes fallback routing according to on-chain receiver logic.
          </p>
        </div>
      </div>

      {/* SECTION 13 & 14: NEXUS 11-GENERATION INCOME */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-cyan-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
              Multi-Tier Upline Distribution
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>NEXUS 11-GENERATION INCOME ($40 POOL)</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30 font-bold">
            $40 / $120 = 33.33% of Entry
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          Every $120 Nexus Prime activation allocates exactly <strong className="text-cyan-400">$40.00 USDT (33.33%)</strong> into an 11-tier generation pool. Payouts travel upwards through the active sponsor lineage.
        </p>

        {/* Visual Generation Cascade Timeline */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-bold">
            11-Tier Generation Step Breakdown
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2 text-center font-mono">
            {nexusGenerations.map((gen, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1"
              >
                <span className="text-[10px] text-zinc-400 block">{gen.level}</span>
                <span className={`text-xs block ${gen.color}`}>{gen.amount}</span>
                <span className="text-[9px] text-zinc-400 block">{gen.pct}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono">
            <span className="text-zinc-300">Sum of 11 Levels:</span>
            <span className="text-cyan-300 font-bold">$10 + $6 + $5 + $4 + $3 + $3 + $2 + $2 + $2 + $1.50 + $1.50 = $40.00 USDT</span>
          </div>
        </div>

        {/* SECTION 14: Mobile Responsive Generation Percentage Table */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-3">Generation Tier</th>
                <th className="p-3">Distribution (USDT)</th>
                <th className="p-3">Percentage of $120</th>
                <th className="p-3 text-right">Contract Requirement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-950/50">
              {nexusGenerations.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/40">
                  <td className="p-2.5 text-white font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Generation {row.level}</span>
                  </td>
                  <td className={`p-2.5 ${row.color}`}>{row.amount} USDT</td>
                  <td className="p-2.5 text-zinc-400">{row.pct}</td>
                  <td className="p-2.5 text-right text-zinc-400 text-[11px]">
                    Active Nexus Node Check
                  </td>
                </tr>
              ))}
              <tr className="bg-cyan-950/50 font-bold border-t border-cyan-500/30">
                <td className="p-3 text-white">TOTAL GENERATION ALLOCATION</td>
                <td className="p-3 text-cyan-300">$40.00 USDT</td>
                <td className="p-3 text-cyan-300">33.33%</td>
                <td className="p-3 text-right text-emerald-400">11 Verified Levels</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] font-mono text-zinc-400">
          * <strong className="text-zinc-200">Active Status Check:</strong> The contract inspects active Nexus status for recipients. If an upline recipient is inactive, the payment redirects upward according to on-chain receiver logic or protocol fallback.
        </p>
      </div>

      {/* SECTION 15 & 16: MAGIC CASHBACK & MAGIC GENERATION */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-purple-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold block">
              Automated Cashback Algorithm
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-400" />
              <span>MAGIC CASHBACK &amp; 10-LEVEL MAGIC GENERATION</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-500/30 font-bold">
            Dual Condition Trigger
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          Magic Cashback is an algorithmic rebate and generation mechanism powered by the $15 Magic Pool portion of Quantum Node activations. It executes automatically once specific on-chain thresholds are reached.
        </p>

        {/* Dual Trigger Requirement Banner */}
        <div className="p-5 rounded-2xl bg-zinc-950/90 border border-purple-500/40 space-y-4">
          <span className="text-xs font-mono text-purple-300 uppercase tracking-wider font-bold block">
            Exact Contract Trigger Conditions:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-purple-500/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-300 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <span className="text-white font-bold block">2 DIRECT PARTNERS</span>
                <span className="text-zinc-400 text-[11px]">Personally sponsored registered accounts</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-purple-500/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-300 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <span className="text-white font-bold block">$30 MAGIC HOLD BALANCE</span>
                <span className="text-zinc-400 text-[11px]">Accumulated hold balance reached in wallet record</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-200">
            When both conditions are met, the contract triggers the Magic Distribution: the <strong className="text-white">$30 Magic Hold is consumed</strong> and immediately split into two $15 streams:
          </div>
        </div>

        {/* Magic Trigger Split Visual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Stream 1: User Cashback */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Stream A</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Transferred to User
                </span>
              </div>
              <h4 className="text-base font-bold text-white font-mono">$15.00 CASHBACK REBATE</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Directly transferred to the triggering user's available wallet balance as verified on-chain rebate.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400 font-bold">
              $15.00 USDT Instant Credit
            </div>
          </div>

          {/* Stream 2: Generation Pool */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-purple-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">Stream B</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                  10 Upline Levels
                </span>
              </div>
              <h4 className="text-base font-bold text-white font-mono">$15.00 GENERATION POOL</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Distributed evenly across 10 upline Magic Generation levels ($1.50 per level) walking through the inviter lineage.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-purple-300 font-bold">
              10 Levels × $1.50 = $15.00 USDT
            </div>
          </div>
        </div>

        {/* 10-Level Magic Generation Grid */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-bold">
            10-Tier Magic Generation Flow ($1.50 per level)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
            {magicLevels.map((lvl, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-500 block">{lvl.level}</span>
                <span className="text-xs font-bold text-purple-300 block mt-0.5">{lvl.amount}</span>
                <span className="text-[9px] text-zinc-400 block">{lvl.calc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clarification Note */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-amber-500/20 text-xs text-zinc-400 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-amber-300">Contract Trigger Notice:</strong> Magic Cashback is not guaranteed automatically for every user. The dual conditions (2 direct partners + $30 Magic Hold) must be satisfied. Quantum-active eligibility is checked for upline generation recipients; ineligible slots route to protocol admin reserves.
          </p>
        </div>
      </div>
    </div>
  );
};
