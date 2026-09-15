import React, { useState } from 'react';
import { Calculator, CheckCircle, AlertCircle, Info, TrendingUp, ShieldAlert } from 'lucide-react';

export const S4CalculationCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'junior' | 'senior'>('junior');

  return (
    <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/90 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white font-mono">
              Educational Six-Partner Calculations
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Mathematical breakdown of 6 direct referrals vs matrix placement routing.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="inline-flex p-1 rounded-2xl bg-zinc-900 border border-zinc-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('junior')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'junior'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            S4 Junior ($10)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('senior')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'senior'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            S4 Senior ($25)
          </button>
        </div>
      </div>

      {/* Distinction Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/20 flex items-start gap-3 text-xs font-mono text-zinc-300">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white block">
            Critical Structural Separation:
          </span>
          <p className="text-zinc-400 leading-relaxed">
            The protocol strictly separates <strong className="text-emerald-300">Direct Referral Calculation</strong> from <strong className="text-cyan-300">Matrix Placement Calculation</strong>. One package activation is not double-counted; actual on-chain recipient and payment routing depend on sponsor, matrix placement, eligibility, and recycle state.
          </p>
        </div>
      </div>

      {activeTab === 'junior' ? (
        /* =========================================================================
           S4 JUNIOR ($10) 6-PARTNER CALCULATION
           ========================================================================= */
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                6 Partner Volume
              </span>
              <div className="text-2xl font-black text-white font-mono">
                $60 <span className="text-xs text-zinc-500 font-normal">USDT</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-1 block">6 × $10 packages</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/20">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                Direct Income (6 Referrals)
              </span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                $24 <span className="text-xs text-emerald-300/70 font-normal">USDT</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-1 block">6 × $4 per referral</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-cyan-500/20">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                Illustrative Matrix Income
              </span>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                $12 <span className="text-xs text-cyan-300/70 font-normal">USDT</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-1 block">3 × $4 Level-2 slots</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-zinc-900/80 to-teal-950/40 border border-emerald-500/40">
              <span className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider block mb-1">
                Illustrative Total
              </span>
              <div className="text-2xl font-black text-emerald-300 font-mono">
                $36 <span className="text-xs text-emerald-400/70 font-normal">USDT</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-1 block">$24 Direct + $12 Matrix</span>
            </div>
          </div>

          {/* Section 11 Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table 1: S4 Junior — 6 Partner Calculation Table */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  S4 Junior — 6 Partner Calculation Model
                </span>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-950/70 px-2 py-0.5 rounded border border-teal-500/30">
                  Illustrative Scenario
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                      <th className="py-2.5 pr-2 font-medium">Component</th>
                      <th className="py-2.5 px-2 font-medium">Calculation</th>
                      <th className="py-2.5 pl-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-zinc-300 font-medium">6 Partner Package Volume</td>
                      <td className="py-2.5 px-2 text-zinc-400">6 × $10</td>
                      <td className="py-2.5 pl-2 text-right text-white font-bold">$60</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-emerald-300 font-medium">Direct Income</td>
                      <td className="py-2.5 px-2 text-zinc-400">6 × $4</td>
                      <td className="py-2.5 pl-2 text-right text-emerald-400 font-bold">$24</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-cyan-300 font-medium">Illustrative Matrix Model</td>
                      <td className="py-2.5 px-2 text-zinc-400">3 × $4</td>
                      <td className="py-2.5 pl-2 text-right text-cyan-400 font-bold">$12</td>
                    </tr>
                    <tr className="bg-emerald-950/20 font-bold">
                      <td className="py-3 pr-2 text-emerald-200">Illustrative Income Total</td>
                      <td className="py-3 px-2 text-zinc-400">$24 + $12</td>
                      <td className="py-3 pl-2 text-right text-emerald-300 text-sm">$36</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] font-mono text-zinc-400 pt-1">
                *Illustrative S4 cycle calculation. Actual on-chain recipient and payment routing depend on sponsor, matrix placement, eligibility, and recycle state.
              </p>
            </div>

            {/* Table 2: Actual Package Allocation */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  $10 Single Package Allocation
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                  On-Chain Split
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                      <th className="py-2.5 pr-2 font-medium">Allocation</th>
                      <th className="py-2.5 pl-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-zinc-300">Direct Income</td>
                      <td className="py-2.5 pl-2 text-right text-emerald-400 font-bold">$4</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-zinc-300">Matrix Income Allocation</td>
                      <td className="py-2.5 pl-2 text-right text-cyan-400 font-bold">$4</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-zinc-300">MBTTC Liquidity</td>
                      <td className="py-2.5 pl-2 text-right text-amber-300 font-bold">$1</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-zinc-300">Platform/Admin Fee</td>
                      <td className="py-2.5 pl-2 text-right text-zinc-300 font-bold">$1</td>
                    </tr>
                    <tr className="bg-zinc-800/40 font-bold">
                      <td className="py-3 pr-2 text-white uppercase">TOTAL</td>
                      <td className="py-3 pl-2 text-right text-white text-sm">$10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] font-mono text-zinc-400 pt-1">
                *Verified on-chain contract split for S4 Package ID 1 ($10 USDT).
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
           S4 SENIOR ($25) 6-PARTNER CALCULATION
           ========================================================================= */
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                6 Partner Volume
              </span>
              <div className="text-2xl font-black text-white font-mono">
                $150 <span className="text-xs text-zinc-500 font-normal">USDT</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-1 block">6 × $25 packages</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/20">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                Direct Income (6 Referrals)
              </span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                $48 <span className="text-xs text-emerald-300/70 font-normal">USDT</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-1 block">6 × $8 per referral</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-cyan-500/20">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                Illustrative Matrix Income
              </span>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                $24 <span className="text-xs text-cyan-300/70 font-normal">USDT</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-1 block">3 × $8 Level-2 slots</span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-zinc-900/80 to-blue-950/40 border border-cyan-500/40">
              <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider block mb-1">
                Illustrative Total
              </span>
              <div className="text-2xl font-black text-cyan-300 font-mono">
                $72 <span className="text-xs text-cyan-400/70 font-normal">USDT</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-1 block">$48 Direct + $24 Matrix</span>
            </div>
          </div>

          {/* Section 12 Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table 1: S4 Senior — 6 Partner Calculation Table */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  S4 Senior — 6 Partner Calculation Model
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
                  Illustrative Scenario
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                      <th className="py-2.5 pr-2 font-medium">Component</th>
                      <th className="py-2.5 px-2 font-medium">Calculation</th>
                      <th className="py-2.5 pl-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-zinc-300 font-medium">6 Partner Package Volume</td>
                      <td className="py-2.5 px-2 text-zinc-400">6 × $25</td>
                      <td className="py-2.5 pl-2 text-right text-white font-bold">$150</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-emerald-300 font-medium">Direct Income</td>
                      <td className="py-2.5 px-2 text-zinc-400">6 × $8</td>
                      <td className="py-2.5 pl-2 text-right text-emerald-400 font-bold">$48</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-cyan-300 font-medium">Illustrative Matrix Model</td>
                      <td className="py-2.5 px-2 text-zinc-400">3 × $8</td>
                      <td className="py-2.5 pl-2 text-right text-cyan-400 font-bold">$24</td>
                    </tr>
                    <tr className="bg-cyan-950/20 font-bold">
                      <td className="py-3 pr-2 text-cyan-200">Illustrative Income Total</td>
                      <td className="py-3 px-2 text-zinc-400">$48 + $24</td>
                      <td className="py-3 pl-2 text-right text-cyan-300 text-sm">$72</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] font-mono text-zinc-400 pt-1">
                *Illustrative S4 cycle calculation. Actual on-chain recipient and payment routing depend on sponsor, matrix placement, eligibility, and recycle state.
              </p>
            </div>

            {/* Table 2: Actual Package Allocation */}
            <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  $25 Single Package Allocation
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                  On-Chain Split
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                      <th className="py-2.5 pr-2 font-medium">Allocation</th>
                      <th className="py-2.5 pl-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-zinc-300">Direct Income</td>
                      <td className="py-2.5 pl-2 text-right text-emerald-400 font-bold">$8</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-zinc-300">Matrix Income Allocation</td>
                      <td className="py-2.5 pl-2 text-right text-cyan-400 font-bold">$8</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-zinc-300">MBTTC Liquidity</td>
                      <td className="py-2.5 pl-2 text-right text-amber-300 font-bold">$2</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-zinc-300">Weekly Reward Fund</td>
                      <td className="py-2.5 pl-2 text-right text-purple-300 font-bold">$4</td>
                    </tr>
                    <tr className="hover:bg-zinc-800/30">
                      <td className="py-2.5 pr-2 text-zinc-300">Platform/Admin Fund</td>
                      <td className="py-2.5 pl-2 text-right text-zinc-300 font-bold">$3</td>
                    </tr>
                    <tr className="bg-zinc-800/40 font-bold">
                      <td className="py-3 pr-2 text-white uppercase">TOTAL</td>
                      <td className="py-3 pl-2 text-right text-white text-sm">$25</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] font-mono text-zinc-400 pt-1">
                *Verified on-chain contract split for S4 Package ID 2 ($25 USDT).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Disclaimer (Rule 19 & 28) */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-[11px] font-mono text-zinc-400 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-zinc-300">Protocol Disclaimer:</strong> Educational six-partner model. No guaranteed returns or risk-free profit. Actual outcomes depend on contract conditions, active sponsorship, matrix placement, eligibility, and on-chain activity.
        </p>
      </div>
    </div>
  );
};
