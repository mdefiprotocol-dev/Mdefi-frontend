import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Network, 
  Cpu, 
  Layers, 
  RotateCcw, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { NavPage } from '../../../types';
import { QuantumHero } from './QuantumHero';
import { MoneyFlowSection } from './MoneyFlowSection';
import { MatrixStructureSection } from './MatrixStructureSection';
import { CycleRecycleSection } from './CycleRecycleSection';
import { IncomeStreamsSection } from './IncomeStreamsSection';
import { SpilloverAndRulesSection } from './SpilloverAndRulesSection';

interface QuantumNexusDetailProps {
  onBack: () => void;
  onNavigate?: (page: NavPage) => void;
}

export const QuantumNexusDetail: React.FC<QuantumNexusDetailProps> = ({
  onBack,
  onNavigate,
}) => {
  const [selectedPkg, setSelectedPkg] = useState<'quantum' | 'nexus'>('quantum');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300 pb-16">
      {/* ── 1. TOP ACTION BAR: [← Back to MDeFi Hub] ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition-all text-xs font-mono group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-indigo-400" />
          <span>Back to MDeFi Hub</span>
        </button>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('quantum-nexus')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/90 text-indigo-300 border border-indigo-500/40 text-xs font-mono transition-all"
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Open Quantum Matrix</span>
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('nexus-prime')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-all"
              >
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open Nexus Prime</span>
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── 2. HERO SECTION & INTRODUCTION (Sections 1 & 2) ── */}
      <QuantumHero 
        selectedPkg={selectedPkg}
        onSelectPackage={(pkg) => setSelectedPkg(pkg)}
      />

      {/* ── 3. PACKAGE COMPARISON & MONEY FLOW (Sections 3, 4, 5) ── */}
      <MoneyFlowSection />

      {/* ── 4. EXISTING MATRIX TREE & CALCULATION ENGINES (Sections 6, 7, 8, 9, 24) ── */}
      <MatrixStructureSection />

      {/* ── 5. MATRIX CYCLE & RE-ENTRY LIFECYCLE (Sections 10, 11) ── */}
      <CycleRecycleSection />

      {/* ── 6. DIRECT, NEXUS 11-GENERATION & MAGIC CASHBACK (Sections 12, 13, 14, 15, 16) ── */}
      <IncomeStreamsSection />

      {/* ── 7. SPILLOVER, ELIGIBILITY, MASTER COMPARISON & LIVE TELEMETRY (Sections 17-23, 26) ── */}
      <SpilloverAndRulesSection />

      {/* ── 8. BOTTOM FOOTER NAVIGATION ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-800 text-xs font-mono text-zinc-400">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>MDeFi Ecosystem Hub • Card 03: Quantum &amp; Nexus Nodes</span>
        </span>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Hub Grid</span>
        </button>
      </div>
    </div>
  );
};
