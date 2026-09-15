import React from 'react';
import { 
  Network, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowDown, 
  Sparkles, 
  Layers, 
  Search, 
  RotateCcw, 
  Info,
  Clock,
  Coins,
  Cpu
} from 'lucide-react';
import { quantumNodeStats, nexusPrimeStats } from '../../../data/nexusMatrixData';

export const SpilloverAndRulesSection: React.FC = () => {
  const distinctions = [
    { term: 'Sponsor', desc: 'The account whose referral link was used for registration. Receives direct sponsor commissions.' },
    { term: 'Actual Matrix Parent', desc: 'The immediate parent node above a position in the 30-slot radial structure. Often differs from direct sponsor.' },
    { term: 'Upline', desc: 'Accounts situated above in the organizational hierarchy and sponsor chain.' },
    { term: 'Spillover', desc: 'Positions placed into your matrix tree originating from activity by your upline or matrix parent.' },
    { term: 'Free Referrer', desc: 'An algorithmically identified open position in the network where auto-recycle re-entries are placed.' },
    { term: 'Recycle Recipient', desc: 'The upline node positioned to receive matrix distribution upon a node re-entry event.' },
    { term: 'Inactive Recipient', desc: 'An account lacking required active node status, causing the contract to redirect payout upwards.' },
  ];

  return (
    <div className="space-y-8">
      {/* SECTION 17 & 18: UPLINE, SPILLOVER & ELIGIBILITY */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold block">
              Placement Resolution Engine
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-400" />
              <span>UPLINE, SPILLOVER &amp; ELIGIBILITY</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
            Algorithmic Hierarchy
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          A fundamental concept of the MDeFi X6 matrix is that <strong className="text-white">a sponsor and actual matrix parent can be completely different accounts</strong>. Placements are guided by automated placement logic that cascades through available positions.
        </p>

        {/* 7 Key Architectural Distinctions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {distinctions.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">{item.term}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* SECTION 18: SPILLOVER & FALLBACK FLOWCHART */}
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/90 border border-indigo-500/30 space-y-5">
          <span className="text-xs font-mono text-indigo-300 uppercase tracking-wider block font-bold">
            Spillover &amp; Inactive Receiver Search Algorithm
          </span>

          <div className="flex flex-col items-center space-y-3 font-mono text-xs max-w-2xl mx-auto">
            {/* Sponsor */}
            <div className="w-full sm:w-80 p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-center font-bold text-white">
              SPONSOR (Direct Inviter)
            </div>
            <ArrowDown className="w-4 h-4 text-zinc-500" />

            {/* Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center">
                <span className="text-[10px] text-emerald-300 block">Immediate Commission</span>
                <span className="font-bold text-emerald-300">DIRECT MEMBER ($12 / $15)</span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-center">
                <span className="text-[10px] text-indigo-300 block">Cascading Slot Search</span>
                <span className="font-bold text-indigo-300">MATRIX PLACEMENT (Slot 1-30)</span>
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-zinc-500" />

            {/* Actual Parent & Spillover */}
            <div className="w-full sm:w-80 p-3 rounded-xl bg-zinc-900 border border-indigo-500/30 text-center">
              <span className="text-[10px] text-zinc-400 block">Assigned Radial Position</span>
              <span className="font-bold text-white">ACTUAL MATRIX PARENT</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">(Generates Team Spillover)</span>
            </div>

            <ArrowDown className="w-4 h-4 text-zinc-500" />

            {/* Matrix Receiver Evaluation */}
            <div className="w-full sm:w-80 p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-center font-bold text-purple-200">
              MATRIX RECEIVER RESOLUTION
            </div>

            <ArrowDown className="w-4 h-4 text-zinc-500" />

            {/* Branch: Active vs Inactive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {/* Active */}
              <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 space-y-1">
                <span className="text-[10px] font-bold text-emerald-300 uppercase block">State A: ACTIVE &amp; ELIGIBLE</span>
                <span className="text-white font-bold block text-sm">Direct Payment Credit</span>
                <p className="text-[10px] text-zinc-400">Matrix distribution credited directly to receiver balance.</p>
              </div>

              {/* Inactive */}
              <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 space-y-1">
                <span className="text-[10px] font-bold text-rose-300 uppercase block">State B: INACTIVE / BLOCKED</span>
                <span className="text-white font-bold block text-sm">Search Upward Chain</span>
                <p className="text-[10px] text-zinc-400">Walks upward to find next eligible active node or reaches rootAdmin.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2.5">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            Compliance Directive: Characterized strictly as <strong className="text-zinc-200">"Upline / Spillover / Eligibility-based distribution"</strong>. Never referred to as guaranteed non-working income.
          </span>
        </div>
      </div>

      {/* SECTION 19: WHO RECEIVES WHAT? (MASTER SUMMARY TABLE) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold block">
              Protocol Ledger Breakdown
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              WHO RECEIVES WHAT? (MASTER COMPARISON)
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-3.5">Distribution Stream</th>
                <th className="p-3.5">Quantum ($70 Entry)</th>
                <th className="p-3.5">Nexus Prime ($120 Entry)</th>
                <th className="p-3.5 text-right">Recipient Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-950/50">
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct Sponsor</span>
                </td>
                <td className="p-3 text-emerald-400 font-bold">$12.00 USDT (17.14%)</td>
                <td className="p-3 text-emerald-400 font-bold">$15.00 USDT (12.50%)</td>
                <td className="p-3 text-right text-zinc-300">Direct inviter (Active check)</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Matrix Value (30 Slots)</span>
                </td>
                <td className="p-3 text-cyan-300 font-bold">$26.00 USDT (37.14%)</td>
                <td className="p-3 text-cyan-300 font-bold">$30.00 USDT (25.00%)</td>
                <td className="p-3 text-right text-zinc-300">Radial position receiver (20/30/50%)</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Generation Pool</span>
                </td>
                <td className="p-3 text-zinc-500">— (Via Magic Pool)</td>
                <td className="p-3 text-indigo-400 font-bold">$40.00 USDT (33.33%)</td>
                <td className="p-3 text-right text-zinc-300">11 Upline sponsor tiers ($1.50–$10)</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Magic Cashback Pool</span>
                </td>
                <td className="p-3 text-purple-400 font-bold">$15.00 USDT (21.43%)</td>
                <td className="p-3 text-zinc-500">—</td>
                <td className="p-3 text-right text-zinc-300">2 Directs + $30 Hold trigger</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Weekly Reward / Salary</span>
                </td>
                <td className="p-3 text-indigo-400 font-bold">$8.00 USDT (11.43%)</td>
                <td className="p-3 text-teal-400 font-bold">$30.00 USDT (25.00%)</td>
                <td className="p-3 text-right text-zinc-300">Weekly rank qualification pool</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>MBTTC Liquidity Pool</span>
                </td>
                <td className="p-3 text-amber-400 font-bold">$5.00 USDT (7.14%)</td>
                <td className="p-3 text-amber-400 font-bold">$5.00 USDT (4.17%)</td>
                <td className="p-3 text-right text-zinc-300">Protocol DEX AMM contract</td>
              </tr>
              <tr>
                <td className="p-3 text-white font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Admin Protocol Fee</span>
                </td>
                <td className="p-3 text-zinc-300 font-bold">$4.00 USDT (5.71%)</td>
                <td className="p-3 text-zinc-500">— (Integrated)</td>
                <td className="p-3 text-right text-zinc-300">Operations &amp; infrastructure</td>
              </tr>
              <tr className="bg-indigo-950/40 font-bold border-t border-indigo-500/30">
                <td className="p-3.5 text-white">TOTAL PACKAGE INFLOW</td>
                <td className="p-3.5 text-white">$70.00 USDT</td>
                <td className="p-3.5 text-white">$120.00 USDT</td>
                <td className="p-3.5 text-right text-emerald-400">100% Balanced Allocation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 20: MATRIX VS DIRECT VS GENERATION (3 DISTINCT MECHANISMS) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold block">
              Three Separate Incentive Engines
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              MATRIX vs. DIRECT vs. GENERATION
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Engine 1: Direct */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Engine 01</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Referral Link
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-mono">DIRECT INCOME</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Triggered strictly by direct account invitation. Bypasses tree structure directly to the sponsor.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Quantum:</span>
                <span className="font-bold text-emerald-400">$12.00 USDT</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Nexus:</span>
                <span className="font-bold text-emerald-400">$15.00 USDT</span>
              </div>
            </div>
          </div>

          {/* Engine 2: Matrix */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-cyan-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Engine 02</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  30-Slot Rings
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-mono">MATRIX INCOME</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Determined by position slot placement in the radial tree. Distributes 20%, 30%, or 50% based on ring level.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Quantum Base:</span>
                <span className="font-bold text-cyan-300">$26.00 Matrix Value</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Nexus Base:</span>
                <span className="font-bold text-cyan-300">$30.00 Matrix Value</span>
              </div>
            </div>
          </div>

          {/* Engine 3: Generation */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-indigo-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">Engine 03</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                  Sponsor Lineage
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-mono">GENERATION INCOME</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Multi-tier override rewards walking upward through 11 generations of personal sponsor tree lineage.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Nexus Pool:</span>
                <span className="font-bold text-indigo-300">$40.00 Total</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Depth:</span>
                <span className="font-bold text-white">11 Active Levels</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 21: CONTRACT-BASED RECIPIENT LOGIC */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
          <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold block">
              Smart Contract Architecture
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              WHO ACTUALLY RECEIVES A PAYMENT?
            </h3>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          The smart contract does <strong className="text-rose-300">NOT</strong> simply assume that <code className="text-zinc-200">Sponsor = Matrix Parent = Income Receiver</code>. Instead, every transaction execution runs on-chain evaluation:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono text-zinc-300">
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>Sponsor/Referrer Link verification</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>Actual Matrix Parent assignment</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>Package active status verification</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>Blocked status &amp; account eligibility</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>Free Referrer re-entry slot calculation</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>Spillover cascade fallback resolution</span>
          </div>
        </div>
      </div>

      {/* SECTION 22: LIVE ON-CHAIN MATRIX DATA */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
              Node Telemetry
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>LIVE ON-CHAIN MATRIX INFORMATION</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connected Telemetry</span>
          </span>
        </div>

        {/* Live Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
          {/* Quantum Live Node Card */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-white font-bold">QUANTUM NODE (ID: 1)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">
                {quantumNodeStats.status}
              </span>
            </div>
            <div className="space-y-2 text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">Current Matrix Round:</span>
                <span className="font-bold text-white">#{quantumNodeStats.currentMatrixNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Recycle Count:</span>
                <span className="font-bold text-indigo-400">{quantumNodeStats.recycleCount} Recycles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Filled Slots:</span>
                <span className="font-bold text-emerald-400">{quantumNodeStats.filledPositions} / 30 ({quantumNodeStats.completionPercentage}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Open Slots:</span>
                <span className="font-bold text-zinc-400">{quantumNodeStats.openPositions} Slots Available</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Direct Placements:</span>
                <span className="font-bold text-white">{quantumNodeStats.directPlacements} Nodes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Spillover Placements:</span>
                <span className="font-bold text-white">{quantumNodeStats.spilloverCount} Nodes</span>
              </div>
            </div>
          </div>

          {/* Nexus Live Node Card */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-white font-bold">NEXUS PRIME (ID: 2)</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 text-[10px]">
                {nexusPrimeStats.status}
              </span>
            </div>
            <div className="space-y-2 text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">Current Matrix Round:</span>
                <span className="font-bold text-white">#{nexusPrimeStats.currentMatrixNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Recycle Count:</span>
                <span className="font-bold text-cyan-400">{nexusPrimeStats.recycleCount} Recycles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Filled Slots:</span>
                <span className="font-bold text-cyan-400">{nexusPrimeStats.filledPositions} / 30 ({nexusPrimeStats.completionPercentage}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Open Slots:</span>
                <span className="font-bold text-zinc-400">{nexusPrimeStats.openPositions} Slots Available</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Direct Placements:</span>
                <span className="font-bold text-white">{nexusPrimeStats.directPlacements} Nodes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Spillover Placements:</span>
                <span className="font-bold text-white">{nexusPrimeStats.spilloverCount} Nodes</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] font-mono text-zinc-500">
          Note: In accordance with security constraints, no simulated wallet addresses or fake transaction hashes are fabricated. Displayed values reflect actual on-chain data or "Waiting for on-chain data".
        </p>
      </div>

      {/* SECTION 26: IMPORTANT FINANCIAL LANGUAGE & NOTES */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950 border border-amber-500/30 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
            Important Protocol &amp; Regulatory Notes
          </h3>
        </div>

        <div className="space-y-2 text-xs text-zinc-400 leading-relaxed">
          <p>
            • All figures presented throughout this technical module represent an <strong className="text-zinc-200">illustrative calculation based on the current smart-contract configuration</strong>.
          </p>
          <p>
            • Node participation is subject to on-chain conditions, network transactions, active tier eligibility, and automated matrix turnover. Income is never guaranteed, risk-free, or passive without network placement.
          </p>
          <p>
            • Recipient routing enforces cryptographic state checks: if an upline or sponsor is inactive or blocked, contract fallback logic routes distributions to eligible upline nodes or root protocol admin pools.
          </p>
        </div>
      </div>
    </div>
  );
};
