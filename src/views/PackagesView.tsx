import React from 'react';
import { 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  RotateCcw,
  Network,
  Coins,
  Lock,
  Zap,
  Crown,
  Orbit,
  Cpu,
  Gift,
  Award
} from 'lucide-react';
import { PackageItem } from '../types';
import { juniorNodeData, seniorNodeData } from '../data/s4MatrixData';
import { quantumNodeStats, nexusPrimeStats } from '../data/nexusMatrixData';
import { S4AiGuide } from '../components/S4AiGuide';
import { AiHumanCharacter } from '../components/AiHumanCharacter';
import { programPhaseService } from '../services/programPhaseService';

interface PackagesViewProps {
  packages: PackageItem[];
  userWalletAddress?: string;
  onOpenPackageModal: (pkg: PackageItem) => void;
  onNavigateS4?: (pkg?: 'junior' | 'senior') => void;
  onNavigateNexus?: (packageId: 1 | 2) => void;
  onNavigateQuantum?: () => void;
  onNavigateNexusPrime?: () => void;
  onResetPackages?: () => void;
  onShowToast?: (message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  packages,
  userWalletAddress: _userWalletAddress,
  onOpenPackageModal,
  onNavigateS4,
  onNavigateNexus: _onNavigateNexus,
  onNavigateQuantum,
  onNavigateNexusPrime,
  onResetPackages,
  onShowToast,
}) => {
  // Find package items from state or construct clean fallbacks matching canonical specifications
  const juniorPkg = packages.find(p => p.id === 'pkg-junior') || {
    id: 'pkg-junior',
    name: 'Junior Node',
    priceUSD: 10,
    status: 'Available',
    activationDate: 'Not Activated',
    version: 'v1.0 (S4)',
    rewardStatus: 'Standby',
    dailyRewardEstimate: '$4.00 (40%) Direct + $12.00 (300%) Matrix',
    maxReturn: '2x2 Binary Matrix (6 Slots)',
    features: ['2x2 Fast-Cycling Matrix', 'Direct & Spillover Placement', 'Continuous Auto-Recycle at Slot #6'],
  };

  const seniorPkg = packages.find(p => p.id === 'pkg-senior') || {
    id: 'pkg-senior',
    name: 'Senior Node',
    priceUSD: 25,
    status: 'Available',
    activationDate: 'Not Activated',
    version: 'v1.0 (S4)',
    rewardStatus: 'Standby',
    dailyRewardEstimate: '$8.00 (32%) Direct + $24.00 (300%) Matrix',
    maxReturn: '2x2 Binary Matrix (6 Slots)',
    features: ['Double Matrix Capacity', 'Unlimited Weekly Reward Every Week', 'Continuous Auto-Recycle at Slot #6'],
  };

  const quantumPkg = packages.find(p => p.id === 'pkg-quantum') || {
    id: 'pkg-quantum',
    name: 'Quantum Node',
    priceUSD: 70,
    status: 'Available',
    activationDate: 'Not Activated',
    version: 'v1.0 (11_test_nexus)',
    rewardStatus: 'Standby',
    dailyRewardEstimate: '$12.00 Direct + $265.20 Matrix Tier',
    maxReturn: 'Concentric 4-Ring (30 Positions)',
    features: ['Concentric Radial Matrix', '$15 Magic Cashback per 2 Directs', '10 Levels Generation Yields'],
  };

  const nexusPrimePkg = packages.find(p => p.id === 'pkg-nexus-prime') || {
    id: 'pkg-nexus-prime',
    name: 'Nexus Prime Node',
    priceUSD: 120,
    status: 'Available',
    activationDate: 'Not Activated',
    version: 'v1.0 (11_test_nexus)',
    rewardStatus: 'Standby',
    dailyRewardEstimate: '$15.00 Direct + $306.00 Matrix Tier',
    maxReturn: 'Concentric 4-Ring (30 Positions)',
    features: ['Prime Concentric Matrix', 'Unlimited Weekly Sellery Every Week', '11 Levels Generation Yields'],
  };

  const isPhase2Active = programPhaseService.isModuleUnlocked('s4');
  const isPhase3Active = programPhaseService.isModuleUnlocked('quantum_nexus');

  const isJuniorActive = isPhase2Active && juniorPkg.status === 'Active';
  const isSeniorActive = isPhase2Active && seniorPkg.status === 'Active';
  const isQuantumActive = isPhase3Active && quantumPkg.status === 'Active';
  const isNexusPrimeActive = isPhase3Active && nexusPrimePkg.status === 'Active';

  // Tree access guards
  const handleLaunchJuniorTree = () => {
    if (!isPhase2Active) {
      if (onShowToast) onShowToast('Junior Node ($10) unlocks in Phase 2 community launch', 'warning');
      return;
    }
    if (!isJuniorActive) {
      if (onShowToast) onShowToast('Please activate Junior Node ($10) to access its matrix tree', 'warning');
      onOpenPackageModal(juniorPkg);
      return;
    }
    onNavigateS4?.('junior');
  };

  const handleLaunchSeniorTree = () => {
    if (!isPhase2Active) {
      if (onShowToast) onShowToast('Senior Node ($25) unlocks in Phase 2 community launch', 'warning');
      return;
    }
    if (!isSeniorActive) {
      if (onShowToast) onShowToast('Please activate Senior Node ($25) to access its matrix tree', 'warning');
      onOpenPackageModal(seniorPkg);
      return;
    }
    onNavigateS4?.('senior');
  };

  const handleLaunchQuantumTree = () => {
    if (!isPhase3Active) {
      if (onShowToast) onShowToast('Quantum Node ($70) unlocks in Phase 3 community launch', 'warning');
      return;
    }
    if (!isQuantumActive) {
      if (onShowToast) onShowToast('Please activate Quantum Node ($70) to access its concentric matrix', 'warning');
      onOpenPackageModal(quantumPkg);
      return;
    }
    if (onNavigateQuantum) onNavigateQuantum();
  };

  const handleLaunchNexusPrimeTree = () => {
    if (!isPhase3Active) {
      if (onShowToast) onShowToast('Nexus Prime ($120) unlocks in Phase 3 community launch', 'warning');
      return;
    }
    if (!isNexusPrimeActive) {
      if (onShowToast) onShowToast('Please activate Nexus Prime Node ($120) to access its prime matrix', 'warning');
      onOpenPackageModal(nexusPrimePkg);
      return;
    }
    if (onNavigateNexusPrime) onNavigateNexusPrime();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-28 lg:pb-12">
      {/* ======================================================== */}
      {/* 1. EXISTING PAGE HEADER */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-850">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">
              MDeFi Matrix Protocol
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-mono font-bold">
              Fixed Sequence Nodes
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-emerald-400" />
            <span>Active & Available Packages</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl font-sans">
            Four independent smart contract node tiers arranged in exact sequence ($10 Junior → $25 Senior → $70 Quantum → $120 Nexus Prime). Each node functions under its dedicated matrix mechanics with isolated cycle ledgers.
          </p>
        </div>

        {/* Tree Access Matrix Shortcuts (Guarded by Activation State) */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onNavigateS4 && (
            <button
              onClick={isJuniorActive ? handleLaunchJuniorTree : isSeniorActive ? handleLaunchSeniorTree : () => onOpenPackageModal(juniorPkg)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isJuniorActive || isSeniorActive
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60'
                  : 'bg-zinc-950 text-zinc-500 border border-zinc-800/80 hover:border-zinc-700'
              }`}
              title={isJuniorActive || isSeniorActive ? 'Open S4 Binary Hub' : 'S4 Hub (Activation Required)'}
            >
              {isJuniorActive || isSeniorActive ? (
                <Network className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
              )}
              <span>S4 Hub ($10/$25)</span>
            </button>
          )}

          <button
            onClick={handleLaunchQuantumTree}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isQuantumActive
                ? 'bg-zinc-900 hover:bg-zinc-800 text-teal-300 border border-teal-500/30 hover:border-teal-500/60'
                : 'bg-zinc-950 text-zinc-500 border border-zinc-800/80 hover:border-zinc-700'
            }`}
            title={isQuantumActive ? 'Open Quantum X6 Matrix' : 'Quantum X6 (Activation Required)'}
          >
            {isQuantumActive ? (
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
            )}
            <span>Quantum X6 ($70)</span>
          </button>

          <button
            onClick={handleLaunchNexusPrimeTree}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isNexusPrimeActive
                ? 'bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60'
                : 'bg-zinc-950 text-zinc-500 border border-zinc-800/80 hover:border-zinc-700'
            }`}
            title={isNexusPrimeActive ? 'Open Nexus Prime X6 Matrix' : 'Nexus Prime (Activation Required)'}
          >
            {isNexusPrimeActive ? (
              <Coins className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
            )}
            <span>Nexus Prime ($120)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FOUR PACKAGE CARDS IN EXACT SEQUENCE */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

        {/* -------------------------------------------------------- */}
        {/* CARD 1: $10 JUNIOR NODE (POSITION 1 - S4 MATRIX) */}
        {/* -------------------------------------------------------- */}
        <div 
          className={`rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#0a1911] via-[#07130d] to-[#040806] border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-2xl group relative ${
            isJuniorActive 
              ? 'border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.18)] hover:shadow-[0_0_50px_rgba(16,185,129,0.28)]' 
              : 'border-zinc-800/80 hover:border-emerald-500/40 shadow-lg'
          }`}
        >
          {/* Subtle Light Sweep Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-light-sweep" />
          </div>

          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Status Header & AI Human Character */}
            <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-zinc-850">
              {!isPhase2Active ? (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-extrabold uppercase tracking-wide text-amber-400">
                    STATUS: 🔒 PHASE 2 LOCKED
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Unlocks in Phase 2</span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className={`w-2 h-2 rounded-full ${isJuniorActive ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]' : 'bg-zinc-500'}`} />
                  <span className={`font-extrabold uppercase tracking-wide ${isJuniorActive ? 'text-emerald-400' : 'text-zinc-400'}`}>
                    STATUS: {isJuniorActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                    <Network className="w-3 h-3 text-emerald-400" />
                    <span>S4 Matrix</span>
                  </span>
                </div>
              )}

              {/* AI Human Guardian Character (Aria - Junior Sentinel) */}
              <div className="shrink-0">
                <AiHumanCharacter variant="junior" mode="card-badge" size={56} />
              </div>
            </div>

            {/* Title & Price */}
            <div className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    2 LVL FAST-CYCLING 2X2 COMMUNITY NODE WITH DIRECT AND SPILLOVER PLACEMENT
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                    Junior Node
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    Mode: S4 Matrix &bull; 2x2 Binary (6 Slots)
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    $10.00
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono block font-bold">
                    USDt / Package
                  </span>
                </div>
              </div>

              {/* Fixed Plan Income Breakdown */}
              <div className="mt-5 space-y-2 font-mono text-xs">
                {/* Direct Income */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400">Direct Income:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      $4.00
                    </span>
                    <span className="text-[11px] text-emerald-400/80 font-bold">(40%)</span>
                  </div>
                </div>

                {/* Matrix Income */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400">Matrix Income:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      $12.00
                    </span>
                    <span className="text-[11px] text-emerald-400/80 font-bold">(300%)</span>
                  </div>
                </div>

                {/* Recycle Income & Auto Re-entry */}
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-rose-950/40 via-red-950/30 to-black/60 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-rose-200 font-bold">Recycle Income:</span>
                    <span className="text-xs text-rose-300 font-extrabold ml-1">→ Upline 40%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-500/50">
                      Auto Re-entry: At Slot #6
                    </span>
                    <span className="text-[9px] text-rose-300/80 block mt-0.5">
                      Automated 100% Re-entry Basis
                    </span>
                  </div>
                </div>

                {/* Total Per Complete Matrix */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-zinc-300 font-semibold">Total Per Complete Matrix:</span>
                  <span className="text-xs font-black text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    $12.00 USDt
                  </span>
                </div>

                {/* Bottom Dynamic User Statistics */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Recycle Count</span>
                    <span className="text-xs font-extrabold text-rose-400">{juniorNodeData.recycleCount} Completed</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Matrix Capacity</span>
                    <span className="text-xs font-extrabold text-emerald-400">{juniorNodeData.filledPositions}/6 Filled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Action Footer */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            <S4AiGuide 
              packageName="Junior Node" 
              size="sm"
              onClick={handleLaunchJuniorTree}
            />
            {!isPhase2Active ? (
              <button
                disabled
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-zinc-900/90 border border-amber-500/30 text-amber-300 font-extrabold text-xs font-mono flex items-center justify-center gap-2 cursor-not-allowed opacity-90 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>UNLOCKS IN PHASE 2</span>
              </button>
            ) : isJuniorActive ? (
              <button
                onClick={handleLaunchJuniorTree}
                className="web3-btn-primary w-full sm:w-auto py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <span>VIEW JUNIOR MATRIX</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => onOpenPackageModal(juniorPkg)}
                className="web3-btn-primary w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.35)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ACTIVATE JUNIOR NODE</span>
              </button>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* CARD 2: $25 SENIOR NODE (POSITION 2 - S4 MATRIX) */}
        {/* -------------------------------------------------------- */}
        <div 
          className={`rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#091515] via-[#061011] to-[#040808] border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-2xl group relative ${
            isSeniorActive 
              ? 'border-teal-500/50 shadow-[0_0_35px_rgba(20,184,166,0.18)] hover:shadow-[0_0_50px_rgba(20,184,166,0.28)]' 
              : 'border-zinc-800/80 hover:border-teal-500/40 shadow-lg'
          }`}
        >
          {/* Subtle Light Sweep Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-teal-500/10 to-transparent animate-light-sweep" />
          </div>

          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Status Header & AI Human Character */}
            <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-zinc-850">
              {!isPhase2Active ? (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-extrabold uppercase tracking-wide text-amber-400">
                    STATUS: 🔒 PHASE 2 LOCKED
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Unlocks in Phase 2</span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className={`w-2 h-2 rounded-full ${isSeniorActive ? 'bg-teal-400 animate-pulse shadow-[0_0_8px_#2dd4bf]' : 'bg-zinc-500'}`} />
                  <span className={`font-extrabold uppercase tracking-wide ${isSeniorActive ? 'text-teal-400' : 'text-zinc-400'}`}>
                    STATUS: {isSeniorActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-500/30 flex items-center gap-1 font-bold">
                    <Cpu className="w-3 h-3 text-teal-400" />
                    <span>S4 Matrix</span>
                  </span>
                </div>
              )}

              {/* AI Human Guardian Character (Kaelen - Senior Architect) */}
              <div className="shrink-0">
                <AiHumanCharacter variant="senior" mode="card-badge" size={56} />
              </div>
            </div>

            {/* Title & Price */}
            <div className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider block mb-1">
                    HIGH-LEVEL S4 MATRIX PACKAGE WITH DIRECT, SPILLOVER AND RECYCLE/RE-ENTRY TRACKING
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                    Senior Node
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    Mode: S4 Matrix &bull; 2x2 Binary (6 Slots)
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    $25.00
                  </span>
                  <span className="text-[10px] text-teal-400 font-mono block font-bold">
                    USDt / Package
                  </span>
                </div>
              </div>

              {/* Fixed Plan Income Breakdown */}
              <div className="mt-5 space-y-2 font-mono text-xs">
                {/* Direct Income */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400">Direct Income:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-teal-300 bg-teal-950/70 px-2 py-0.5 rounded-md border border-teal-500/30">
                      $8.00
                    </span>
                    <span className="text-[11px] text-teal-400/80 font-bold">(32%)</span>
                  </div>
                </div>

                {/* Matrix Income */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400">Matrix Income:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-teal-300 bg-teal-950/70 px-2 py-0.5 rounded-md border border-teal-500/30">
                      $24.00
                    </span>
                    <span className="text-[11px] text-teal-400/80 font-bold">(300%)</span>
                  </div>
                </div>

                {/* Recycle Income & Auto Re-entry */}
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-rose-950/40 via-red-950/30 to-black/60 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-rose-200 font-bold">Recycle Income</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-500/50">
                      Auto Re-entry: At Slot #6
                    </span>
                    <span className="text-[9px] text-rose-300/80 block mt-0.5">
                      Automated 100% Re-entry Basis
                    </span>
                  </div>
                </div>

                {/* Total Per Complete Matrix */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-teal-500/30 flex items-center justify-between">
                  <span className="text-zinc-300 font-semibold">Total Per Complete Matrix:</span>
                  <span className="text-xs font-black text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-500/30">
                    $24.00 USDt
                  </span>
                </div>

                {/* Special Benefit Text: Exclusive to Senior */}
                <div className="p-2.5 rounded-xl bg-teal-950/50 border border-teal-500/40 flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="text-xs font-extrabold text-teal-300 uppercase tracking-wide">
                    UNLIMITED WEEKLY REWARD EVERY WEEK
                  </span>
                </div>

                {/* Bottom Dynamic User Statistics */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Recycle Count</span>
                    <span className="text-xs font-extrabold text-rose-400">{seniorNodeData.recycleCount} Completed</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Matrix Capacity</span>
                    <span className="text-xs font-extrabold text-teal-300">{seniorNodeData.filledPositions}/6 Filled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Action Footer */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            <S4AiGuide 
              packageName="Senior Node" 
              size="sm"
              onClick={handleLaunchSeniorTree}
            />
            {!isPhase2Active ? (
              <button
                disabled
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-zinc-900/90 border border-amber-500/30 text-amber-300 font-extrabold text-xs font-mono flex items-center justify-center gap-2 cursor-not-allowed opacity-90 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>UNLOCKS IN PHASE 2</span>
              </button>
            ) : isSeniorActive ? (
              <button
                onClick={handleLaunchSeniorTree}
                className="web3-btn-primary w-full sm:w-auto py-2.5 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(20,184,166,0.3)]"
              >
                <span>VIEW SENIOR MATRIX</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => onOpenPackageModal(seniorPkg)}
                className="web3-btn-primary w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black font-extrabold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(20,184,166,0.35)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ACTIVATE SENIOR NODE</span>
              </button>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* CARD 3: $70 QUANTUM NODE (POSITION 3 - QUANTUM X6 MATRIX) */}
        {/* -------------------------------------------------------- */}
        <div 
          className={`rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#091a12] via-[#06120c] to-[#030806] border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-2xl group relative ${
            isQuantumActive 
              ? 'border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.18)] hover:shadow-[0_0_55px_rgba(16,185,129,0.3)]' 
              : 'border-zinc-800/80 hover:border-emerald-500/40 shadow-lg'
          }`}
        >
          {/* Subtle Light Sweep Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-light-sweep" />
          </div>

          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Status Header & AI Human Character */}
            <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-zinc-850">
              {!isPhase3Active ? (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-extrabold uppercase tracking-wide text-amber-400">
                    STATUS: 🔒 PHASE 3 LOCKED
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Unlocks in Phase 3</span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className={`w-2 h-2 rounded-full ${isQuantumActive ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]' : 'bg-zinc-500'}`} />
                  <span className={`font-extrabold uppercase tracking-wide ${isQuantumActive ? 'text-emerald-400' : 'text-zinc-400'}`}>
                    STATUS: {isQuantumActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                    <Orbit className="w-3 h-3 text-emerald-400" />
                    <span>Package ID: 3 &bull; 11_test_nexus</span>
                  </span>
                </div>
              )}

              {/* AI Human Guardian Character (Lyra - Quantum Specialist) */}
              <div className="shrink-0">
                <AiHumanCharacter variant="quantum" mode="card-badge" size={56} />
              </div>
            </div>

            {/* Title & Price */}
            <div className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    CONCENTRIC RADIAL MATRIX 30 POSITIONS / 4-RING MATRIX
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                    Quantum Node
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    Rings: 2 &bull; 4 &bull; 8 &bull; 16 Slots &bull; Cycle #{quantumNodeStats.currentMatrixNumber}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    $70.00
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono block font-bold">
                    USDt / Package
                  </span>
                </div>
              </div>

              {/* Income Breakdown */}
              <div className="mt-5 space-y-2 font-mono text-xs">
                {/* Direct Member Reward */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400">Direct Member Reward:</span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    $12.00
                  </span>
                </div>

                {/* Matrix Tier Reward */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400">Matrix Tier Reward:</span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    $265.20 (1120%)
                  </span>
                </div>

                {/* SPECIAL QUANTUM BENEFITS (EXCLUSIVE TO QUANTUM $70) */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-teal-950/40 to-zinc-950/80 border border-emerald-500/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold pb-1 border-b border-emerald-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SPECIAL QUANTUM BENEFITS:</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-0.5">
                    <span className="text-zinc-300 flex items-center gap-1">
                      <Gift className="w-3 h-3 text-emerald-400" />
                      <strong>Magic Cashback:</strong>
                    </span>
                    <span className="text-emerald-300 font-extrabold bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      $15 for every 2 Direct Partners
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-400">Generation Passive Yields:</span>
                    <span className="text-zinc-200 font-bold">10 Levels</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-400">Weekly Reward:</span>
                    <span className="text-teal-300 font-bold">Unlimited Weekly Reward</span>
                  </div>
                </div>

                {/* Recycle Auto Re-entry */}
                <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-rose-200 font-bold">Recycle Auto Re-entry:</span>
                  </div>
                  <span className="text-xs font-extrabold text-rose-300">
                    {quantumNodeStats.recycleCount} Recycles Completed
                  </span>
                </div>

                {/* Bottom Dynamic Statistics */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Cycle Counter</span>
                    <span className="text-sm font-black text-rose-400">
                      Cycle #{quantumNodeStats.currentMatrixNumber}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Matrix Completion</span>
                    <span className="text-sm font-black text-emerald-400">
                      {quantumNodeStats.filledPositions}/30 ({quantumNodeStats.completionPercentage}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Action Footer */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Concentric 30-Slot Ledger</span>
            </span>
            {!isPhase3Active ? (
              <button
                disabled
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-zinc-900/90 border border-amber-500/30 text-amber-300 font-extrabold text-xs font-mono flex items-center justify-center gap-2 cursor-not-allowed opacity-90 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>UNLOCKS IN PHASE 3</span>
              </button>
            ) : isQuantumActive ? (
              <button
                onClick={handleLaunchQuantumTree}
                className="web3-btn-primary w-full sm:w-auto py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <span>OPEN QUANTUM MATRIX</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => onOpenPackageModal(quantumPkg)}
                className="web3-btn-primary w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.35)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ACTIVATE QUANTUM NODE</span>
              </button>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* CARD 4: $120 NEXUS PRIME NODE (POSITION 4 - HIGHEST TIER) */}
        {/* -------------------------------------------------------- */}
        <div 
          className={`rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#0b161c] via-[#071116] to-[#03080b] border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-2xl group relative ${
            isNexusPrimeActive 
              ? 'border-cyan-400/60 shadow-[0_0_40px_rgba(6,182,212,0.22)] hover:shadow-[0_0_60px_rgba(6,182,212,0.35)]' 
              : 'border-zinc-800/80 hover:border-cyan-500/50 shadow-lg'
          }`}
        >
          {/* Subtle Light Sweep Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent animate-light-sweep" />
          </div>

          {/* Ambient Prime Glow */}
          <div className="absolute top-0 right-0 w-52 h-52 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Status Header & AI Human Character */}
            <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-zinc-850">
              {!isPhase3Active ? (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-extrabold uppercase tracking-wide text-amber-400">
                    STATUS: 🔒 PHASE 3 LOCKED
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Unlocks in Phase 3</span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className={`w-2 h-2 rounded-full ${isNexusPrimeActive ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]' : 'bg-zinc-500'}`} />
                  <span className={`font-extrabold uppercase tracking-wide ${isNexusPrimeActive ? 'text-cyan-400' : 'text-zinc-400'}`}>
                    STATUS: {isNexusPrimeActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-bold">
                    <Crown className="w-3 h-3 text-cyan-400" />
                    <span>Package ID: 4 &bull; 11_test_nexus</span>
                  </span>
                </div>
              )}

              {/* AI Human Guardian Character (Zephyr - Nexus Prime Overseer) */}
              <div className="shrink-0">
                <AiHumanCharacter variant="nexus" mode="card-badge" size={56} />
              </div>
            </div>

            {/* Title & Price */}
            <div className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                    CONCENTRIC RADIAL MATRIX 30 POSITIONS / 4-RING MATRIX
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono flex items-center gap-2">
                    <span>Nexus Prime Node</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-[10px] text-cyan-300 font-bold uppercase tracking-normal">
                      Supreme Tier
                    </span>
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    Rings: 2 &bull; 4 &bull; 8 &bull; 16 Slots &bull; Cycle #{nexusPrimeStats.currentMatrixNumber}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    $120.00
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono block font-bold">
                    USDt / Package
                  </span>
                </div>
              </div>

              {/* Income Breakdown */}
              <div className="mt-5 space-y-2 font-mono text-xs">
                {/* Direct Member Reward */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400">Direct Member Reward:</span>
                  <span className="text-xs font-black text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded-md border border-cyan-500/30">
                    $15.00
                  </span>
                </div>

                {/* Matrix Tier Reward */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-400">Matrix Tier Reward:</span>
                  <span className="text-xs font-black text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded-md border border-cyan-500/30">
                    $306.00 (1120%)
                  </span>
                </div>

                {/* SPECIAL NEXUS PRIME BENEFITS (EXCLUSIVE TO NEXUS PRIME $120 - NO MAGIC CASHBACK) */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-teal-950/40 to-zinc-950/80 border border-cyan-500/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold pb-1 border-b border-cyan-500/20">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SPECIAL NEXUS PRIME BENEFITS:</span>
                  </div>
                  <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center gap-2">
                    <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs font-black text-cyan-200 uppercase tracking-wide">
                      UNLIMITED WEEKLY SELLERY EVERY WEEK
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-300 font-bold">11 LEVELS UNLIMITED GENERATION YIELDS</span>
                    <span className="text-cyan-400 font-black">ACTIVE</span>
                  </div>
                </div>

                {/* Recycle Auto Re-entry */}
                <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-rose-200 font-bold">Recycle Auto Re-entry:</span>
                  </div>
                  <span className="text-xs font-extrabold text-rose-300">
                    {nexusPrimeStats.recycleCount} Recycles Completed
                  </span>
                </div>

                {/* Bottom Dynamic Statistics */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Cycle Counter</span>
                    <span className="text-sm font-black text-rose-400">
                      Cycle #{nexusPrimeStats.currentMatrixNumber}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Matrix Completion</span>
                    <span className="text-sm font-black text-cyan-300">
                      {nexusPrimeStats.filledPositions}/30 ({nexusPrimeStats.completionPercentage}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Action Footer */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Highest Yield Tier</span>
            </span>
            {!isPhase3Active ? (
              <button
                disabled
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-zinc-900/90 border border-amber-500/30 text-amber-300 font-extrabold text-xs font-mono flex items-center justify-center gap-2 cursor-not-allowed opacity-90 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>UNLOCKS IN PHASE 3</span>
              </button>
            ) : isNexusPrimeActive ? (
              <button
                onClick={handleLaunchNexusPrimeTree}
                className="web3-btn-primary w-full sm:w-auto py-2.5 px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.35)]"
              >
                <span>OPEN NEXUS PRIME MATRIX</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => onOpenPackageModal(nexusPrimePkg)}
                className="web3-btn-primary w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-extrabold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ACTIVATE NEXUS PRIME</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Protocol Architecture Note & Testing Switcher */}
      <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-zinc-200">MDeFi Web3 Node Architecture:</strong>
            <p className="mt-0.5 leading-relaxed text-zinc-400">
              Activating any node calls the smart contract method, executes on the connected BSC wallet, and syncs on-chain matrix placement upon blockchain confirmation.
            </p>
          </div>
        </div>
        {onResetPackages && (
          <button
            onClick={onResetPackages}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-500/40 text-[11px] font-mono transition-colors cursor-pointer"
            title="Reset package activations for testing"
          >
            Reset Packages for Testing
          </button>
        )}
      </div>
    </div>
  );
};
