import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Network, 
  Award, 
  Crown, 
  Coins, 
  ArrowRight, 
  Sparkles, 
  Zap,
  Lock,
  Boxes,
  ShieldCheck
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

  // Exact 8-Card Sequence
  const modules = useMemo(() => [
    {
      id: 'mbttc-airdrop',
      moduleKey: 'claim_minting' as LaunchModuleKey,
      titleKey: 'hub_mod_mbttc_airdrop_title',
      subKey: 'hub_mod_mbttc_airdrop_sub',
      descKey: 'eco_mod_airdrop_desc',
      defaultTitle: 'MBTTC Token Airdrop',
      defaultSubtitle: '4-Hour Claim Cycle • Community Rewards',
      defaultDescription: 'Join the MDeFi community, refer more members, and claim MBTTC rewards every 4 hours. Participate in the ongoing community airdrop and explore the MBTTC token ecosystem.',
      isActive: true,
      minPhase: 1,
      accentColor: 'emerald',
      icon: Coins,
      bgGrad: 'bg-[#09150f]',
      borderColor: 'border-emerald-500/50',
      topBarGrad: 'from-emerald-500 via-teal-400 to-emerald-500',
      iconStyle: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
      subColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40',
      glowColor: 'rgba(16,185,129,0.25)',
      isAirdropCard: true,
    },
    {
      id: 's4-node',
      moduleKey: 's4' as LaunchModuleKey,
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
      bgGrad: 'bg-[#06140c]',
      borderColor: 'border-emerald-500/35',
      topBarGrad: 'from-emerald-500/80 via-emerald-400 to-teal-400/80',
      iconStyle: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
      subColor: 'text-emerald-400/90',
      badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40',
      glowColor: 'rgba(16,185,129,0.2)',
    },
    {
      id: 'weekly-starter',
      moduleKey: 'starter_reward' as LaunchModuleKey,
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
      bgGrad: 'bg-[#051614]',
      borderColor: 'border-teal-500/35',
      topBarGrad: 'from-teal-500/80 via-cyan-400 to-teal-400/80',
      iconStyle: 'bg-teal-500/15 border-teal-400/30 text-teal-300',
      subColor: 'text-teal-400/90',
      badgeBg: 'bg-teal-950/90 text-teal-300 border-teal-500/40',
      glowColor: 'rgba(20,184,166,0.2)',
    },
    {
      id: 'quantum-nexus',
      moduleKey: 'quantum_nexus' as LaunchModuleKey,
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
      bgGrad: 'bg-[#041620]',
      borderColor: 'border-cyan-500/35',
      topBarGrad: 'from-cyan-500/80 via-sky-400 to-cyan-400/80',
      iconStyle: 'bg-cyan-500/15 border-cyan-400/30 text-cyan-300',
      subColor: 'text-cyan-400/90',
      badgeBg: 'bg-cyan-950/90 text-cyan-300 border-cyan-500/40',
      glowColor: 'rgba(6,182,212,0.2)',
    },
    {
      id: 'nexus-prime',
      moduleKey: 'nexus_prime' as LaunchModuleKey,
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
      bgGrad: 'bg-[#12071f]',
      borderColor: 'border-purple-500/35',
      topBarGrad: 'from-purple-500/80 via-fuchsia-400 to-purple-400/80',
      iconStyle: 'bg-purple-500/15 border-purple-400/30 text-purple-300',
      subColor: 'text-purple-400/90',
      badgeBg: 'bg-purple-950/90 text-purple-300 border-purple-500/40',
      glowColor: 'rgba(168,85,247,0.2)',
    },
    {
      id: 'weekly-premium',
      moduleKey: 'premium_reward' as LaunchModuleKey,
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
      bgGrad: 'bg-[#051124]',
      borderColor: 'border-blue-500/35',
      topBarGrad: 'from-blue-500/80 via-indigo-400 to-blue-400/80',
      iconStyle: 'bg-blue-500/15 border-blue-400/30 text-blue-300',
      subColor: 'text-blue-400/90',
      badgeBg: 'bg-blue-950/90 text-blue-300 border-blue-500/40',
      glowColor: 'rgba(59,130,246,0.2)',
    },
    {
      id: 'weekly-salary',
      moduleKey: 'salary' as LaunchModuleKey,
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
      bgGrad: 'bg-[#180f03]',
      borderColor: 'border-amber-500/35',
      topBarGrad: 'from-amber-500/80 via-yellow-400 to-orange-400/80',
      iconStyle: 'bg-amber-500/15 border-amber-400/30 text-amber-300',
      subColor: 'text-amber-400/90',
      badgeBg: 'bg-amber-950/90 text-amber-300 border-amber-500/40',
      glowColor: 'rgba(245,158,11,0.2)',
    },
    {
      id: 'mbttc-trading',
      moduleKey: 'mbttc_trading' as LaunchModuleKey,
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
      bgGrad: 'bg-[#06160c]',
      borderColor: 'border-emerald-500/35',
      topBarGrad: 'from-emerald-500/80 via-teal-400 to-cyan-400/80',
      iconStyle: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
      subColor: 'text-emerald-400/90',
      badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40',
      glowColor: 'rgba(16,185,129,0.2)',
    },
  ], [s4Status.isUnlocked, quantumStatus.isUnlocked, nexusStatus.isUnlocked, starterStatus.isUnlocked, premiumStatus.isUnlocked, salaryStatus.isUnlocked, tradingStatus.isUnlocked]);

  const [activeIndex, setActiveIndex] = useState(0);
  const isPausedRef = useRef(false);

  // High-performance auto transition: 3.5s interval (smooth read & zero stutter)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPausedRef.current) {
        setActiveIndex((prev) => (prev + 1) % modules.length);
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [modules.length]);

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
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        
        {/* Clean Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('eco_badge', `Phased Smart Contract Architecture • Phase ${currentPhase} Active`)}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {t('eco_title', 'MDeFi Ecosystem Overview')}
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              {t('eco_desc', 'A unified constellation of decentralized matrix structures, community yield pools, and tokenomics governed by central phased launch controls.')}
            </p>
          </div>
        </div>

        {/* 3D Stack Container: Fixed Height & Zero Heavy Blurs for High FPS */}
        <div 
          className="relative h-[380px] sm:h-[390px] w-full flex items-center justify-center select-none"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          onTouchStart={() => { isPausedRef.current = true; }}
          onTouchEnd={() => { isPausedRef.current = false; }}
        >
          {modules.map((mod, index) => {
            const count = modules.length;
            const diff = (index - activeIndex + count) % count;
            
            // Render only top 3 cards to keep memory footprint 0
            if (diff > 2 && diff !== count - 1) return null;

            // GPU Composited transforms
            let translateY = diff * 18; // 18px neat vertical layer stack
            let scale = 1 - diff * 0.04; // 4% subtle scale
            let opacity = diff === 0 ? 1 : diff === 1 ? 0.75 : 0.45;
            let zIndex = 25 - diff;

            if (diff === count - 1) {
              // Smooth upward float transition for outgoing card
              translateY = -50;
              scale = 0.98;
              opacity = 0;
              zIndex = 30;
            }

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
                  if (diff === 0) {
                    if (mod.isAirdropCard || mod.id === 'mbttc-trading') {
                      navigateToMbttcDetails();
                    } else {
                      onSelectModule(mod.id, mod.moduleKey);
                    }
                  } else {
                    setActiveIndex(index);
                  }
                }}
                className={`absolute w-full max-w-2xl rounded-3xl p-6 sm:p-8 ${mod.bgGrad} border ${mod.borderColor} shadow-xl flex flex-col justify-between cursor-pointer`}
                style={{
                  transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease-out',
                  willChange: 'transform, opacity',
                  boxShadow: diff === 0 ? `0 16px 36px -10px ${mod.glowColor}` : 'none',
                }}
              >
                {/* Neon Top Bar */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${mod.topBarGrad}`} />

                <div className="space-y-3.5">
                  {/* Top: Icon + Status */}
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${mod.iconStyle}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${mod.badgeBg} flex items-center gap-1.5`}>
                      {mod.isActive ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{statusText}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{statusText}</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {title}
                    </h3>
                    <span className={`text-sm font-semibold block mt-0.5 ${mod.subColor}`}>
                      {subtitle}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                    {description}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 mt-5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>MDeFi Architecture</span>
                  </span>

                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                    <span>{mod.isAirdropCard ? 'CLAIM AIRDROP' : mod.isActive ? 'EXPLORE MODULE' : 'PHASE LOCKED'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
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