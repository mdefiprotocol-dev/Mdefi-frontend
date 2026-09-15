import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Network, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';

interface QuantumHeroProps {
  onSelectPackage?: (pkg: 'quantum' | 'nexus') => void;
  selectedPkg?: 'quantum' | 'nexus';
}

export const QuantumHero: React.FC<QuantumHeroProps> = ({
  onSelectPackage,
  selectedPkg = 'quantum',
}) => {
  return (
    <div className="space-y-6">
      {/* Hero Banner Container */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-b from-[#0d1028]/95 via-[#080a1c]/90 to-[#04050f]/95 border border-indigo-500/35 shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
        {/* Ambient background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl bg-indigo-500/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl bg-cyan-500/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent"
        />

        <div className="relative z-10 space-y-8">
          {/* Top Badges & Titles */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase border bg-zinc-900/90 text-indigo-300 border-indigo-500/40">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span>HIGH-TIER MATRIX</span>
                </span>

                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-400">
                  CARD 03
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 font-semibold">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>LAUNCHING SOON</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                QUANTUM &amp; NEXUS NODES
              </h1>

              <p className="text-xs sm:text-sm font-mono text-indigo-300/90 font-medium">
                Advanced Matrix Infrastructure Powered by the MDeFi Ecosystem
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto bg-zinc-950/80 p-1.5 rounded-2xl border border-zinc-800/90 text-xs font-mono">
              <span className="px-3 py-1 text-zinc-400">Target Protocol:</span>
              <span className="px-3 py-1 rounded-xl bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 font-semibold">
                X6 30-Slot Architecture
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300/90 leading-relaxed max-w-3xl">
            Quantum and Nexus are high-tier decentralized node structures engineered for systematic multi-level capital efficiency. Built upon verifiable smart-contract placement, automated generation allocations, direct sponsor recognition, and recurring matrix cycles.
          </p>

          {/* 2 Premium Package Cards: Quantum ($70) & Nexus Prime ($120) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Card 1: Quantum Node ($70 USDT) */}
            <div
              onClick={() => onSelectPackage?.('quantum')}
              className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                selectedPkg === 'quantum'
                  ? 'bg-gradient-to-b from-[#121636] to-[#080a1c] border-indigo-500/60 shadow-[0_0_30px_rgba(99,102,241,0.2)]'
                  : 'bg-zinc-950/70 border-zinc-800/80 hover:border-indigo-500/30'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* Premium Animated Icon for Quantum: quantum/chip visual, orbital ring, subtle energy pulse */}
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-950/90 border border-indigo-500/40 shadow-inner">
                    <div className="absolute inset-0 rounded-2xl border border-indigo-400/30 animate-[spin_10s_linear_infinite] motion-reduce:animate-none pointer-events-none" />
                    <Cpu className="w-6 h-6 text-indigo-400 relative z-10 animate-pulse motion-reduce:animate-none" />
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
                    Package ID: 1
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span>QUANTUM NODE</span>
                    <span className="text-xs font-mono font-normal text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                      Tier 1
                    </span>
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">$70</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">USDT</span>
                    <span className="text-xs text-zinc-400 font-mono ml-1">• 1 Activation Unit</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  Fast-paced matrix engine featuring direct sponsor distribution, $15 Magic Cashback pool integration, and weekly reward incentives.
                </p>

                <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800/80 text-[11px] font-mono grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-zinc-500 block">Matrix Value:</span>
                    <span className="font-bold text-indigo-300">$26.00 USDT</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Direct Sponsor:</span>
                    <span className="font-bold text-emerald-400">$12.00 USDT</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-indigo-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>30-Node Radial Matrix</span>
                </span>
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Card 2: Nexus Prime ($120 USDT) */}
            <div
              onClick={() => onSelectPackage?.('nexus')}
              className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                selectedPkg === 'nexus'
                  ? 'bg-gradient-to-b from-[#081a26] to-[#040e17] border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                  : 'bg-zinc-950/70 border-zinc-800/80 hover:border-cyan-500/30'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* Premium Animated Icon for Nexus: interconnected nodes, network/core visual, rotating ring */}
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-950/90 border border-cyan-500/40 shadow-inner">
                    <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 animate-[spin_12s_linear_infinite] motion-reduce:animate-none pointer-events-none" />
                    <Network className="w-6 h-6 text-cyan-400 relative z-10 animate-pulse motion-reduce:animate-none" />
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    Package ID: 2
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span>NEXUS PRIME</span>
                    <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                      Tier 2
                    </span>
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">$120</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">USDT</span>
                    <span className="text-xs text-zinc-400 font-mono ml-1">• 1 Activation Unit</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  Institutional matrix infrastructure pairing $30 matrix value with deep 11-generation multi-tier override payouts and weekly salary backing.
                </p>

                <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800/80 text-[11px] font-mono grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-zinc-500 block">Matrix Value:</span>
                    <span className="font-bold text-cyan-300">$30.00 USDT</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Generation Pool:</span>
                    <span className="font-bold text-emerald-400">$40.00 (11 Lvl)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>11-Tier Generation Tree</span>
                </span>
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. IMPORTANT INTRODUCTION: QUANTUM & NEXUS — HOW IT WORKS */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-indigo-500/20 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
          <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold block">
              Architectural Overview
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              QUANTUM &amp; NEXUS — HOW IT WORKS
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-xs leading-relaxed text-zinc-300">
          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
            <span className="font-mono font-bold text-white text-xs block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Multi-Pronged Capital Routing</span>
            </span>
            <p className="text-zinc-400 text-[11px]">
              Quantum and Nexus are advanced MDeFi ecosystem node structures combining matrix placement, direct sponsorship, generation distribution, reward mechanisms and recurring matrix cycles.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
            <span className="font-mono font-bold text-white text-xs block flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Placement &amp; Eligibility Engine</span>
            </span>
            <p className="text-zinc-400 text-[11px]">
              The actual recipient of a payout depends on the contract's placement, eligibility, active status and referrer logic. Payments do not simply default to a single sponsor; they follow strict on-chain routing rules.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-amber-500/20 space-y-2">
            <span className="font-mono font-bold text-amber-300 text-xs block flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Regulatory Compliance Note</span>
            </span>
            <p className="text-zinc-400 text-[11px]">
              All calculations presented throughout this module represent an <strong className="text-zinc-200">illustrative calculation based on the current contract configuration</strong>. Income is never guaranteed or passive without meeting contract requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
