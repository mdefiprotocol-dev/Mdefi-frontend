import React, { useState } from 'react';
import { 
  Layers, 
  Network, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Percent, 
  Coins, 
  Calculator, 
  Info,
  RotateCcw,
  Eye
} from 'lucide-react';
import { QuantumNexusCircularMatrix } from '../../QuantumNexusCircularMatrix';
import { NexusPositionModal } from '../../NexusPositionModal';
import { 
  quantumNodeTreeData, 
  nexusPrimeTreeData, 
  nexusPositionColors 
} from '../../../data/nexusMatrixData';
import { NexusMatrixPosition, NexusTreeData } from '../../../types/nexusMatrix';

export const MatrixStructureSection: React.FC = () => {
  const [selectedPkg, setSelectedPkg] = useState<'quantum' | 'nexus'>('quantum');
  const [selectedPosition, setSelectedPosition] = useState<NexusMatrixPosition | null>(null);
  const [isRootModalOpen, setIsRootModalOpen] = useState(false);

  const activeTreeData: NexusTreeData = selectedPkg === 'quantum' ? quantumNodeTreeData : nexusPrimeTreeData;
  const packageName = selectedPkg === 'quantum' ? 'Quantum Node' : 'Nexus Prime';

  // Levels specification
  const levels = [
    {
      level: 1,
      name: 'LEVEL 1 (Inner Ring)',
      positions: 2,
      percent: 'Upline / Placement',
      percentVal: 0,
      rule: 'Follows contract upline / sponsor placement logic',
      quantumUsdt: '$0.00 (Upline placement)',
      nexusUsdt: '$0.00 (Upline placement)',
      quantumCalc: 'Direct contract upline allocation',
      nexusCalc: 'Direct contract upline allocation',
      badgeColor: 'border-zinc-700 bg-zinc-900 text-zinc-400',
    },
    {
      level: 2,
      name: 'LEVEL 2 (Ring 2)',
      positions: 4,
      percent: '20% per placement',
      percentVal: 20,
      totalPercent: '20% × 4 = 80%',
      rule: '20% matrix value distributed across 4 placements',
      quantumPerSlot: 5.20,
      quantumUsdt: '$20.80',
      quantumCalc: '$26 × 20% = $5.20 × 4 = $20.80',
      nexusPerSlot: 6.00,
      nexusUsdt: '$24.00',
      nexusCalc: '$30 × 20% = $6.00 × 4 = $24.00',
      badgeColor: 'border-indigo-500/40 bg-indigo-950/70 text-indigo-300',
    },
    {
      level: 3,
      name: 'LEVEL 3 (Ring 3)',
      positions: 8,
      percent: '30% per placement',
      percentVal: 30,
      totalPercent: '30% × 8 = 240%',
      rule: '30% matrix value distributed across 8 placements',
      quantumPerSlot: 7.80,
      quantumUsdt: '$62.40',
      quantumCalc: '$26 × 30% = $7.80 × 8 = $62.40',
      nexusPerSlot: 9.00,
      nexusUsdt: '$72.00',
      nexusCalc: '$30 × 30% = $9.00 × 8 = $72.00',
      badgeColor: 'border-cyan-500/40 bg-cyan-950/70 text-cyan-300',
    },
    {
      level: 4,
      name: 'LEVEL 4 (Outer Ring)',
      positions: 16,
      percent: '50% per placement',
      percentVal: 50,
      totalPercent: '50% × 16 = 800%',
      rule: '50% matrix value distributed across 16 placements',
      quantumPerSlot: 13.00,
      quantumUsdt: '$208.00',
      quantumCalc: '$26 × 50% = $13.00 × 16 = $208.00',
      nexusPerSlot: 15.00,
      nexusUsdt: '$240.00',
      nexusCalc: '$30 × 50% = $15.00 × 16 = $240.00',
      badgeColor: 'border-emerald-500/40 bg-emerald-950/70 text-emerald-300',
    },
  ];

  return (
    <div className="space-y-8">
      {/* SECTION 6 & 7: QUANTUM & NEXUS MATRIX STRUCTURE (REUSING EXISTING TREE) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                Verified Radial Engine
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-400" />
              <span>QUANTUM &amp; NEXUS MATRIX STRUCTURE</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              30-position radial X6 matrix visualization (Level 1: 2, Level 2: 4, Level 3: 8, Level 4: 16 positions).
            </p>
          </div>

          {/* Package Switcher for Live Tree Preview */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setSelectedPkg('quantum')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedPkg === 'quantum'
                  ? 'bg-indigo-600 text-white font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Quantum ($70 / $26 Mat)
            </button>
            <button
              type="button"
              onClick={() => setSelectedPkg('nexus')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedPkg === 'nexus'
                  ? 'bg-cyan-600 text-white font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Nexus ($120 / $30 Mat)
            </button>
          </div>
        </div>

        {/* Matrix Legend Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          {Object.entries(nexusPositionColors).map(([key, item]) => (
            <div
              key={key}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono"
            >
              <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
              <span className="text-zinc-300">{item.label}</span>
            </div>
          ))}
        </div>

        {/* EMBEDDED EXISTING MATRIX TREE */}
        <div className="rounded-3xl border border-zinc-800/90 bg-zinc-950/80 p-2 sm:p-6 overflow-hidden shadow-2xl">
          <QuantumNexusCircularMatrix
            treeData={activeTreeData}
            onSelectPosition={(pos) => setSelectedPosition(pos)}
            onSelectRoot={() => setIsRootModalOpen(true)}
          />
        </div>

        {/* Explanatory 30-Position Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Level 1</span>
            <span className="text-base font-bold text-white font-mono">2 Positions</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Slots #1 &amp; #2 (Upline)</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Level 2</span>
            <span className="text-base font-bold text-indigo-300 font-mono">4 Positions</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Slots #3 – #6 (20% each)</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Level 3</span>
            <span className="text-base font-bold text-cyan-300 font-mono">8 Positions</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Slots #7 – #14 (30% each)</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Level 4</span>
            <span className="text-base font-bold text-emerald-300 font-mono">16 Positions</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Slots #15 – #30 (50% each)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-indigo-500/30 text-xs font-mono flex items-center justify-between">
          <span className="text-zinc-400">Total Positions through Level 4:</span>
          <span className="text-white font-bold">2 + 4 + 8 + 16 = 30 Positions Total</span>
        </div>
      </div>

      {/* SECTION 7: MATRIX DISTRIBUTION MODEL (1,120% CUMULATIVE) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold block">
              Contract Distribution Mechanics
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              MATRIX DISTRIBUTION (1,120% MODEL)
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
            Cumulative: 80% + 240% + 800% = 1,120%
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          The X6 matrix distribution is determined by tier levels across the 30 positions. Each placement directly distributes a designated percentage of the package's matrix value base ($26 for Quantum, $30 for Nexus).
        </p>

        {/* 4 Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {levels.map((lvl) => (
            <div
              key={lvl.level}
              className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white font-mono">{lvl.name}</span>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${lvl.badgeColor}`}>
                    {lvl.positions} Positions
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{lvl.rule}</p>
              </div>

              {lvl.totalPercent && (
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Distribution Rate:</span>
                    <span className="font-bold text-white">{lvl.percent}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400 border-t border-zinc-800/60 pt-1">
                    <span>Level Total:</span>
                    <span className="font-bold text-emerald-400">{lvl.totalPercent}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Important Clarification Note */}
        <div className="p-4 rounded-2xl bg-zinc-950/90 border border-amber-500/30 flex items-start gap-3 text-xs text-zinc-300">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300 font-mono text-xs block">
              Cumulative Percentage Definition
            </span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              This <strong className="text-zinc-200">1,120%</strong> represents the cumulative matrix distribution percentage relative to the matrix-value base across the specified 30 positions. <strong className="text-amber-300">This does NOT represent guaranteed personal profit.</strong> Actual recipients of each placement are determined by contract placement, receiver, and active status logic.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 8: QUANTUM MATRIX USDT EXAMPLE ($26 Matrix Value -> $291.20) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-semibold block">
              Package ID #1 Calculation
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              QUANTUM MATRIX USDT CALCULATION ($26 MATRIX VALUE)
            </h2>
          </div>
          <div className="text-right font-mono text-xs">
            <span className="text-zinc-400 block">Gross Distribution:</span>
            <span className="text-emerald-400 font-bold text-base">$291.20 USDT</span>
          </div>
        </div>

        {/* Animated Calculation Flow Panel */}
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-indigo-500/30 space-y-4">
          <span className="text-xs font-mono text-indigo-300 uppercase tracking-wider block font-bold">
            Step-by-Step Matrix Level Computation
          </span>

          {/* Level 2 step */}
          <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase block font-semibold">Level 2 (4 Positions)</span>
              <div className="flex flex-wrap items-center gap-2 text-zinc-300">
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-bold">$26 Matrix Base</span>
                <span className="text-zinc-500">×</span>
                <span className="text-indigo-400 font-bold">20%</span>
                <span className="text-zinc-500">=</span>
                <span className="text-white font-bold">$5.20 / slot</span>
                <span className="text-zinc-500">×</span>
                <span className="text-white font-bold">4 slots</span>
              </div>
            </div>
            <div className="text-right font-bold text-sm text-indigo-300 sm:self-center">
              = $20.80 USDT
            </div>
          </div>

          {/* Level 3 step */}
          <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase block font-semibold">Level 3 (8 Positions)</span>
              <div className="flex flex-wrap items-center gap-2 text-zinc-300">
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-bold">$26 Matrix Base</span>
                <span className="text-zinc-500">×</span>
                <span className="text-cyan-400 font-bold">30%</span>
                <span className="text-zinc-500">=</span>
                <span className="text-white font-bold">$7.80 / slot</span>
                <span className="text-zinc-500">×</span>
                <span className="text-white font-bold">8 slots</span>
              </div>
            </div>
            <div className="text-right font-bold text-sm text-cyan-300 sm:self-center">
              = $62.40 USDT
            </div>
          </div>

          {/* Level 4 step */}
          <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase block font-semibold">Level 4 (16 Positions)</span>
              <div className="flex flex-wrap items-center gap-2 text-zinc-300">
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-bold">$26 Matrix Base</span>
                <span className="text-zinc-500">×</span>
                <span className="text-emerald-400 font-bold">50%</span>
                <span className="text-zinc-500">=</span>
                <span className="text-white font-bold">$13.00 / slot</span>
                <span className="text-zinc-500">×</span>
                <span className="text-white font-bold">16 slots</span>
              </div>
            </div>
            <div className="text-right font-bold text-sm text-emerald-300 sm:self-center">
              = $208.00 USDT
            </div>
          </div>

          {/* Summation Total Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950 via-indigo-900/70 to-zinc-950 border border-indigo-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-white font-bold block">Total Illustrative Matrix Distribution:</span>
              <span className="text-zinc-300 text-[11px]">$20.80 (L2) + $62.40 (L3) + $208.00 (L4)</span>
            </div>
            <span className="text-xl font-extrabold text-emerald-400">= $291.20 USDT</span>
          </div>
        </div>

        <p className="text-[11px] font-mono text-zinc-400">
          * Clearly labeled: <strong className="text-zinc-200">Illustrative gross matrix distribution based on the configured matrix-value percentages.</strong> Actual recipients are determined by contract placement, receiver and eligibility logic.
        </p>
      </div>

      {/* SECTION 9: NEXUS MATRIX USDT EXAMPLE ($30 Matrix Value -> $336.00) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-cyan-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
              Package ID #2 Calculation
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              NEXUS MATRIX USDT CALCULATION ($30 MATRIX VALUE)
            </h2>
          </div>
          <div className="text-right font-mono text-xs">
            <span className="text-zinc-400 block">Gross Distribution:</span>
            <span className="text-cyan-300 font-bold text-base">$336.00 USDT</span>
          </div>
        </div>

        {/* Animated Calculation Flow Panel */}
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-cyan-500/30 space-y-4">
          <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider block font-bold">
            Step-by-Step Matrix Level Computation
          </span>

          {/* Level 2 step */}
          <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase block font-semibold">Level 2 (4 Positions)</span>
              <div className="flex flex-wrap items-center gap-2 text-zinc-300">
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-bold">$30 Matrix Base</span>
                <span className="text-zinc-500">×</span>
                <span className="text-indigo-400 font-bold">20%</span>
                <span className="text-zinc-500">=</span>
                <span className="text-white font-bold">$6.00 / slot</span>
                <span className="text-zinc-500">×</span>
                <span className="text-white font-bold">4 slots</span>
              </div>
            </div>
            <div className="text-right font-bold text-sm text-indigo-300 sm:self-center">
              = $24.00 USDT
            </div>
          </div>

          {/* Level 3 step */}
          <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase block font-semibold">Level 3 (8 Positions)</span>
              <div className="flex flex-wrap items-center gap-2 text-zinc-300">
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-bold">$30 Matrix Base</span>
                <span className="text-zinc-500">×</span>
                <span className="text-cyan-400 font-bold">30%</span>
                <span className="text-zinc-500">=</span>
                <span className="text-white font-bold">$9.00 / slot</span>
                <span className="text-zinc-500">×</span>
                <span className="text-white font-bold">8 slots</span>
              </div>
            </div>
            <div className="text-right font-bold text-sm text-cyan-300 sm:self-center">
              = $72.00 USDT
            </div>
          </div>

          {/* Level 4 step */}
          <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase block font-semibold">Level 4 (16 Positions)</span>
              <div className="flex flex-wrap items-center gap-2 text-zinc-300">
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-bold">$30 Matrix Base</span>
                <span className="text-zinc-500">×</span>
                <span className="text-emerald-400 font-bold">50%</span>
                <span className="text-zinc-500">=</span>
                <span className="text-white font-bold">$15.00 / slot</span>
                <span className="text-zinc-500">×</span>
                <span className="text-white font-bold">16 slots</span>
              </div>
            </div>
            <div className="text-right font-bold text-sm text-emerald-300 sm:self-center">
              = $240.00 USDT
            </div>
          </div>

          {/* Summation Total Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950 via-cyan-900/70 to-zinc-950 border border-cyan-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-white font-bold block">Total Illustrative Matrix Distribution:</span>
              <span className="text-zinc-300 text-[11px]">$24.00 (L2) + $72.00 (L3) + $240.00 (L4)</span>
            </div>
            <span className="text-xl font-extrabold text-cyan-300">= $336.00 USDT</span>
          </div>
        </div>

        <p className="text-[11px] font-mono text-zinc-400">
          * Clearly labeled: <strong className="text-zinc-200">Illustrative gross matrix distribution.</strong> Do not represent this as guaranteed user profit.
        </p>
      </div>

      {/* Position Inspection Modal if User Clicks a Matrix Node */}
      <NexusPositionModal
        isOpen={Boolean(selectedPosition) || isRootModalOpen}
        position={selectedPosition}
        packageName={packageName}
        onClose={() => {
          setSelectedPosition(null);
          setIsRootModalOpen(false);
        }}
        rootUser={activeTreeData.rootUser}
        isRoot={isRootModalOpen}
      />
    </div>
  );
};
