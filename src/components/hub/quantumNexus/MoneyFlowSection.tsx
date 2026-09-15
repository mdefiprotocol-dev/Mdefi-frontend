import React, { useState } from 'react';
import { 
  ArrowDown, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Coins, 
  Flame, 
  Cpu, 
  Network,
  PieChart,
  Percent
} from 'lucide-react';

export const MoneyFlowSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'both' | 'quantum' | 'nexus'>('both');

  const quantumAllocations = [
    { name: 'Direct Sponsor', amount: 12, percent: '17.14%', desc: 'Immediate direct referral payout to eligible sponsor', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
    { name: 'Admin Fee', amount: 4, percent: '5.71%', desc: 'Protocol infrastructure maintenance & server upkeep', color: 'text-zinc-300', border: 'border-zinc-700/40', bg: 'bg-zinc-800/40' },
    { name: 'MBTTC Liquidity', amount: 5, percent: '7.14%', desc: 'Direct liquidity injection backing the MBTTC DEX pool', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
    { name: 'Weekly Reward Pool', amount: 8, percent: '11.43%', desc: 'Fund pool for active Weekly Starter node distributions', color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10' },
    { name: 'Magic Pool', amount: 15, percent: '21.43%', desc: 'Feeds $15 Magic Cashback & 10-level Magic Generation', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
    { name: 'Matrix Value', amount: 26, percent: '37.14%', desc: 'Allocated to 30-position X6 radial matrix distribution', color: 'text-cyan-400 font-bold', border: 'border-cyan-500/40', bg: 'bg-cyan-500/10' },
  ];

  const nexusAllocations = [
    { name: 'Direct Sponsor', amount: 15, percent: '12.50%', desc: 'Instant direct commission to verified active sponsor', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
    { name: 'MBTTC Liquidity', amount: 5, percent: '4.17%', desc: 'Reserved for BEP-20 MBTTC liquidity pool support', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
    { name: 'Weekly Salary', amount: 30, percent: '25.00%', desc: 'Dedicated treasury pool powering weekly rank salaries', color: 'text-teal-400', border: 'border-teal-500/30', bg: 'bg-teal-500/10' },
    { name: 'Matrix Value', amount: 30, percent: '25.00%', desc: 'Base matrix distribution across 30 radial ring positions', color: 'text-cyan-400 font-bold', border: 'border-cyan-500/40', bg: 'bg-cyan-500/10' },
    { name: 'Generation Pool', amount: 40, percent: '33.33%', desc: 'Deep 11-generation multi-tier override distribution', color: 'text-indigo-400 font-bold', border: 'border-indigo-500/40', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* SECTION 3: PACKAGE COMPARISON */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                Package Architecture
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Package Allocation Comparison
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Exact smart-contract breakdown for Quantum ($70) and Nexus Prime ($120) activations.
            </p>
          </div>

          {/* Tab Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'both' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Side by Side
            </button>
            <button
              onClick={() => setActiveTab('quantum')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'quantum' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Quantum ($70)
            </button>
            <button
              onClick={() => setActiveTab('nexus')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'nexus' ? 'bg-cyan-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Nexus ($120)
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quantum Node Card ($70 USDT) */}
          {(activeTab === 'both' || activeTab === 'quantum') && (
            <div className="rounded-3xl p-6 bg-gradient-to-b from-[#0e1230]/90 via-[#070a1e]/95 to-[#040612]/95 border border-indigo-500/35 shadow-xl flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base tracking-tight font-mono">QUANTUM NODE</h3>
                      <span className="text-[11px] font-mono text-zinc-400">Package ID #1</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xl font-extrabold text-white">$70.00</span>
                    <span className="text-xs text-indigo-400 font-bold block">USDT</span>
                  </div>
                </div>

                {/* Breakdown rows */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-zinc-400">Direct Sponsor</span>
                    <span className="font-bold text-emerald-400">$12.00 USDT (17.14%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-zinc-400">Admin Protocol Fee</span>
                    <span className="font-bold text-zinc-300">$4.00 USDT (5.71%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-zinc-400">MBTTC Liquidity</span>
                    <span className="font-bold text-amber-400">$5.00 USDT (7.14%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-zinc-400">Weekly Reward Pool</span>
                    <span className="font-bold text-indigo-400">$8.00 USDT (11.43%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-zinc-400">Magic Pool</span>
                    <span className="font-bold text-purple-400">$15.00 USDT (21.43%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/40">
                    <span className="text-indigo-300 font-semibold">Matrix Value</span>
                    <span className="font-bold text-cyan-300">$26.00 USDT (37.14%)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950/90 border border-indigo-500/20 text-xs font-mono flex items-center justify-between">
                <span className="text-zinc-400">Total Contract Inflow:</span>
                <span className="text-white font-bold">$70.00 USDT (100%)</span>
              </div>
            </div>
          )}

          {/* Nexus Prime Card ($120 USDT) */}
          {(activeTab === 'both' || activeTab === 'nexus') && (
            <div className="rounded-3xl p-6 bg-gradient-to-b from-[#081826]/90 via-[#04101a]/95 to-[#02080d]/95 border border-cyan-500/35 shadow-xl flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                      <Network className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base tracking-tight font-mono">NEXUS PRIME</h3>
                      <span className="text-[11px] font-mono text-zinc-400">Package ID #2</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xl font-extrabold text-white">$120.00</span>
                    <span className="text-xs text-cyan-400 font-bold block">USDT</span>
                  </div>
                </div>

                {/* Breakdown rows */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-zinc-400">Direct Sponsor</span>
                    <span className="font-bold text-emerald-400">$15.00 USDT (12.50%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-zinc-400">MBTTC Liquidity</span>
                    <span className="font-bold text-amber-400">$5.00 USDT (4.17%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-zinc-400">Weekly Salary Pool</span>
                    <span className="font-bold text-teal-400">$30.00 USDT (25.00%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
                    <span className="text-cyan-300 font-semibold">Matrix Value</span>
                    <span className="font-bold text-cyan-300">$30.00 USDT (25.00%)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/40">
                    <span className="text-indigo-300 font-semibold">Generation Pool (11 Lvl)</span>
                    <span className="font-bold text-indigo-300">$40.00 USDT (33.33%)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950/90 border border-cyan-500/20 text-xs font-mono flex items-center justify-between">
                <span className="text-zinc-400">Total Contract Inflow:</span>
                <span className="text-white font-bold">$120.00 USDT (100%)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: QUANTUM $70 MONEY FLOW (Visual Tree + Percentage Table) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold block">
              Automated Inflow Pipeline
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              QUANTUM $70 MONEY FLOW
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
            $12 + $4 + $5 + $8 + $15 + $26 = $70
          </span>
        </div>

        {/* Visual Pipeline Flow Tree */}
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-5">
          {/* Top Inflow Node */}
          <div className="flex flex-col items-center text-center">
            <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-900 to-indigo-950 border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 block">Single Inflow</span>
              <span className="text-base sm:text-lg font-black text-white font-mono">$70 QUANTUM ACTIVATION</span>
            </div>
            <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500 to-zinc-700" />
            <div className="w-11/12 max-w-2xl h-0.5 bg-zinc-700 hidden sm:block" />
          </div>

          {/* 6 Destination Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {quantumAllocations.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border ${item.border} ${item.bg} flex flex-col justify-between space-y-2`}
              >
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    {item.name}
                  </span>
                  <span className={`text-lg font-mono font-extrabold ${item.color} block mt-0.5`}>
                    ${item.amount}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 block">
                    {item.percent}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight pt-1 border-t border-zinc-800/60">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Percentage Table for Quantum */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-3.5">Allocation Target</th>
                <th className="p-3.5">USDT Amount</th>
                <th className="p-3.5">Formula Ratio</th>
                <th className="p-3.5 text-right">Percentage Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-950/50">
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Direct Sponsor</span>
                </td>
                <td className="p-3 text-emerald-400 font-bold">$12.00 USDT</td>
                <td className="p-3 text-zinc-400">$12 / $70</td>
                <td className="p-3 text-right text-emerald-400 font-bold">17.14%</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  <span>Admin Protocol Maintenance</span>
                </td>
                <td className="p-3 text-zinc-300">$4.00 USDT</td>
                <td className="p-3 text-zinc-400">$4 / $70</td>
                <td className="p-3 text-right text-zinc-300">5.71%</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>MBTTC Liquidity Pool Fund</span>
                </td>
                <td className="p-3 text-amber-400 font-bold">$5.00 USDT</td>
                <td className="p-3 text-zinc-400">$5 / $70</td>
                <td className="p-3 text-right text-amber-400 font-bold">7.14%</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Weekly Reward Pool</span>
                </td>
                <td className="p-3 text-indigo-400 font-bold">$8.00 USDT</td>
                <td className="p-3 text-zinc-400">$8 / $70</td>
                <td className="p-3 text-right text-indigo-400 font-bold">11.43%</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Magic Pool (Cashback &amp; Gen)</span>
                </td>
                <td className="p-3 text-purple-400 font-bold">$15.00 USDT</td>
                <td className="p-3 text-zinc-400">$15 / $70</td>
                <td className="p-3 text-right text-purple-400 font-bold">21.43%</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Matrix Value (X6 Radial System)</span>
                </td>
                <td className="p-3 text-cyan-300 font-bold">$26.00 USDT</td>
                <td className="p-3 text-zinc-400">$26 / $70</td>
                <td className="p-3 text-right text-cyan-300 font-bold">37.14%</td>
              </tr>
              <tr className="bg-indigo-950/40 font-bold border-t border-indigo-500/30">
                <td className="p-3.5 text-white">TOTAL INFLOW RECONCILIATION</td>
                <td className="p-3.5 text-white">$70.00 USDT</td>
                <td className="p-3.5 text-zinc-400">$70 / $70</td>
                <td className="p-3.5 text-right text-white">100.00%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: NEXUS $120 MONEY FLOW (Visual Tree + Percentage Table) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-cyan-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
              Institutional Inflow Pipeline
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              NEXUS $120 MONEY FLOW
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
            $15 + $5 + $30 + $30 + $40 = $120
          </span>
        </div>

        {/* Visual Pipeline Flow Tree */}
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-5">
          {/* Top Inflow Node */}
          <div className="flex flex-col items-center text-center">
            <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-950 to-cyan-900 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 block">Single Inflow</span>
              <span className="text-base sm:text-lg font-black text-white font-mono">$120 NEXUS PRIME ACTIVATION</span>
            </div>
            <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-500 to-zinc-700" />
            <div className="w-10/12 max-w-xl h-0.5 bg-zinc-700 hidden sm:block" />
          </div>

          {/* 5 Destination Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {nexusAllocations.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border ${item.border} ${item.bg} flex flex-col justify-between space-y-2`}
              >
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    {item.name}
                  </span>
                  <span className={`text-lg font-mono font-extrabold ${item.color} block mt-0.5`}>
                    ${item.amount}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 block">
                    {item.percent}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight pt-1 border-t border-zinc-800/60">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Percentage Table for Nexus */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-3.5">Allocation Target</th>
                <th className="p-3.5">USDT Amount</th>
                <th className="p-3.5">Formula Ratio</th>
                <th className="p-3.5 text-right">Percentage Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-950/50">
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Direct Sponsor Commission</span>
                </td>
                <td className="p-3 text-emerald-400 font-bold">$15.00 USDT</td>
                <td className="p-3 text-zinc-400">$15 / $120</td>
                <td className="p-3 text-right text-emerald-400 font-bold">12.50%</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>MBTTC Liquidity Pool Fund</span>
                </td>
                <td className="p-3 text-amber-400 font-bold">$5.00 USDT</td>
                <td className="p-3 text-zinc-400">$5 / $120</td>
                <td className="p-3 text-right text-amber-400 font-bold">4.17%</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>Weekly Salary Treasury Pool</span>
                </td>
                <td className="p-3 text-teal-400 font-bold">$30.00 USDT</td>
                <td className="p-3 text-zinc-400">$30 / $120</td>
                <td className="p-3 text-right text-teal-400 font-bold">25.00%</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Matrix Value (X6 Radial System)</span>
                </td>
                <td className="p-3 text-cyan-300 font-bold">$30.00 USDT</td>
                <td className="p-3 text-zinc-400">$30 / $120</td>
                <td className="p-3 text-right text-cyan-300 font-bold">25.00%</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Generation Pool (11 Levels)</span>
                </td>
                <td className="p-3 text-indigo-300 font-bold">$40.00 USDT</td>
                <td className="p-3 text-zinc-400">$40 / $120</td>
                <td className="p-3 text-right text-indigo-300 font-bold">33.33%</td>
              </tr>
              <tr className="bg-cyan-950/40 font-bold border-t border-cyan-500/30">
                <td className="p-3.5 text-white">TOTAL INFLOW RECONCILIATION</td>
                <td className="p-3.5 text-white">$120.00 USDT</td>
                <td className="p-3.5 text-zinc-400">$120 / $120</td>
                <td className="p-3.5 text-right text-white">100.00%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
