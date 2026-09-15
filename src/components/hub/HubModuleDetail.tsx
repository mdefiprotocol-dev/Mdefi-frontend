import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  Coins, 
  Flame, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Layers, 
  Users,
  Info,
  Sparkles
} from 'lucide-react';
import { HubModule } from '../../data/hubModulesData';
import { HubAnimatedIcon } from './HubAnimatedIcon';
import { MBTTC_TOKEN_INFO } from '../../data/mbttcTokenInfo';
import { NavPage } from '../../types';
import { HUB_MODULES } from '../../data/hubModulesData';
import { S4NodesDetail } from './s4/S4NodesDetail';
import { MbttcLaunchDetail } from './mbttc/MbttcLaunchDetail';
import { QuantumNexusDetail } from './quantumNexus/QuantumNexusDetail';
import { WeeklySalaryDetail } from './weeklySalary/WeeklySalaryDetail';
import { WeeklyRewardStarterDetail } from './weeklyStarter/WeeklyRewardStarterDetail';
import { WeeklyRewardPremiumDetail } from './weeklyPremium/WeeklyRewardPremiumDetail';
import { useLanguage } from '../../context/LanguageContext';

interface HubModuleDetailProps {
  module: HubModule;
  onBack: () => void;
  onNavigate?: (page: NavPage) => void;
  onNavigateS4?: (pkg?: 'junior' | 'senior') => void;
  onSelectModule?: (module: HubModule) => void;
}

