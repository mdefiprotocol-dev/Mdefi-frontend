import React from 'react';
import { 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Network, 
  Coins, 
  Lock, 
  Zap, 
  Crown, 
  Orbit, 
  Gift, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { PackageItem } from '../types';
import { AiHumanCharacter } from '../components/AiHumanCharacter';
import { programPhaseService } from '../services/programPhaseService';
import { Rotating3DUsdtCoin } from '../components/common/Rotating3DUsdtCoin';

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
  const juniorPkg: PackageItem = (packages.find(p => p.id === 'pkg-junior') as PackageItem) || {
    id: 'pkg-junior',
    name: 'Junior Node',
    priceUSDT: 10,
    status: 'Available',
    activationDate: 'Not Activated',
    version: 'v1.0 (S4)',
    rewardStatus: 'Standby',
    dailyRewardEstimate: '4.00 (40%) Direct + 12.00 (300%) Matrix USDT',
    maxReturn: '2x2 Binary Matrix (6 Slots)',
    features: ['2x2 Fast-Cycling Matrix', 'Direct & Spillover Placement', 'Continuous Auto-Recycle at Slot #6'],
  };

  const seniorPkg: PackageItem = (packages.find(p => p.id === 'pkg-senior') as PackageItem) || {
    id: 'pkg-senior',
    name: 'Senior Node',
    priceUSDT: 25,
    status: 'Available',
    activationDate: 'Not Activated',
    version: 'v1.0 (S4)',
    rewardStatus: 'Standby',
    dailyRewardEstimate: '8.00 (32%) Direct + 24.00 (300%) Matrix USDT',
    maxReturn: '2x2 Binary Matrix (6 Slots)',
    features: ['Double Matrix Capacity', 'Unlimited Weekly Reward Every Week', 'Continuous Auto-Recycle at Slot #6'],
  };

  const quantumPkg: PackageItem = (packages.find(p => p.id === 'pkg-quantum') as PackageItem) || {
    id: 'pkg-quantum',
    name: 'Quantum Node',
    priceUSDT: 70,
    status: 'Available',
    activationDate: 'Not Activated',
    version: 'v1.0 (11_test_nexus)',
    rewardStatus: 'Standby',
    dailyRewardEstimate: '12.00 Direct + 265.20 Matrix Tier USDT',
    maxReturn: 'Concentric 4-Ring (30 Positions)',
    features: ['Concentric Radial Matrix', '15 USDT Magic Cashback per 2 Directs', '10 Levels Generation Yields'],
  };

  const nexusPrimePkg: PackageItem = (packages.find(p => p.id === 'pkg-nexus-prime') as PackageItem) || {
    id: 'pkg-nexus-prime',
    name: 'Nexus Prime Node',
    priceUSDT: 120,
    status: 'Available',
    activationDate: 'Not Activated',
    version: 'v1.0 (11_test_nexus)',
    rewardStatus: 'Standby',
    dailyRewardEstimate: '15.00 Direct + 306.00 Matrix Tier USDT',
    maxReturn: 'Concentric 4-Ring (30 Positions)',
    features: ['Prime Concentric Matrix', 'Unlimited Weekly Reward Every Week', '11 Levels Generation Yields'],
  };

  const isPhase2Active = programPhaseService.isModuleUnlocked('s4');
  const isPhase3Active = programPhaseService.isModuleUnlocked('quantum_nexus');

  const isJuniorActive = isPhase2Active && juniorPkg.status === 'Active';
  const isSeniorActive = isPhase2Active && seniorPkg.status === 'Active';
  const isQuantumActive = isPhase3Active && quantumPkg.status === 'Active';
  const isNexusPrimeActive = isPhase3Active && nexusPrimePkg.status === 'Active';

  const handleLaunchJuniorTree = () => {
    if (!isPhase2Active) {
      if (onShowToast) onShowToast('Junior Node (10 USDT) unlocks in Phase 2 community launch', 'warning');
      return;
    }
    if (!isJuniorActive) {
      if (onShowToast) onShowToast('Please activate Junior Node (10 USDT) to access matrix tree', 'warning');
      onOpenPackageModal(juniorPkg);
      return;
    }
    onNavigateS4?.('junior');
  };

  const handleLaunchSeniorTree = () => {
    if (!isPhase2Active) {
      if (onShowToast) onShowToast('Senior Node (25 USDT) unlocks in Phase 2 community launch', 'warning');
      return;
    }
    if (!isSeniorActive) {
      if (onShowToast) onShowToast('Please activate Senior Node (25 USDT) to access matrix tree', 'warning');
      onOpenPackageModal(seniorPkg);
      return;
    }
    onNavigateS4?.('senior');
  };

  const handleLaunchQuantumTree = () => {
    if (!isPhase3Active) {
      if (onShowToast) onShowToast('Quantum Node (70 USDT) unlocks in Phase 3 community launch', 'warning');
      return;
    }
    if (!isQuantumActive) {
      if (onShowToast) onShowToast('Please activate Quantum Node (70 USDT) to access concentric matrix', 'warning');
      onOpenPackageModal(quantumPkg);
      return;
    }
    if (onNavigateQuantum) onNavigateQuantum();
  };

  const handleLaunchNexusPrimeTree = () => {
    if (!isPhase3Active) {
      if (onShowToast) onShowToast('Nexus Prime (120 USDT) unlocks in Phase 3 community launch', 'warning');
      return;
    }
    if (!isNexusPrimeActive) {
      if (onShowToast) onShowToast('Please activate Nexus Prime Node (120 USDT) to access prime matrix', 'warning');
      onOpenPackageModal(nexusPrimePkg);
      return;
    }
    if (onNavigateNexusPrime) onNavigateNexusPrime();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-28 lg:pb-12 max-w-7xl mx-auto px-1 sm:px-2">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">
              MDeFi Protocol
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-medium">
              Fixed Sequence Nodes
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400 shrink-0" />
            <span>Active &amp; Available Packages</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Four smart contract node tiers arranged in exact sequence (10 USDT &rarr; 25 USDT &rarr; 70 USDT &rarr; 120 USDT) with isolated cycle ledgers.
          </p>
        </div>

        {/* Header Quick Navigation Pills */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {onNavigateS4 && (
            <button
              onClick={isJuniorActive ? handleLaunchJuniorTree : isSeniorActive ? handleLaunchSeniorTree : () => onOpenPackageModal(juniorPkg)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-emerald-500/40"
            >
              {isJuniorActive || isSeniorActive ? (
                <Network className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
              )}
              <span>S4 Hub (10/25 USDT)</span>
            </button>
          )}

          <button
            onClick={handleLaunchQuantumTree}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-teal-500/40"
          >
            {isQuantumActive ? <Sparkles className="w-3.5 h-3.5 text-teal-400" /> : <Lock className="w-3.5 h-3.5 text-zinc-500" />}
            <span>Quantum (70 USDT)</span>
          </button>

          <button
            onClick={handleLaunchNexusPrimeTree}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-cyan-500/40"
          >
            {isNexusPrimeActive ? <Coins className="w-3.5 h-3.5 text-cyan-400" /> : <Lock className="w-3.5 h-3.5 text-zinc-500" />}
            <span>Nexus Prime (120 USDT)</span>
          </button>
        </div>
      </div>

      {/* 2. FOUR PACKAGE CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* CARD 1: 10 USDT JUNIOR NODE */}
        <div className={`rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-[#0a1811] via-[#07130d] to-[#040906] border transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-xl ${
          isJuniorActive ? 'border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.15)]' : 'border-zinc-800/80 hover:border-emerald-500/40'
        }`}>
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Status Bar & Character */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {isPhase2Active ? (isJuniorActive ? 'Node Active' : 'Node Ready') : 'Phase 2 Node'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-semibold">
                  S4 Binary
                </span>
              </div>
              <div className="shrink-0">
                <AiHumanCharacter variant="junior" mode="card-badge" size={48} />
              </div>
            </div>

            {/* Title & 3D USDT Coin Pricing */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div>
                <span className="text-[11px] font-semibold text-emerald-400/90 tracking-wide uppercase block">
                  Community Matrix Node
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                  Junior Node
                </h3>
                <span className="text-xs text-zinc-400 block mt-0.5">
                  2x2 Fast-Cycling Matrix (6 Slots)
                </span>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 bg-zinc-950/60 border border-zinc-800/80 px-3.5 py-2 rounded-2xl shrink-0">
                <Rotating3DUsdtCoin size={38} glow={false} />
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    10.00
                  </span>
                  <span className="text-[10px] text-emerald-400 block font-bold tracking-wider">
                    USDT
                  </span>
                </div>
              </div>
            </div>

            {/* Rewards Breakdown */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-300 font-medium">Direct Member Reward</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    4.00 USDT
                  </span>
                  <span className="text-emerald-400/80 font-bold">(40%)</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-300 font-medium">Matrix Tier Reward</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    12.00 USDT
                  </span>
                  <span className="text-emerald-400/80 font-bold">(300%)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950/40 border border-emerald-500/20 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Architecture</span>
                <span className="text-emerald-300 font-semibold">Automated Slot #6 Recycle</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-5 border-t border-zinc-800/80 flex items-center justify-between gap-3 relative z-10">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Smart Contract Verified</span>
            </span>

            {!isPhase2Active ? (
              <button
                disabled
                className="py-2.5 px-5 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed opacity-90"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Unlocks in Phase 2</span>
              </button>
            ) : isJuniorActive ? (
              <button
                onClick={handleLaunchJuniorTree}
                className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                <span>View Matrix Tree</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onOpenPackageModal(juniorPkg)}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Activate 10 USDT</span>
              </button>
            )}
          </div>
        </div>

        {/* CARD 2: 25 USDT SENIOR NODE */}
        <div className={`rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-[#091717] via-[#061213] to-[#040909] border transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-xl ${
          isSeniorActive ? 'border-teal-500/50 shadow-[0_0_35px_rgba(20,184,166,0.15)]' : 'border-zinc-800/80 hover:border-teal-500/40'
        }`}>
          <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Status Bar & Character */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  {isPhase2Active ? (isSeniorActive ? 'Node Active' : 'Node Ready') : 'Phase 2 Node'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-950/80 text-teal-300 border border-teal-500/30 font-semibold">
                  S4 Matrix Pro
                </span>
              </div>
              <div className="shrink-0">
                <AiHumanCharacter variant="senior" mode="card-badge" size={48} />
              </div>
            </div>

            {/* Title & 3D USDT Coin Pricing */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div>
                <span className="text-[11px] font-semibold text-teal-400/90 tracking-wide uppercase block">
                  Advanced Matrix Node
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                  Senior Node
                </h3>
                <span className="text-xs text-zinc-400 block mt-0.5">
                  2x2 Binary Matrix (Double Capacity)
                </span>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 bg-zinc-950/60 border border-zinc-800/80 px-3.5 py-2 rounded-2xl shrink-0">
                <Rotating3DUsdtCoin size={38} glow={false} />
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    25.00
                  </span>
                  <span className="text-[10px] text-teal-400 block font-bold tracking-wider">
                    USDT
                  </span>
                </div>
              </div>
            </div>

            {/* Rewards Breakdown */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-300 font-medium">Direct Member Reward</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-500/30">
                    8.00 USDT
                  </span>
                  <span className="text-teal-400/80 font-bold">(32%)</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-300 font-medium">Matrix Tier Reward</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-500/30">
                    24.00 USDT
                  </span>
                  <span className="text-teal-400/80 font-bold">(300%)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-teal-950/50 border border-teal-500/30 flex items-center gap-2 text-teal-300 font-semibold text-[11px]">
                <Award className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Unlimited Weekly Reward Qualification Active</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-5 border-t border-zinc-800/80 flex items-center justify-between gap-3 relative z-10">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Smart Contract Verified</span>
            </span>

            {!isPhase2Active ? (
              <button
                disabled
                className="py-2.5 px-5 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed opacity-90"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Unlocks in Phase 2</span>
              </button>
            ) : isSeniorActive ? (
              <button
                onClick={handleLaunchSeniorTree}
                className="py-2.5 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(20,184,166,0.3)] cursor-pointer"
              >
                <span>View Matrix Tree</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onOpenPackageModal(seniorPkg)}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(20,184,166,0.35)] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Activate 25 USDT</span>
              </button>
            )}
          </div>
        </div>

        {/* CARD 3: 70 USDT QUANTUM NODE */}
        <div className={`rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-[#091a13] via-[#06130e] to-[#030907] border transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-xl ${
          isQuantumActive ? 'border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.15)]' : 'border-zinc-800/80 hover:border-emerald-500/40'
        }`}>
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Status Bar & Character */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {isPhase3Active ? (isQuantumActive ? 'Node Active' : 'Node Ready') : 'Phase 3 Node'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Radial Matrix
                </span>
              </div>
              <div className="shrink-0">
                <AiHumanCharacter variant="quantum" mode="card-badge" size={48} />
              </div>
            </div>

            {/* Title & 3D USDT Coin Pricing */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div>
                <span className="text-[11px] font-semibold text-emerald-400/90 tracking-wide uppercase block">
                  Concentric Radial System
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                  Quantum Node
                </h3>
                <span className="text-xs text-zinc-400 block mt-0.5">
                  30 Positions &bull; 4-Ring Radial Architecture
                </span>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 bg-zinc-950/60 border border-zinc-800/80 px-3.5 py-2 rounded-2xl shrink-0">
                <Rotating3DUsdtCoin size={38} glow={false} />
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    70.00
                  </span>
                  <span className="text-[10px] text-emerald-400 block font-bold tracking-wider">
                    USDT
                  </span>
                </div>
              </div>
            </div>

            {/* Rewards Breakdown */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-300 font-medium">Direct Member Reward</span>
                <span className="font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  12.00 USDT
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-300 font-medium">Matrix Tier Reward</span>
                <span className="font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  265.20 USDT (1120%)
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center text-emerald-300 font-bold pb-1 border-b border-emerald-500/20">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" />
                    Magic Cashback:
                  </span>
                  <span className="bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    15 USDT / 2 Directs
                  </span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Generation Yields:</span>
                  <span className="font-bold text-white">10 Levels</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-5 border-t border-zinc-800/80 flex items-center justify-between gap-3 relative z-10">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Concentric 30-Slot Ledger</span>
            </span>

            {!isPhase3Active ? (
              <button
                disabled
                className="py-2.5 px-5 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed opacity-90"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Unlocks in Phase 3</span>
              </button>
            ) : isQuantumActive ? (
              <button
                onClick={handleLaunchQuantumTree}
                className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                <span>Open Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onOpenPackageModal(quantumPkg)}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Activate 70 USDT</span>
              </button>
            )}
          </div>
        </div>

        {/* CARD 4: 120 USDT NEXUS PRIME NODE */}
        <div className={`rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-[#0b171e] via-[#071217] to-[#03090c] border transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-xl ${
          isNexusPrimeActive ? 'border-cyan-400/60 shadow-[0_0_40px_rgba(6,182,212,0.2)]' : 'border-zinc-800/80 hover:border-cyan-500/50'
        }`}>
          <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Status Bar & Character */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {isPhase3Active ? (isNexusPrimeActive ? 'Node Active' : 'Node Ready') : 'Phase 3 Node'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
                  Apex Supreme
                </span>
              </div>
              <div className="shrink-0">
                <AiHumanCharacter variant="nexus" mode="card-badge" size={48} />
              </div>
            </div>

            {/* Title & 3D USDT Coin Pricing */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div>
                <span className="text-[11px] font-semibold text-cyan-400/90 tracking-wide uppercase block">
                  Supreme Generation Tier
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                  Nexus Prime
                </h3>
                <span className="text-xs text-zinc-400 block mt-0.5">
                  30 Positions &bull; 11 Levels Generation
                </span>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 bg-zinc-950/60 border border-zinc-800/80 px-3.5 py-2 rounded-2xl shrink-0">
                <Rotating3DUsdtCoin size={38} glow={false} />
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    120.00
                  </span>
                  <span className="text-[10px] text-cyan-400 block font-bold tracking-wider">
                    USDT
                  </span>
                </div>
              </div>
            </div>

            {/* Rewards Breakdown */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-300 font-medium">Direct Member Reward</span>
                <span className="font-extrabold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  15.00 USDT
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-300 font-medium">Matrix Tier Reward</span>
                <span className="font-extrabold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                  306.00 USDT (1120%)
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 text-cyan-300 font-bold pb-1 border-b border-cyan-500/20">
                  <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Unlimited Weekly Salary Qualified</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Generation Matrix Yields:</span>
                  <span className="font-bold text-cyan-300">11 Levels Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-5 border-t border-zinc-800/80 flex items-center justify-between gap-3 relative z-10">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Highest Yield Tier</span>
            </span>

            {!isPhase3Active ? (
              <button
                disabled
                className="py-2.5 px-5 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed opacity-90"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Unlocks in Phase 3</span>
              </button>
            ) : isNexusPrimeActive ? (
              <button
                onClick={handleLaunchNexusPrimeTree}
                className="py-2.5 px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer"
              >
                <span>Open Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onOpenPackageModal(nexusPrimePkg)}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Activate 120 USDT</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. ARCHITECTURE PROTOCOL FOOTER */}
      <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-400">
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
            className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-800 hover:border-emerald-500/40 text-[11px] transition-colors cursor-pointer"
            title="Reset package activations for testing"
          >
            Reset Packages for Testing
          </button>
        )}
      </div>
    </div>
  );
};