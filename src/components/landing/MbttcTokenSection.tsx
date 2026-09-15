import React from 'react';
import { 
  Coins, 
  Flame, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Layers, 
  RefreshCw, 
  CheckCircle2,
  TrendingUp,
  Award,
  Lock,
  AlertCircle
} from 'lucide-react';
import { MbttcCoin3D } from '../MbttcCoin3D';
import { treasuryService } from '../../services/treasuryService';
import { programPhaseService } from '../../services/programPhaseService';
import { useLanguage } from '../../context/LanguageContext';

export const MbttcTokenSection: React.FC = () => {
  const { t } = useLanguage();
  const treasuryState = treasuryService.getTreasuryState();
  const currentPhase = programPhaseService.getCurrentPhase();
  const isTradingLive = programPhaseService.isMbttcTradingAvailable();

  const utilities = [
    {
      icon: Sparkles,
      titleKey: 'mbttc_u1_title',
      titleDefault: 'Community Airdrop',
      descKey: 'mbttc_u1_desc',
      descDefault: 'Free community distribution cycle executable every 4 hours for active registered members.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/60 border-emerald-500/30',
    },
    {
      icon: Zap,
      titleKey: 'mbttc_u2_title',
      titleDefault: 'Ecosystem Utility',
      descKey: 'mbttc_u2_desc',
      descDefault: 'Native gas fuel and transactional currency unifying all MDeFi matrix and node interactions.',
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/60 border-cyan-500/30',
    },
    {
      icon: Award,
      titleKey: 'mbttc_u3_title',
      titleDefault: 'Weekly Reward Claims',
      descKey: 'mbttc_u3_desc',
      descDefault: 'Serves as the necessary transactional validator and relayer fuel when claiming community pool rewards.',
      color: 'text-purple-400',
      bg: 'bg-purple-950/60 border-purple-500/30',
    },
    {
      icon: Layers,
      titleKey: 'mbttc_u4_title',
      titleDefault: 'Salary Claim Utility',
      descKey: 'mbttc_u4_desc',
      descDefault: 'Powers the claim execution and pull-payment dispatch of weekly passive protocol stipends.',
      color: 'text-teal-400',
      bg: 'bg-teal-950/60 border-teal-500/30',
    },
    {
      icon: Flame,
      titleKey: 'mbttc_u5_title',
      titleDefault: 'Deflationary Burn Mechanism',
      descKey: 'mbttc_u5_desc',
      descDefault: 'A programmatic percentage of MBTTC consumed during claim transactions is permanently burned to reduce supply.',
      color: 'text-amber-400',
      bg: 'bg-amber-950/60 border-amber-500/30',
    },
  ];

  return (
    <section id="mbttc" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 web3-icon-glyph" />
            <span>{t('mbttc_badge', 'Native Protocol Currency')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('mbttc_title', 'MBTTC — Magnet Bitcoin Token')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {t('mbttc_desc', 'MBTTC is the native token of the MDeFi Ecosystem. Engineered on the BNB Smart Chain (BEP-20) with mathematically capped minting and utility-driven tokenomics.')}
          </p>
        </div>

        {/* Live Treasury Rate & Status Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="web3-icon-badge web3-icon-emerald p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              <TrendingUp className="w-5 h-5 web3-icon-glyph" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400 uppercase font-bold">{t('mbttc_treasury_status', 'Treasury Valuation Status:')}</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                  treasuryState.isPhaseActive 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    : 'bg-zinc-900 text-amber-400 border-zinc-700'
                }`}>
                  {treasuryState.isPhaseActive ? t('mbttc_phase_active', 'Phase 2+ Active') : t('mbttc_unlocks_p2', '🔒 Unlocks in Phase 2')}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {treasuryState.isPhaseActive && treasuryState.liveRateUsd !== null ? (
                  <span className="text-emerald-300 font-mono font-bold">
                    1 MBTTC = ${treasuryState.liveRateUsd.toFixed(2)} USDT ({t('treasury_calculated_rate', 'Treasury Calculated Rate')})
                  </span>
                ) : (
                  <span>{t('mbttc_rate_desc', 'Rate indexing activates when S4 Node connects to Treasury IPO in Phase 2.')}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">{t('mbttc_trading_status', 'Trading Status:')}</span>
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
              isTradingLive
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700'
            }`}>
              {isTradingLive ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('mbttc_trading_active', 'DEX Trading Active')}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-300">{t('mbttc_trading_p4', 'Trading Starts in Phase 4')}</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Feature Hero Banner */}
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#061810] via-zinc-950 to-[#03130c] border border-emerald-500/35 shadow-[0_0_60px_rgba(16,185,129,0.15)] overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* 3D Coin Display (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="relative py-4">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
                <MbttcCoin3D 
                  size="xl" 
                  interactive={true} 
                  autoRotate={true} 
                  glow={true} 
                  className="drop-shadow-[0_15px_35px_rgba(16,185,129,0.35)]"
                />
              </div>
              <div className="mt-4 text-center space-y-1">
                <span className="text-xs font-mono font-bold text-white block">{t('mbttc_bep20', 'BEP-20 Standard')}</span>
                <span className="text-[10px] text-zinc-400 font-mono">18 {t('decimals_bsc', 'Decimals • Binance Smart Chain')}</span>
              </div>
            </div>

            {/* Utility Grid (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {utilities.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-emerald-500/30 transition-all space-y-2 group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`web3-icon-badge p-2 rounded-xl border ${item.bg} ${item.color}`}>
                          <Icon className="w-4 h-4 web3-icon-glyph" />
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {t(item.titleKey, item.titleDefault)}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {t(item.descKey, item.descDefault)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