export const HubModuleDetail: React.FC<HubModuleDetailProps> = ({ 
  module, 
  onBack,
  onNavigate,
  onNavigateS4,
  onSelectModule
}) => {
  const { t } = useLanguage();
  const [copiedContract, setCopiedContract] = useState(false);
  const isLive = module.status === 'LIVE NOW';
  const isMbttcAirdrop = module.id === 'mbttc-airdrop';
  const { theme } = module;

  // Render S4 Nodes dedicated educational detail module
  if (module.id === 's4-nodes') {
    return (
      <S4NodesDetail
        onBack={onBack}
        onNavigate={onNavigate}
        onNavigateS4={onNavigateS4}
      />
    );
  }

  // Render MBTTC Token Launch dedicated detail module
  if (module.id === 'mbttc-token-launch') {
    return (
      <MbttcLaunchDetail
        onBack={onBack}
        onNavigate={onNavigate}
      />
    );
  }

  // Render Quantum & Nexus Nodes dedicated educational detail module
  if (module.id === 'quantum-nexus') {
    return (
      <QuantumNexusDetail
        onBack={onBack}
        onNavigate={onNavigate}
      />
    );
  }

  // Render Weekly Salary Passive Income dedicated detail module
  if (module.id === 'weekly-salary') {
    return (
      <WeeklySalaryDetail
        onBack={onBack}
        onNavigate={onNavigate}
      />
    );
  }

  // Render Weekly Reward Starter dedicated educational detail module
  if (module.id === 'weekly-reward-starter') {
    const premiumModule = HUB_MODULES.find((m) => m.id === 'weekly-reward-premium');
    return (
      <WeeklyRewardStarterDetail
        onBack={onBack}
        onNavigate={onNavigate}
        onNavigatePremium={
          onSelectModule && premiumModule
            ? () => onSelectModule(premiumModule)
            : undefined
        }
      />
    );
  }

  // Render Weekly Reward Premium dedicated educational detail module
  if (module.id === 'weekly-reward-premium') {
    const starterModule = HUB_MODULES.find((m) => m.id === 'weekly-reward-starter');
    return (
      <WeeklyRewardPremiumDetail
        onBack={onBack}
        onNavigate={onNavigate}
        onNavigateStarter={
          onSelectModule && starterModule
            ? () => onSelectModule(starterModule)
            : undefined
        }
      />
    );
  }

  const handleCopyContract = () => {
    navigator.clipboard.writeText(MBTTC_TOKEN_INFO.contractAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* ── TOP ACTION: [← Back to MDeFi Hub] ── */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 hover:border-emerald-500/40 text-xs font-mono font-medium transition-all shadow-md group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
          <span>{t('back_to_hub', 'Back to MDeFi Hub')}</span>
        </button>
      </div>

      {/* ── MODULE HERO BANNER ── */}
      <div className={`relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-b ${theme.cardBg} border ${theme.borderBase} shadow-[0_8px_32px_rgba(0,0,0,0.7)]`}>
        {/* Ambient background corner glow */}
        <div 
          aria-hidden="true" 
          className={`pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl ${theme.glowBg}`} 
        />
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" 
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="shrink-0 pt-1">
              <HubAnimatedIcon iconType={module.iconType} size="lg" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* [STATUS] */}
                {isLive ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-extrabold tracking-wider uppercase border bg-emerald-950/90 text-emerald-300 border-emerald-400/60 shadow-[0_0_16px_rgba(16,185,129,0.45)]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    </span>
                    <span>{t('status_live_now', 'LIVE NOW')}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase border bg-zinc-900/80 text-zinc-400 border-zinc-700/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                    <span>{t('status_launching_soon', 'LAUNCHING SOON')}</span>
                  </span>
                )}

                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-400">
                  {t('hub_card_index', { index: module.cardIndex })}
                </span>

                <span className="text-xs font-mono text-zinc-500">
                  {module.accentFamily}
                </span>
              </div>

              {/* MODULE NAME */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-mono">
                {t(`hub_mod_${module.id}_title`, module.title)}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
                {t(`hub_mod_${module.id}_sub`, module.subtitle)}
              </p>
            </div>
          </div>

          {/* If implemented (MBTTC AIRDROP), show shortcut to MBTTC Token Center */}
          {isMbttcAirdrop && onNavigate && (
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('mbttc')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-black font-extrabold text-sm font-mono tracking-wide shadow-[0_0_24px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <Coins className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                <span>{t('open_token_swap', 'Open Token Center & Swap')}</span>
                <ExternalLink className="w-4 h-4 text-black/70 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      {/* ── CONTENT SECTIONS: DATA-DRIVEN ── */}
      {isMbttcAirdrop ? (
        /* =========================================================================
           CARD 01: MBTTC AIRDROP (LIVE NOW — REUSING EXISTING DATA)
           ========================================================================= */
        <div className="space-y-8">
          {/* SECTION 1: Overview */}
          <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/90 p-6 sm:p-8 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/80">
              <Coins className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white font-mono">Overview</h2>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              The MBTTC Airdrop serves as the decentralized community distribution engine for the Magnet Bitcoin Token (MBTTC). Operating natively on the {MBTTC_TOKEN_INFO.blockchain} as a verified {MBTTC_TOKEN_INFO.standard} token contract, MBTTC powers network incentives, governance participation, and multi-tier rewards.
            </p>

            {/* Contract & Architecture Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 font-semibold block">
                  Official MBTTC Contract Address ({MBTTC_TOKEN_INFO.standard})
                </span>
                <span className="text-xs sm:text-sm font-mono text-emerald-300 break-all font-semibold select-all">
                  {MBTTC_TOKEN_INFO.contractAddress}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyContract}
                  className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors border border-zinc-700/70"
                >
                  {copiedContract ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: Key Information */}
          <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/90 p-6 sm:p-8 space-y-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white font-mono">Key Information</h2>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded border border-emerald-500/30">
                1 MBTTC ≈ ${MBTTC_TOKEN_INFO.benchmarkRateUsd.toFixed(2)} USD (Benchmark)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1 font-mono">
                  Circulating Supply
                </span>
                <span className="text-xl font-bold text-white font-mono block">
                  {MBTTC_TOKEN_INFO.telemetry.circulatingSupply}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1 block">Active on-chain float</span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1 font-mono">
                  Total Claimed
                </span>
                <span className="text-xl font-bold text-emerald-400 font-mono block">
                  {MBTTC_TOKEN_INFO.telemetry.totalClaimed}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1 block">Community rewarded</span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1 font-mono">
                  Total Burned
                </span>
                <span className="text-xl font-bold text-amber-400 font-mono block">
                  {MBTTC_TOKEN_INFO.telemetry.totalBurned}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1 block">Deflationary dead address</span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1 font-mono">
                  Pending Rewards
                </span>
                <span className="text-xl font-bold text-zinc-200 font-mono block">
                  {MBTTC_TOKEN_INFO.telemetry.pendingRewards}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1 block">Vault balance pending claim</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: How It Works */}
          <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/90 p-6 sm:p-8 space-y-5 shadow-lg">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/80">
              <Zap className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white font-mono">How It Works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">CHANNEL 01</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">Registration Reward</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Verified accounts receive a one-time registration reward allocation directly credited upon decentralized activation.
                </p>
                <div className="pt-2 text-[11px] font-mono text-zinc-400">
                  Minted to date: <span className="text-white font-bold">{MBTTC_TOKEN_INFO.telemetry.registrationMinted}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">CHANNEL 02</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">Referral Reward</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Frontline partners and network builders earn direct referral commissions per activated member in the ecosystem.
                </p>
                <div className="pt-2 text-[11px] font-mono text-zinc-400">
                  Minted to date: <span className="text-white font-bold">{MBTTC_TOKEN_INFO.telemetry.referralMinted}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">CHANNEL 03</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">Package Minting</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Continuous node yields generate daily token rewards per block cycle, accumulating directly in participants' vaults.
                </p>
                <div className="pt-2 text-[11px] font-mono text-zinc-400">
                  Minted to date: <span className="text-white font-bold">{MBTTC_TOKEN_INFO.telemetry.packageMinted}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Future Content / Module Information */}
          <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/90 p-6 sm:p-8 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/80">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white font-mono">Future Content &amp; Protocol Roadmap</h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {MBTTC_TOKEN_INFO.telemetry.priceOracleNote} The airdrop distribution caps are calculated against the {MBTTC_TOKEN_INFO.airdropConfig.hardCap} protocol hard cap. Additional multi-chain bridge parameters and liquidity pools will unlock alongside Phase 7 deployment.
            </p>
          </div>

          {/* Action if actually implemented */}
          {onNavigate && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-zinc-900/80 to-teal-950/50 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base font-bold text-white font-mono">Access Token Center &amp; Instant Swap</h3>
                <p className="text-xs text-zinc-400">
                  Manage your claimed rewards, view live chart telemetry, or swap MBTTC with USDT.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('mbttc')}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0 cursor-pointer flex items-center gap-2"
              >
                <span>Launch Token Center</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
           CARDS 02 TO 11: LAUNCHING SOON (CLEAN ARCHITECTURAL PLACEHOLDER)
           No fake educational content or invented operational numbers.
           Ready for future content injection per instructions.
           ========================================================================= */
        <div className="space-y-8">
          {/* Main Placeholder Showcase */}
          <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/90 p-8 sm:p-12 text-center space-y-6 shadow-xl">
            <div className="flex justify-center">
              <HubAnimatedIcon iconType={module.iconType} size="lg" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase border bg-zinc-900/80 text-zinc-400 border-zinc-700/60 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                <span>LAUNCHING SOON</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">
                {module.title}
              </h2>

              <p className="text-sm sm:text-base text-emerald-400/90 font-medium pt-1">
                Detailed module information will be introduced soon.
              </p>

              <p className="text-xs text-zinc-400 leading-relaxed pt-2">
                The technical specifications, interactive interfaces, and educational documentation for this ecosystem module are currently in staging.
              </p>
            </div>
          </div>

          {/* Structured Slots for Future Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Overview Slot */}
            <div className="rounded-3xl bg-zinc-950/60 border border-zinc-800/80 p-6 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                <Info className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-bold text-white font-mono">Overview</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Module parameters and system overview will be introduced upon protocol unlock.
              </p>
            </div>

            {/* Key Information Slot */}
            <div className="rounded-3xl bg-zinc-950/60 border border-zinc-800/80 p-6 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                <ShieldCheck className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-bold text-white font-mono">Key Information</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Detailed metrics, contract rules, and telemetry will be populated once this module officially unlocks.
              </p>
            </div>

            {/* How It Works Slot */}
            <div className="rounded-3xl bg-zinc-950/60 border border-zinc-800/80 p-6 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                <Zap className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-bold text-white font-mono">How It Works</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Interactive architecture and step-by-step workflow will be introduced in the next rollout phase.
              </p>
            </div>

            {/* Future Content / Module Information Slot */}
            <div className="rounded-3xl bg-zinc-950/60 border border-zinc-800/80 p-6 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                <Clock className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-bold text-white font-mono">Future Content</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Detailed module information will be introduced soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM ACTION: [← Back to MDeFi Hub] ── */}
      <div className="pt-4 pb-8 flex items-center justify-between border-t border-zinc-800/80">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 hover:border-emerald-500/40 text-xs font-mono font-medium transition-all shadow-md group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to MDeFi Hub</span>
        </button>

        <span className="text-[11px] font-mono text-zinc-500">
          MDeFi Protocol • Hub Module {module.cardIndex}
        </span>
      </div>
    </div>
  );
};
