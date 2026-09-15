import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  TrendingUp, 
  Coins, 
  Info, 
  CheckCircle2, 
  Globe,
  ExternalLink
} from 'lucide-react';
import { UserProfile, RewardBalances, NavPage } from '../types';
import { calculateEcosystemIncome, calculateTotalEcosystemIncome } from '../data/incomeData';
import { IncomeCategoryItem } from '../types/income';
import { IncomeCosmicIcon } from '../components/income/IncomeCosmicIcon';
import { AnimatedCounter } from '../components/income/AnimatedCounter';
import { AnimatedDollarCoin } from '../components/common/AnimatedDollarCoin';

interface IncomeViewProps {
  user: UserProfile;
  rewards: RewardBalances;
  onOpenClaimModal?: (type: 'Registration' | 'Referral' | 'Package') => void;
  onNavigate?: (page: NavPage) => void;
  onNavigateS4?: (pkg?: 'junior' | 'senior') => void;
  onNavigateQuantum?: () => void;
  onNavigateNexusPrime?: () => void;
}

export const IncomeView: React.FC<IncomeViewProps> = ({
  user,
  rewards,
  onOpenClaimModal,
  onNavigate,
  onNavigateS4,
  onNavigateQuantum,
  onNavigateNexusPrime,
}) => {
  // Dynamically compute the exact 12 categories based on live ledger & contract state
  const incomeCards = useMemo(() => {
    return calculateEcosystemIncome(user, rewards);
  }, [user, rewards]);

  // Total Lifetime Ecosystem Income (in USDT) across all 12 valid categories
  const totalLifetimeIncome = useMemo(() => {
    return calculateTotalEcosystemIncome(incomeCards);
  }, [incomeCards]);

  // Selected card for tooltip modal / info inspection
  const [selectedCard, setSelectedCard] = useState<IncomeCategoryItem | null>(null);

  // Available claimable amount for protocol actions
  const totalClaimableUsdt = useMemo(() => {
    return (rewards.referralClaimable + rewards.packageClaimable) * (rewards.demoUsdRate || 1.5);
  }, [rewards]);

  // Handle direct navigation to existing functions/dashboards
  const handleCardNavigation = (action: IncomeCategoryItem['viewAction']) => {
    switch (action) {
      case 's4_direct':
        if (onNavigateS4) onNavigateS4('junior');
        else onNavigate?.('s4-matrix');
        break;
      case 's4_junior':
        if (onNavigateS4) onNavigateS4('junior');
        else onNavigate?.('s4-matrix');
        break;
      case 's4_senior':
        if (onNavigateS4) onNavigateS4('senior');
        else onNavigate?.('s4-matrix');
        break;
      case 'quantum_direct':
      case 'quantum_matrix':
        if (onNavigateQuantum) onNavigateQuantum();
        else onNavigate?.('quantum-nexus');
        break;
      case 'magic_cashback_bonus':
        onNavigate?.('packages');
        break;
      case 'nexus_direct':
      case 'nexus_generation':
        if (onNavigateNexusPrime) onNavigateNexusPrime();
        else onNavigate?.('nexus-prime');
        break;
      case 'magic_generation_pool':
        onNavigate?.('team');
        break;
      case 'weekly_starter':
        onNavigate?.('weekly_reward_starter');
        break;
      case 'weekly_premium':
        onNavigate?.('weekly_reward_premium');
        break;
      case 'weekly_salary':
        onNavigate?.('weekly_passive_salary');
        break;
      default:
        onNavigate?.('overview');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-28 lg:pb-16 max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono tracking-widest text-emerald-400 font-bold uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping motion-reduce:animate-none" />
              MDefi Protocol Yield Engine
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
              Live Yield Ledger
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Income
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Lifetime earnings breakdown across the MDefi ecosystem
          </p>
        </div>

        {/* Global Security & Protocol Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2 text-xs font-mono text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Vault: Verified Multi-Contract</span>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Hero Glass Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1611]/90 via-[#07110c]/85 to-[#040806]/95 border border-emerald-500/35 p-6 sm:p-9 shadow-[0_0_50px_rgba(16,185,129,0.12)] overflow-hidden backdrop-blur-2xl group">
        {/* Subtle AI Space Cosmic Orbital Particles Effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-emerald-500/20 transition-all duration-700" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mb-20" />
        
        {/* Background orbital particles SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15%" cy="25%" r="1.5" className="fill-emerald-300 animate-pulse" />
          <circle cx="45%" cy="75%" r="1" className="fill-cyan-300 animate-ping motion-reduce:animate-none" style={{ animationDuration: '4s' }} />
          <circle cx="85%" cy="30%" r="2" className="fill-emerald-400 opacity-60" />
          <circle cx="70%" cy="80%" r="1.5" className="fill-cyan-400 opacity-40 animate-pulse" />
          <ellipse cx="85%" cy="50%" rx="120" ry="40" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="1" strokeDasharray="4 6" transform="rotate(-15 85 50)" />
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Main Lifetime Summary Metric */}
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TOTAL OF ALL VALID INCOME SOURCES</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Lifetime Ecosystem Income
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Total lifetime income earned across all MDefi reward systems.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <AnimatedDollarCoin size="xl" />
              <span className="text-4xl sm:text-6xl font-black text-white font-mono tracking-tight drop-shadow-[0_0_24px_rgba(255,255,255,0.15)]">
                <AnimatedCounter value={totalLifetimeIncome} duration={1200} />
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-emerald-300">
                12 Categories Active
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-400">
                100% On-Chain Settled
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-400">
                Account: {user.userId}
              </span>
            </div>
          </div>

          {/* Right Status / Protocol Fast Stats */}
          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto min-w-[280px]">
            <div className="p-4 rounded-2xl bg-[#080e0a]/80 border border-emerald-500/20 backdrop-blur-md">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Ecosystem Yield
              </span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                12 Streams
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Fully Synced
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#080e0a]/80 border border-cyan-500/20 backdrop-blur-md">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Settlement
              </span>
              <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono flex items-center gap-1.5">
                <AnimatedDollarCoin size="sm" />
                <span>Yields</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 mt-1">
                <Globe className="w-3 h-3" /> Universal Peg
              </span>
            </div>

            {/* Optional Claim Portal Link if claimable rewards exist */}
            {onOpenClaimModal && (
              <div className="col-span-2 p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <div className="text-zinc-300 font-medium">Available Unclaimed Yields</div>
                  <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <span>{rewards.referralClaimable + rewards.packageClaimable} MBTTC (≈</span>
                    <AnimatedDollarCoin size="xs" />
                    <span>{totalClaimableUsdt.toFixed(2)})</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenClaimModal('Referral')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono transition-all shadow-[0_0_12px_rgba(16,185,129,0.25)] hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
                >
                  Claim Portal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Section Title Divider */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Lifetime Income Breakdown (12 Categories)
          </h2>
        </div>
        <span className="text-xs text-zinc-500 font-mono hidden sm:inline-block">
          Verified Protocol Yield Ledger
        </span>
      </div>

      {/* 4. Responsive 2-Column Premium Grid for the 12 Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {incomeCards.map((card) => {
          return (
            <div
              key={card.id}
              id={`income-card-${card.id}`}
              className="relative rounded-3xl p-6 sm:p-7 transition-all duration-300 backdrop-blur-xl group overflow-hidden border bg-[#080d0a]/90 hover:bg-[#0c1410]/95 border-zinc-800/80 hover:border-emerald-500/40 shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.12)] hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Subtle Ambient Color Glow in corner */}
              <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 bg-emerald-500/10 group-hover:bg-emerald-500/15" />

              <div>
                {/* Card Top: Left (Cosmic Icon + Category Badge + Title) & Right (Small Information Icon) */}
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    {/* Premium Web3 Cosmic Animated Icon Container */}
                    <IncomeCosmicIcon
                      iconType={card.iconType}
                      accentColor={card.accentColor}
                    />

                    <div>
                      <span className="text-[10px] sm:text-xs font-mono px-2.5 py-0.5 rounded-full bg-zinc-900/90 text-zinc-400 border border-zinc-800/90 inline-block mb-1 font-semibold">
                        {card.badge}
                      </span>
                      <h3 className="font-bold tracking-tight text-white transition-colors text-base sm:text-lg group-hover:text-emerald-100">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  {/* Small Information Icon */}
                  <button
                    type="button"
                    id={`btn-info-${card.id}`}
                    onClick={() => setSelectedCard(card)}
                    title="View category details and verification specs"
                    className="p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-400 hover:text-emerald-300 transition-colors shrink-0 cursor-pointer"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Middle: Description */}
                <div className="mt-3.5 relative z-10">
                  <p className="leading-relaxed text-xs sm:text-sm text-zinc-400">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Card Bottom: Label, Live Contract Value, Currency, Status, and VIEW Button */}
              <div className="mt-6 pt-4 border-t border-zinc-850/80 relative z-10 flex items-end justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                    LIFETIME EARNED FUNDS
                  </span>
                  <div className="flex items-center gap-2">
                    <AnimatedDollarCoin size="md" />
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                      <AnimatedCounter value={card.lifetimeAmountUsdt} duration={1000} />
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/25 text-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Premium Compact Glowing VIEW Button (Position: bottom-right of every card) */}
                <button
                  type="button"
                  id={`btn-view-${card.id}`}
                  onClick={() => handleCardNavigation(card.viewAction)}
                  className="relative overflow-hidden group/btn px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/25 to-cyan-500/20 hover:from-emerald-500/35 hover:via-emerald-500/40 hover:to-cyan-500/35 border border-emerald-500/40 hover:border-emerald-300 text-emerald-300 hover:text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_22px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 active:translate-y-0 shrink-0 min-h-[40px] cursor-pointer"
                  title={card.viewActionLabel || `View ${card.title}`}
                >
                  <span className="relative z-10 font-bold tracking-wider">VIEW</span>
                  <ArrowRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1 text-emerald-400 group-hover/btn:text-white" />
                  {/* Subtle light sweep animation on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Detailed Category Modal / Tooltip Drawer */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0"
            onClick={() => setSelectedCard(null)}
          />
          <div className="relative bg-[#09100c] border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.2)] z-10 space-y-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <IncomeCosmicIcon
                  iconType={selectedCard.iconType}
                  accentColor={selectedCard.accentColor}
                />
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">{selectedCard.badge}</span>
                  <h4 className="text-lg font-bold text-white tracking-tight">{selectedCard.title}</h4>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed font-sans">
              <p>{selectedCard.description}</p>
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-850 space-y-2 font-mono">
                <div className="flex justify-between text-zinc-400 items-center">
                  <span>Currency Benchmark:</span>
                  <span className="text-white font-bold inline-flex items-center gap-1.5">
                    <AnimatedDollarCoin size="xs" /> Dollar Pegged
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400 items-center">
                  <span>Lifetime Total:</span>
                  <span className="text-emerald-400 font-bold inline-flex items-center gap-1.5">
                    <AnimatedDollarCoin size="xs" />
                    <span>{selectedCard.lifetimeAmountUsdt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Target Destination:</span>
                  <span className="text-cyan-300 font-semibold">{selectedCard.viewActionLabel}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Protocol Verification:</span>
                  <span className="text-emerald-300">Verified On-Chain</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const action = selectedCard.viewAction;
                  setSelectedCard(null);
                  handleCardNavigation(action);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>OPEN DASHBOARD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs border border-zinc-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Footer Protocol Note */}
      <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-850/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5 text-xs text-zinc-400 font-mono">
          <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>MDefi Ecosystem Income Ledger • All distributions settled in verified protocol vaults</span>
        </div>
        <div className="text-[11px] font-mono text-zinc-500">
          Smart Contract Protocol v1.4
        </div>
      </div>
    </div>
  );
};
