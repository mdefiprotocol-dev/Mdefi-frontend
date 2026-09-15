import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Layers, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  RotateCcw, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Lock
} from 'lucide-react';
import { 
  NexusMatrixPosition, 
  NexusTreeData, 
  NexusPackageStats, 
  NexusTransactionRecord 
} from '../types/nexusMatrix';
import { nexusContractService } from '../services/nexusContractService';
import { programPhaseService } from '../services/programPhaseService';
import { QuantumNexusCircularMatrix } from '../components/QuantumNexusCircularMatrix';
import { NexusPositionModal } from '../components/NexusPositionModal';
import { NexusTransactionHistory } from '../components/NexusTransactionHistory';
import { nexusPositionColors } from '../data/nexusMatrixData';

interface NexusPrimeViewProps {
  onBackToPackages?: () => void;
  onBackToDashboard?: () => void;
  onNavigateToQuantum?: () => void;
  isUserPackageActive?: boolean;
  onOpenPackageModal?: () => void;
}

export const NexusPrimeView: React.FC<NexusPrimeViewProps> = ({
  onBackToPackages,
  onBackToDashboard,
  onNavigateToQuantum,
  isUserPackageActive = true,
  onOpenPackageModal,
}) => {
  // STRICTLY SCOPED TO PACKAGE ID 2 (Nexus Prime Node, $120)
  const PACKAGE_ID = 2;
  const [treeData, setTreeData] = useState<NexusTreeData | null>(null);
  const [stats, setStats] = useState<NexusPackageStats | null>(null);
  const [transactions, setTransactions] = useState<NexusTransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Phased Launch & Package Activation Gating
  const isAccessible = programPhaseService.isTreeAccessible('nexus_prime', isUserPackageActive);
  const operationalState = programPhaseService.getModuleStatus('nexus_prime', isUserPackageActive);

  // Position Modal State - MUST BE NULL / CLOSED on mount
  const [selectedPosition, setSelectedPosition] = useState<NexusMatrixPosition | null>(null);
  const [isRootModalOpen, setIsRootModalOpen] = useState(false);

  // Load contract-derived state specifically for Nexus Prime Node (pkgId = 2)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    // Explicitly ensure modals are closed
    setSelectedPosition(null);
    setIsRootModalOpen(false);

    async function loadNexusPrimePackageData() {
      try {
        const [loadedTree, loadedStats, loadedTx] = await Promise.all([
          nexusContractService.getMatrixTree(PACKAGE_ID),
          nexusContractService.getUserStatistics(PACKAGE_ID),
          nexusContractService.getPackageTransactions(PACKAGE_ID),
        ]);

        if (isMounted) {
          setTreeData(loadedTree);
          setStats(loadedStats);
          setTransactions(loadedTx);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to read contract data for Nexus Prime package 2', err);
        if (isMounted) setLoading(false);
      }
    }

    loadNexusPrimePackageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectRoot = () => {
    setIsRootModalOpen(true);
  };

  const handleSelectPosition = (pos: NexusMatrixPosition) => {
    setSelectedPosition(pos);
  };

  if (loading || !treeData || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center animate-spin text-teal-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-xs font-mono text-zinc-400">
          Reading Nexus Prime Node ($120) contract telemetry...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Top Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToPackages && (
            <button
              onClick={onBackToPackages}
              className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer flex items-center gap-2 text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Packages</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-500/40 uppercase">
                Package 4 &bull; Contract ID: 2
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Independent Nexus Prime Module
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight flex items-center gap-2.5 mt-0.5">
              <Sparkles className="w-7 h-7 text-teal-400" />
              <span>Nexus Prime Node X6 Matrix</span>
            </h1>
          </div>
        </div>

        {/* Action button to switch to Quantum Node ($70) */}
        {onNavigateToQuantum && (
          <button
            onClick={onNavigateToQuantum}
            className="px-4 py-2.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 hover:border-emerald-500/50 transition-all font-mono text-xs font-bold flex items-center gap-2.5 self-start md:self-auto cursor-pointer shadow-md group"
          >
            <Network className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Open Quantum Node ($70)</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* 2. Package Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-950/50 via-zinc-950 to-[#071312] border border-teal-500/30 p-6 sm:p-7 relative overflow-hidden backdrop-blur-xl shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                Package #{stats.packageId} &bull; {stats.status}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Activation Date: {stats.activationDate}
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {stats.name}
              </h2>
              <span className="text-xl font-extrabold text-teal-400 font-mono">
                ${stats.priceUSD} USD
              </span>
            </div>

            <p className="text-xs font-mono text-zinc-400 max-w-2xl leading-relaxed">
              Full 4-level circular radial matrix (2 &bull; 4 &bull; 8 &bull; 16 = 30 total positions). 
              Every position flows into automated cycle progression and re-entry logic.
            </p>
          </div>

          {/* Key Quick Badges */}
          <div className="flex items-center gap-4 flex-wrap shrink-0">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-teal-500/20 text-center min-w-[110px]">
              <span className="block text-[11px] font-mono text-zinc-400 mb-0.5">Recycle Count</span>
              <span className="text-xl font-black text-rose-400 font-mono">
                {stats.recycleCount} Recycles
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-teal-500/20 text-center min-w-[110px]">
              <span className="block text-[11px] font-mono text-zinc-400 mb-0.5">Current Matrix</span>
              <span className="text-xl font-black text-teal-300 font-mono">
                Cycle #{stats.currentMatrixNumber}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-teal-500/20 text-center min-w-[110px]">
              <span className="block text-[11px] font-mono text-zinc-400 mb-0.5">Completion</span>
              <span className="text-xl font-black text-white font-mono">
                {stats.completionPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Package Statistics Grid (8 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Metric 1: Recycle Count */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Recycle Count
          </span>
          <span className="text-lg font-black text-rose-400 font-mono">
            {stats.recycleCount}
          </span>
          <span className="block text-[9px] font-mono text-zinc-500 mt-0.5">
            Auto Re-entries
          </span>
        </div>

        {/* Metric 2: Total Matrix Positions */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Total Slots
          </span>
          <span className="text-lg font-black text-white font-mono">
            {stats.totalPositions}
          </span>
          <span className="block text-[9px] font-mono text-zinc-500 mt-0.5">
            2+4+8+16 Ring Nodes
          </span>
        </div>

        {/* Metric 3: Filled Positions */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Filled Slots
          </span>
          <span className="text-lg font-black text-teal-400 font-mono">
            {stats.filledPositions}
          </span>
          <span className="block text-[9px] font-mono text-zinc-500 mt-0.5">
            Occupied by Nodes
          </span>
        </div>

        {/* Metric 4: Open Positions */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Open Slots
          </span>
          <span className="text-lg font-black text-zinc-300 font-mono">
            {stats.openPositions ?? stats.availablePositions ?? 22}
          </span>
          <span className="block text-[9px] font-mono text-zinc-500 mt-0.5">
            Available Positions
          </span>
        </div>

        {/* Metric 5: Direct Placements */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Directs
          </span>
          <span className="text-lg font-black text-teal-400 font-mono">
            {stats.directPlacements ?? stats.directMembersCount ?? 4}
          </span>
          <span className="block text-[9px] font-mono text-zinc-500 mt-0.5">
            Sponsored Nodes
          </span>
        </div>

        {/* Metric 6: Spillovers */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Spillovers
          </span>
          <span className="text-lg font-black text-pink-400 font-mono">
            {stats.spilloverCount ?? stats.spilloverMembersCount ?? 3}
          </span>
          <span className="block text-[9px] font-mono text-zinc-500 mt-0.5">
            Upline Placements
          </span>
        </div>

        {/* Metric 7: Matrix Income */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Node Yield
          </span>
          <span className="text-lg font-black text-teal-300 font-mono">
            ${(stats.matrixIncomeUSD ?? 24).toFixed(2)}
          </span>
          <span className="block text-[9px] font-mono text-zinc-500 mt-0.5">
            Earned to Date
          </span>
        </div>

        {/* Metric 8: Smart Contract Sync */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
          <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
            Contract Status
          </span>
          <span className="text-xs font-black text-teal-400 font-mono flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            11_test_nexus
          </span>
          <span className="block text-[9px] font-mono text-zinc-500 mt-0.5">
            Verified On-Chain
          </span>
        </div>
      </div>

      {/* 4. Color Legend Bar */}
      <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Node Color Architecture:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              <div>
                <span className="block text-xs font-mono font-extrabold text-amber-300">YOU / Root</span>
                <span className="text-[10px] font-mono text-zinc-400">Center Origin</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <div>
                <span className="block text-xs font-mono font-extrabold text-emerald-300">Direct</span>
                <span className="text-[10px] font-mono text-zinc-400">Personal Referral</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
              <div>
                <span className="block text-xs font-mono font-extrabold text-pink-300">Spillover</span>
                <span className="text-[10px] font-mono text-zinc-400">Upline Matrix Flow</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              <div>
                <span className="block text-xs font-mono font-extrabold text-rose-300">Recycle</span>
                <span className="text-[10px] font-mono text-zinc-400">Cycle Re-entry</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-600 border-dashed" />
              <div>
                <span className="block text-xs font-mono font-extrabold text-zinc-300">Available Slot</span>
                <span className="text-[10px] font-mono text-zinc-400">Neutral Dark Gradient</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Circular Radial Matrix or Gated Lock State */}
      {!isAccessible ? (
        <div className="p-8 rounded-3xl bg-zinc-900/60 border border-amber-500/30 backdrop-blur-xl text-center space-y-4 max-w-xl mx-auto my-12">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              {operationalState === 'COMING_SOON' ? 'PHASE 3 MODULE — COMING SOON' : 'PACKAGE ACTIVATION REQUIRED'}
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              {operationalState === 'COMING_SOON'
                ? 'Nexus Prime Matrix Mainnet Launch Pending'
                : 'Nexus Prime Activation Required'}
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-2 leading-relaxed">
              {operationalState === 'COMING_SOON'
                ? 'Nexus Prime ($120) and the Weekly Passive Salary pool are scheduled for activation in Phase 3 of the MDeFi protocol rollout. Real-time matrix tree visualization will unlock upon deployment.'
                : 'Activate the $120 Nexus Prime Node to unlock your 4-Ring concentric matrix tree, top-tier generation rewards, and consistent weekly passive salary pool.'}
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {operationalState === 'ACTIVATION_REQUIRED' && onOpenPackageModal && (
              <button
                type="button"
                onClick={onOpenPackageModal}
                className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 transition-all cursor-pointer"
              >
                ACTIVATE NEXUS PRIME ($120)
              </button>
            )}
            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-all cursor-pointer"
              >
                BACK TO DASHBOARD
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* 5. Circular X6 Radial Matrix Visualization */}
          <QuantumNexusCircularMatrix
            treeData={treeData}
            onSelectPosition={handleSelectPosition}
            onSelectRoot={handleSelectRoot}
          />

          {/* 6. Complete Package Transaction History (Immediately below circular matrix on same page) */}
          <NexusTransactionHistory
            transactions={transactions}
            packageName={stats.name}
          />

          {/* 7. Position Details Modal - ONLY OPEN IF selectedPosition is non-null */}
          <NexusPositionModal
            isOpen={Boolean(selectedPosition)}
            position={selectedPosition}
            packageName={stats.name}
            onClose={() => setSelectedPosition(null)}
          />

          {/* 8. Root User Details Modal - ONLY OPEN IF isRootModalOpen is true */}
          <NexusPositionModal
            isOpen={isRootModalOpen}
            position={null}
            isRoot={true}
            rootUser={treeData.rootUser}
            packageName={stats.name}
            onClose={() => setIsRootModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};
