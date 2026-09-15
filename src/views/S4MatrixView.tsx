import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Sparkles, 
  RotateCcw, 
  Layers, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Coins, 
  Clock, 
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Info,
  Lock
} from 'lucide-react';
import { S4PackageData } from '../types/s4Matrix';
import { juniorNodeData, seniorNodeData, placementColors } from '../data/s4MatrixData';
import { s4ContractService } from '../services/s4ContractService';
import { programPhaseService } from '../services/programPhaseService';
import { S4CircularRadialMatrix } from '../components/S4CircularRadialMatrix';
import { S4TransactionHistory } from '../components/S4TransactionHistory';
import { S4AiGuide } from '../components/S4AiGuide';

interface S4MatrixViewProps {
  initialPackage?: 'junior' | 'senior';
  onBackToDashboard?: () => void;
  isJuniorActive?: boolean;
  isSeniorActive?: boolean;
  onOpenPackageModal?: (pkg: 'junior' | 'senior') => void;
}

export const S4MatrixView: React.FC<S4MatrixViewProps> = ({
  initialPackage = 'junior',
  onBackToDashboard,
  isJuniorActive = true,
  isSeniorActive = true,
  onOpenPackageModal,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<'junior' | 'senior'>(initialPackage);
  const [pkgData, setPkgData] = useState<S4PackageData>(
    initialPackage === 'junior' ? juniorNodeData : seniorNodeData
  );

  useEffect(() => {
    setSelectedPackage(initialPackage);
  }, [initialPackage]);

  // Read contract-ready data from S4 Contract Service
  useEffect(() => {
    let isMounted = true;
    s4ContractService.getPackageData(selectedPackage).then((data) => {
      if (isMounted) {
        setPkgData(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedPackage]);

  const currentPkgData = pkgData;
  const isJunior = selectedPackage === 'junior';
  const progressPercent = Math.round((currentPkgData.filledPositions / currentPkgData.totalPositions) * 100);

  // Phased Launch & Package Activation Gating
  const isSelectedActive = isJunior ? isJuniorActive : isSeniorActive;
  const isAccessible = programPhaseService.isTreeAccessible('s4', isSelectedActive);
  const operationalState = programPhaseService.getModuleStatus('s4', isSelectedActive);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-28 lg:pb-12">
      {/* Top Navigation & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
              title="Return to Main Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                S4 MATRIX MODULE
              </span>
              <span className="text-xs font-mono text-zinc-400">
                2 Concentric Rings • 6 Positions
              </span>
            </div>
            {/* Header example format: "Junior Node — S4 Matrix — $10 USD" */}
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 flex-wrap">
              <span>{currentPkgData.name}</span>
              <span className="text-zinc-500 font-normal">—</span>
              <span className="text-emerald-400">S4 Matrix</span>
              <span className="text-zinc-500 font-normal">—</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-emerald-300">
                ${currentPkgData.priceUSD} USD
              </span>
            </h1>
          </div>
        </div>

        {/* Dedicated Package Navigation: Junior Node ($10) vs Senior Node ($25) */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-950/90 border border-zinc-800 self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => setSelectedPackage('junior')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              isJunior
                ? 'bg-emerald-500 text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Junior Node ($10)</span>
          </button>
          <button
            onClick={() => setSelectedPackage('senior')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              !isJunior
                ? 'bg-teal-500 text-black font-extrabold shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Senior Node ($25)</span>
          </button>
        </div>
      </div>

      {/* Package Header Card with Key Metrics, Progress Bar, & AI Guide */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#09170f] via-[#06120b] to-[#040906] border-2 border-emerald-500/35 overflow-hidden backdrop-blur-2xl shadow-[0_0_40px_rgba(16,185,129,0.1)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl w-full">
            <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-extrabold uppercase">
                STATUS: {currentPkgData.status}
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300 font-bold">Matrix #{currentPkgData.currentMatrixNumber}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-rose-400 font-bold">{currentPkgData.recycleCount} Completed Cycles</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">Owner: {currentPkgData.rootUser.userId}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {currentPkgData.name} — Circular Radial S4 Matrix
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {currentPkgData.description} 6 positions arranged across 2 concentric orbital rings. Complete all 6 positions to trigger automatic cycle payout and seamless re-entry under your sponsor.
            </p>

            {/* Matrix Completion / Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Current Cycle Progress:</span>
                <span className="text-emerald-400 font-extrabold">
                  {currentPkgData.filledPositions} of {currentPkgData.totalPositions} Slots Filled ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Income Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <div className="px-3 py-1 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-300 flex items-center gap-1.5">
                <span className="text-zinc-400">Direct Yield:</span>
                <span className="text-emerald-400 font-bold">{currentPkgData.directIncome}</span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-300 flex items-center gap-1.5">
                <span className="text-zinc-400">Matrix Yield:</span>
                <span className="text-emerald-400 font-bold">{currentPkgData.matrixIncome}</span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-400 font-bold">{currentPkgData.recycleIncome}</span>
                <span className="text-[10px] text-zinc-400">({currentPkgData.recycleIncomeNote})</span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 font-bold">
                <span>Cycle Potential: {currentPkgData.totalIncomePerCompleteMatrix}</span>
              </div>
            </div>
          </div>

          {/* AI Guide Assistant */}
          <div className="shrink-0 self-center lg:self-auto">
            <S4AiGuide 
              packageName={currentPkgData.name} 
              size="md"
            />
          </div>
        </div>
      </div>

      {/* S4 Circular Radial Matrix or Gated Lock State */}
      {!isAccessible ? (
        <div className="p-8 rounded-3xl bg-zinc-900/60 border border-amber-500/30 backdrop-blur-xl text-center space-y-4 max-w-xl mx-auto my-12">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              {operationalState === 'COMING_SOON' ? 'PHASE 2 MODULE — COMING SOON' : 'PACKAGE ACTIVATION REQUIRED'}
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              {operationalState === 'COMING_SOON'
                ? 'S4 Matrix Mainnet Launch Pending'
                : `${currentPkgData.name} Activation Required`}
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-2 leading-relaxed">
              {operationalState === 'COMING_SOON'
                ? 'The S4 Matrix is scheduled for activation in Phase 2 of the MDeFi protocol rollout. Real-time matrix tree visualization and cycle payouts will unlock upon deployment.'
                : `Activate your ${currentPkgData.name} ($${currentPkgData.priceUSD} USD) to unlock your 2-Ring concentric matrix tree, instant recycle tracking, and direct/matrix yields.`}
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {operationalState === 'ACTIVATION_REQUIRED' && onOpenPackageModal && (
              <button
                type="button"
                onClick={() => onOpenPackageModal(selectedPackage)}
                className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 transition-all cursor-pointer"
              >
                ACTIVATE {currentPkgData.name.toUpperCase()} (${currentPkgData.priceUSD})
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
        <div className="space-y-8">
          <S4CircularRadialMatrix packageData={currentPkgData} />

          {/* Complete Package Transaction History placed directly underneath the S4 circular matrix on the same page */}
          <S4TransactionHistory 
            transactions={currentPkgData.transactions}
            packageName={currentPkgData.name}
          />
        </div>
      )}
    </div>
  );
};

