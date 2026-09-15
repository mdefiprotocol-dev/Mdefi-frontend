import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Network, 
  Award, 
  Crown, 
  Coins, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Zap,
  Lock,
  Boxes,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { programPhaseService } from '../../services/programPhaseService';
import { LaunchModuleKey } from '../../config/launchPhaseConfig';
import { useLanguage } from '../../context/LanguageContext';

interface EcosystemSectionProps {
  onSelectModule: (moduleId: string, moduleKey?: LaunchModuleKey) => void;
  onRegisterClick: () => void;
}

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({
  onSelectModule,
  onRegisterClick,
}) => {
  const { t } = useLanguage();
  const currentPhase = programPhaseService.getCurrentPhase();

  const s4Status = programPhaseService.getModulePhaseStatus('s4');
  const quantumStatus = programPhaseService.getModulePhaseStatus('quantum_nexus');
  const nexusStatus = programPhaseService.getModulePhaseStatus('nexus_prime');
  const starterStatus = programPhaseService.getModulePhaseStatus('starter_reward');
  const premiumStatus = programPhaseService.getModulePhaseStatus('premium_reward');
  const salaryStatus = programPhaseService.getModulePhaseStatus('salary');
  const tradingStatus = programPhaseService.getModulePhaseStatus('mbttc_trading');

  // Carousel State & Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Exact 8-Card Sequence
  const modules: Array<{
    id: string;
    moduleKey?: LaunchModuleKey;
    titleKey: string;
    subKey: string;
    descKey: string;
    defaultTitle: string;
    defaultSubtitle: string;
    defaultDescription: string;
    isActive: boolean;
    minPhase: number;
    accentColor: string;
    icon: any;
    bgGrad: string;
    borderColor: string;
    topBarGrad: string;
    iconStyle: string;
    subColor: string;
    badgeBg: string;
    glowColor: string;
    isAirdropCard?: boolean;
  }> = [
    // 1. MBTTC TOKEN AIRDROP — LIVE NOW / REGISTRATION OPEN
    {
      id: 'mbttc-airdrop',
      moduleKey: 'claim_minting',
      titleKey: 'hub_mod_mbttc_airdrop_title',
      subKey: 'hub_mod_mbttc_airdrop_sub',
      descKey: 'eco_mod_airdrop_desc',
      defaultTitle: 'MBTTC TOKEN AIRDROP',
      defaultSubtitle: '4-Hour Claim Cycle • Community Rewards',
      defaultDescription: 'Join the MDeFi community, refer more members, and claim MBTTC rewards every 4 hours. Participate in the ongoing community airdrop and explore the MBTTC token ecosystem.',
      isActive: true,
      minPhase: 1,
      accentColor: 'emerald',
      icon: Coins,
      bgGrad: 'from-emerald-950/70 via-[#07130b] to-[#020b06]',
      borderColor: 'border-emerald-500/50 hover:border-emerald-400',
      topBarGrad: 'from-emerald-500 via-teal-400 to-emerald-500',
      iconStyle: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)]',
      subColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
      glowColor: 'rgba(16,185,129,0.28)',
      isAirdropCard: true,
    },
    // 2. S4 NODES — PHASE 2
    {
      id: 's4-node',
      moduleKey: 's4',
      titleKey: 'hub_mod_s4-nodes_title',
      subKey: 'hub_mod_s4-nodes_sub',
      descKey: 'eco_mod_s4_desc',
      defaultTitle: 'S4 Node',
      defaultSubtitle: 'Junior ($10) & Senior ($25)',
      defaultDescription: 'The foundation of the MDeFi decentralized matrix. 2x2 binary slot matrix trees, auto-recycles, and direct plus spillover compensation.',
      isActive: s4Status.isUnlocked,
      minPhase: 2,
      accentColor: 'emerald',
      icon: Network,
      bgGrad: 'from-emerald-950/60 via-[#06140b] to-[#020d06]',
      borderColor: s4Status.isUnlocked ? 'border-emerald-500/50 hover:border-emerald-400' : 'border-emerald-500/30 hover:border-emerald-500/50',
      topBarGrad: 'from-emerald-500/80 via-emerald-400 to-teal-400/80',
      iconStyle: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      subColor: 'text-emerald-400/90',
      badgeBg: s4Status.isUnlocked ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50' : 'bg-emerald-950/50 text-emerald-400/80 border-emerald-500/30',
      glowColor: 'rgba(16,185,129,0.22)',
    },
    // 3. WEEKLY REWARD STARTER — PHASE 2
    {
      id: 'weekly-starter',
      moduleKey: 'starter_reward',
      titleKey: 'hub_mod_weekly-reward-starter_title',
      subKey: 'hub_mod_weekly-reward-starter_sub',
      descKey: 'eco_mod_starter_desc',
      defaultTitle: 'Weekly Reward Starter',
      defaultSubtitle: '10% Direct Community Pool',
      defaultDescription: 'Algorithmic 7-day reward pool sharing among qualified community builders. 1 Direct partner grants 1 community share with live distribution telemetry.',
      isActive: starterStatus.isUnlocked,
      minPhase: 2,
      accentColor: 'teal',
      icon: Award,
      bgGrad: 'from-teal-950/60 via-[#051715] to-[#020e0d]',
      borderColor: starterStatus.isUnlocked ? 'border-teal-500/50 hover:border-teal-400' : 'border-teal-500/30 hover:border-teal-500/50',
      topBarGrad: 'from-teal-500/80 via-cyan-400 to-teal-400/80',
      iconStyle: 'bg-teal-500/15 border-teal-400/40 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]',
      subColor: 'text-teal-400/90',
      badgeBg: starterStatus.isUnlocked ? 'bg-teal-950/90 text-teal-300 border-teal-500/50' : 'bg-teal-950/50 text-teal-400/80 border-teal-500/30',
      glowColor: 'rgba(20,184,166,0.22)',
    },
    // 4. QUANTUM NODES — PHASE 3
    {
      id: 'quantum-nexus',
      moduleKey: 'quantum_nexus',
      titleKey: 'hub_mod_quantum-nexus_title',
      subKey: 'hub_mod_quantum-nexus_sub',
      descKey: 'eco_mod_quantum_desc',
      defaultTitle: 'Quantum Node',
      defaultSubtitle: 'Concentric 4-Ring ($70)',
      defaultDescription: 'Advanced 4-ring concentric radial matrix geometry, magic cashback distribution, and 10-level generational depth matching bonuses.',
      isActive: quantumStatus.isUnlocked,
      minPhase: 3,
      accentColor: 'cyan',
      icon: Boxes,
      bgGrad: 'from-cyan-950/60 via-[#041721] to-[#020c13]',
      borderColor: quantumStatus.isUnlocked ? 'border-cyan-500/50 hover:border-cyan-400' : 'border-cyan-500/30 hover:border-cyan-500/50',
      topBarGrad: 'from-cyan-500/80 via-sky-400 to-cyan-400/80',
      iconStyle: 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
      subColor: 'text-cyan-400/90',
      badgeBg: quantumStatus.isUnlocked ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50' : 'bg-cyan-950/50 text-cyan-400/80 border-cyan-500/30',
      glowColor: 'rgba(6,182,212,0.22)',
    },
    // 5. NEXUS PRIME NODE — PHASE 3
    {
      id: 'nexus-prime',
      moduleKey: 'nexus_prime',
      titleKey: 'dash_page_nexus',
      subKey: 'eco_mod_nexus_sub',
      descKey: 'eco_mod_nexus_desc',
      defaultTitle: 'Nexus Prime',
      defaultSubtitle: 'Prime Sovereign Tier ($120)',
      defaultDescription: 'Sovereign high-capacity concentric matrix. Highest slot yield returns, direct leadership pool allocation, and passive salary tier eligibility.',
      isActive: nexusStatus.isUnlocked,
      minPhase: 3,
      accentColor: 'purple',
      icon: Crown,
      bgGrad: 'from-purple-950/60 via-[#130621] to-[#0b0213]',
      borderColor: nexusStatus.isUnlocked ? 'border-purple-500/50 hover:border-purple-400' : 'border-purple-500/30 hover:border-purple-500/50',
      topBarGrad: 'from-purple-500/80 via-fuchsia-400 to-purple-400/80',
      iconStyle: 'bg-purple-500/15 border-purple-400/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
      subColor: 'text-purple-400/90',
      badgeBg: nexusStatus.isUnlocked ? 'bg-purple-950/90 text-purple-300 border-purple-500/50' : 'bg-purple-950/50 text-purple-400/80 border-purple-500/30',
      glowColor: 'rgba(168,85,247,0.22)',
    },
    // 6. WEEKLY REWARD PREMIUM — PHASE 3
    {
      id: 'weekly-premium',
      moduleKey: 'premium_reward',
      titleKey: 'hub_mod_weekly-reward-premium_title',
      subKey: 'hub_mod_weekly-reward-premium_sub',
      descKey: 'eco_mod_premium_desc',
      defaultTitle: 'Weekly Reward Premium',
      defaultSubtitle: 'Elite Direct Protocol Pool',
      defaultDescription: 'Higher-tier weekly performance rewards distributed pro-rata to builders with 3+ direct node qualifications, backed by MBTTC fee mechanics.',
      isActive: premiumStatus.isUnlocked,
      minPhase: 3,
      accentColor: 'blue',
      icon: Crown,
      bgGrad: 'from-blue-950/60 via-[#051125] to-[#020814]',
      borderColor: premiumStatus.isUnlocked ? 'border-blue-500/50 hover:border-blue-400' : 'border-blue-500/30 hover:border-blue-500/50',
      topBarGrad: 'from-blue-500/80 via-indigo-400 to-blue-400/80',
      iconStyle: 'bg-blue-500/15 border-blue-400/40 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
      subColor: 'text-blue-400/90',
      badgeBg: premiumStatus.isUnlocked ? 'bg-blue-950/90 text-blue-300 border-blue-500/50' : 'bg-blue-950/50 text-blue-400/80 border-blue-500/30',
      glowColor: 'rgba(59,130,246,0.22)',
    },
    // 7. WEEKLY PASSIVE SALARY — PHASE 3
    {
      id: 'weekly-salary',
      moduleKey: 'salary',
      titleKey: 'hub_mod_weekly-salary_title',
      subKey: 'hub_mod_weekly-salary_sub',
      descKey: 'eco_mod_salary_desc',
      defaultTitle: 'Weekly Passive Salary',
      defaultSubtitle: 'Long-Term Protocol Staking',
      defaultDescription: 'Dedicated passive stipend pool generated by perpetual ecosystem transaction fees, providing recurring returns for verified long-term participants.',
      isActive: salaryStatus.isUnlocked,
      minPhase: 3,
      accentColor: 'amber',
      icon: Zap,
      bgGrad: 'from-amber-950/60 via-[#1b1003] to-[#0f0901]',
      borderColor: salaryStatus.isUnlocked ? 'border-amber-500/50 hover:border-amber-400' : 'border-amber-500/30 hover:border-amber-500/50',
      topBarGrad: 'from-amber-500/80 via-yellow-400 to-orange-400/80',
      iconStyle: 'bg-amber-500/15 border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
      subColor: 'text-amber-400/90',
      badgeBg: salaryStatus.isUnlocked ? 'bg-amber-950/90 text-amber-300 border-amber-500/50' : 'bg-amber-950/50 text-amber-400/80 border-amber-500/30',
      glowColor: 'rgba(245,158,11,0.22)',
    },
    // 8. MBTTC TOKEN LAUNCH Trading Live — PHASE 4
    {
      id: 'mbttc-trading',
      moduleKey: 'mbttc_trading',
      titleKey: 'hub_mod_mbttc-token-launch_title',
      subKey: 'hub_mod_mbttc-token-launch_sub',
      descKey: 'eco_mod_token_desc',
      defaultTitle: 'MBTTC Token Launch',
      defaultSubtitle: 'Trading Live in Phase 4',
      defaultDescription: 'Decentralized liquidity pair trading and DEX spot swap. Target exchange rollout engineered once the 2,000,000 MBTTC minting program reaches Phase 4 launch criteria.',
      isActive: tradingStatus.isUnlocked,
      minPhase: 4,
      accentColor: 'emerald',
      icon: Coins,
      bgGrad: 'from-emerald-950/60 via-[#07170c] to-[#020c06]',
      borderColor: tradingStatus.isUnlocked ? 'border-emerald-500/50 hover:border-emerald-400' : 'border-emerald-500/30 hover:border-emerald-500/50',
      topBarGrad: 'from-emerald-500/80 via-teal-400 to-cyan-400/80',
      iconStyle: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      subColor: 'text-emerald-400/90',
      badgeBg: tradingStatus.isUnlocked ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50' : 'bg-emerald-950/50 text-emerald-400/80 border-emerald-500/30',
      glowColor: 'rgba(16,185,129,0.22)',
    },
  ];

  // Check scroll boundary
  const updateScrollState = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    // Calculate approximate active card
    const cardEl = scrollContainerRef.current.firstElementChild as HTMLElement | null;
    const cardWidth = cardEl ? cardEl.offsetWidth + 24 : 370;
    const currentIdx = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(modules.length - 1, Math.max(0, currentIdx)));
  }, [modules.length]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  // Scroll step handler
  const handleScrollByDirection = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const cardEl = scrollContainerRef.current.firstElementChild as HTMLElement | null;
    const step = cardEl ? cardEl.offsetWidth + 24 : 370;
    const scrollAmount = direction === 'left' ? -step : step;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const cards = scrollContainerRef.current.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftPos(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.3;
    if (Math.abs(walk) > 6) {
      setHasDragged(true);
    }
    scrollContainerRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    setTimeout(() => setHasDragged(false), 80);
  };

  // Destination navigation for MBTTC Token section
  const navigateToMbttcDetails = () => {
    const el = document.getElementById('mbttc');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onSelectModule('mbttc-token');
    }
  };

  return (
    <section id="ecosystem" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* Section Header with Carousel Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 web3-icon-glyph" />
              <span>{t('eco_badge', `Phased Smart Contract Architecture • Phase ${currentPhase} Active`)}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {t('eco_title', 'MDeFi Ecosystem Overview')}
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              {t('eco_desc', 'A unified constellation of decentralized matrix structures, community yield pools, and tokenomics governed by central phased launch controls.')}
            </p>
          </div>

          {/* Carousel Arrows & Counter */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <span className="text-xs font-mono text-zinc-500 hidden sm:inline-block">
              {activeIndex + 1} / {modules.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScrollByDirection('left')}
                disabled={!canScrollLeft}
                aria-label="Previous ecosystem cards"
                className="w-10 h-10 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-lg active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleScrollByDirection('right')}
                disabled={!canScrollRight}
                aria-label="Next ecosystem cards"
                className="w-10 h-10 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-lg active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Compact Horizontal Sliding Carousel Track */}
        <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex gap-6 overflow-x-auto pb-4 pt-2 px-1 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
          >
            {modules.map((mod) => {
              const Icon = mod.icon;
              const title = t(mod.titleKey, mod.defaultTitle);
              const subtitle = t(mod.subKey, mod.defaultSubtitle);
              const description = t(mod.descKey, mod.defaultDescription);
              const statusText = mod.isAirdropCard
                ? t('status_live_now', 'LIVE NOW')
                : mod.id === 'mbttc-trading'
                  ? t('status_unlocks_phase', `UNLOCKS IN PHASE ${mod.minPhase}`, { phase: mod.minPhase })
                  : mod.isActive 
                    ? t('status_live_now', 'LIVE NOW') 
                    : t('status_unlocks_phase', `UNLOCKS IN PHASE ${mod.minPhase}`, { phase: mod.minPhase });

              return (
                <div
                  key={mod.id}
                  onClick={() => {
                    if (hasDragged) return;
                    if (mod.isAirdropCard) {
                      navigateToMbttcDetails();
                    } else if (mod.id === 'mbttc-trading') {
                      navigateToMbttcDetails();
                    } else {
                      onSelectModule(mod.id, mod.moduleKey);
                    }
                  }}
                  className={`group relative rounded-2xl p-5 sm:p-6 bg-gradient-to-b ${mod.bgGrad} border ${mod.borderColor} transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-xl overflow-hidden flex flex-col justify-between w-[85vw] sm:w-[335px] lg:w-[345px] min-h-[290px] sm:min-h-[300px] shrink-0 snap-start`}
                  style={{
                    boxShadow: `0 0 30px ${mod.glowColor}`,
                  }}
                >
                  {/* Top Web3 Neon Accent Highlight Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${mod.topBarGrad} opacity-80 group-hover:opacity-100 transition-opacity`} />

                  {/* Background Ambient Glow */}
                  <div 
                    className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-35 group-hover:opacity-70 transition-opacity"
                    style={{ backgroundColor: mod.glowColor }}
                  />

                  <div>
                    {/* Top Bar: Icon & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 ${mod.iconStyle}`}>
                        <Icon className="w-5 h-5 web3-icon-glyph" />
                      </div>

                      {mod.isAirdropCard ? (
                        <div className="flex flex-wrap items-center gap-1.5 justify-end">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-emerald-950/90 text-emerald-300 border-emerald-500/50 flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{t('status_live_now', 'LIVE NOW')}</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-teal-950/90 text-teal-300 border-teal-500/50 flex items-center gap-1.5 shadow-[0_0_10px_rgba(20,184,166,0.2)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                            <span>{t('status_reg_open', 'REGISTRATION OPEN')}</span>
                          </span>
                        </div>
                      ) : (
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${mod.badgeBg} flex items-center gap-1.5`}>
                          {mod.isActive ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>{statusText}</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-zinc-400" />
                              <span>{statusText}</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-0.5 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                        {title}
                      </h3>
                      <span className={`text-[11px] font-mono font-medium block ${mod.subColor}`}>
                        {subtitle}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3.5 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    {mod.isAirdropCard ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToMbttcDetails();
                        }}
                        className="group/btn text-emerald-400 font-extrabold text-xs tracking-wider group-hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{t('btn_learn_more', 'LEARN MORE')}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    ) : mod.isActive ? (
                      <span className="text-emerald-400 font-bold group-hover:text-emerald-300 flex items-center gap-1">
                        <span>{t('explore_module', 'Explore Module')}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    ) : (
                      <span className="text-amber-400/80 font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>{t('unlocks_in_phase', `Unlocks in Phase ${mod.minPhase}`, { phase: mod.minPhase })}</span>
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-500">MDeFi Hub</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-1 pb-2">
          {modules.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => handleScrollToIndex(idx)}
              aria-label={`Go to ${m.defaultTitle}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? 'w-7 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  : 'w-2 bg-zinc-700 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>

        {/* Global Join CTA Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#071b12] via-zinc-950 to-[#09151c] border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(16,185,129,0.12)]">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {t('ready_join_network', 'Ready to Join the MDeFi Network?')}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              {t('ready_join_desc', 'Registration is live! Connect your Web3 wallet to claim 4-hour MBTTC airdrops and anchor your network placement.')}
            </p>
          </div>

          <button
            onClick={onRegisterClick}
            className="shrink-0 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>{t('btn_register', 'REGISTER NOW')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
