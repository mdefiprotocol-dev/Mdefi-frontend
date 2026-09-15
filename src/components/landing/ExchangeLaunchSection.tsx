import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';
import { MbttcCoin3D } from '../MbttcCoin3D';
import { programPhaseService } from '../../services/programPhaseService';
import { useLanguage } from '../../context/LanguageContext';

export const ExchangeLaunchSection: React.FC = () => {
  const { t } = useLanguage();
  const currentPhase = programPhaseService.getCurrentPhase();
  const isTradingLive = programPhaseService.isMbttcTradingAvailable();

  const exchanges = [
    {
      id: 'pancakeswap',
      name: 'PancakeSwap',
      typeKey: 'exchange_pancakeswap_type',
      typeDefault: 'DEX — BNB Chain Primary',
      descKey: 'exchange_pancakeswap_desc',
      descDefault: 'Native BEP-20 automated market maker liquidity pool on BNB Smart Chain. Decentralized peer-to-peer swapping with deep LP bond backing.',
      badgeColor: isTradingLive 
        ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-300'
        : 'border-zinc-700 bg-zinc-900 text-amber-400',
      iconBg: 'bg-[#1fc7d4]/10 border-[#1fc7d4]/30 text-[#1fc7d4]',
      pair: 'MBTTC / USDT & MBTTC / BNB',
    },
    {
      id: 'uniswap',
      name: 'Uniswap',
      typeKey: 'exchange_uniswap_type',
      typeDefault: 'DEX — Multi-Chain Liquidity',
      descKey: 'exchange_uniswap_desc',
      descDefault: 'Concentrated liquidity routing via multi-chain bridge deployment, enabling global DeFi traders to acquire and swap MBTTC seamlessly.',
      badgeColor: isTradingLive 
        ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-300'
        : 'border-zinc-700 bg-zinc-900 text-amber-400',
      iconBg: 'bg-[#ff007a]/10 border-[#ff007a]/30 text-[#ff007a]',
      pair: 'MBTTC / USDT (V3 Pool)',
    },
    {
      id: 'bitget',
      name: 'Bitget',
      typeKey: 'exchange_bitget_type',
      typeDefault: 'CEX — Centralized Global Orderbook',
      descKey: 'exchange_bitget_desc',
      descDefault: 'Institutional-grade high-frequency orderbook exchange listing scheduled following protocol minting milestones and LP validation.',
      badgeColor: isTradingLive 
        ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-300'
        : 'border-zinc-700 bg-zinc-900 text-amber-400',
      iconBg: 'bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]',
      pair: 'MBTTC / USDT Spot',
    },
  ];

  return (
    <section id="roadmap" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 web3-icon-glyph" />
            <span>{t('exchange_badge', 'Post-Minting Global Liquidity • Phase 4 Gate')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('exchange_title', 'Exchange Launch Roadmap')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {t('exchange_desc', 'Target exchange rollout engineered to provide decentralized and centralized liquidity once the 2,000,000 MBTTC minting program reaches Phase 4 launch criteria.')}
          </p>
        </div>

        {/* Futuristic Flow Pipeline Visual */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/90 border border-emerald-500/30 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <MbttcCoin3D size="sm" interactive={false} autoRotate={true} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase">{t('exchange_s1_step', 'Step 1 • Phase 1')}</span>
                <span className="text-sm font-bold text-white">{t('exchange_s1_title', 'MBTTC Genesis')}</span>
              </div>
            </div>

            <ArrowRight className="hidden md:block w-5 h-5 text-emerald-500/50" />

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs shrink-0">
                2M
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase">{t('exchange_s2_step', 'Step 2 • Phase 2-3')}</span>
                <span className="text-sm font-bold text-white">{t('exchange_s2_title', 'Minting & Halving')}</span>
              </div>
            </div>

            <ArrowRight className="hidden md:block w-5 h-5 text-cyan-500/50" />

            {/* Step 3 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 font-mono font-bold text-xs shrink-0">
                LP
              </div>
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold block uppercase">{t('exchange_s3_step', 'Step 3 • Pre-Trading')}</span>
                <span className="text-sm font-bold text-white">{t('exchange_s3_title', 'Liquidity Bond Lock')}</span>
              </div>
            </div>

            <ArrowRight className="hidden md:block w-5 h-5 text-purple-500/50" />

            {/* Step 4 */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)] ${
                isTradingLive 
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400'
              }`}>
                {isTradingLive ? t('status_live', 'LIVE') : 'P4'}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold block uppercase text-amber-400">
                  {t('exchange_s4_step', 'Step 4 • Phase 4 Gate')}
                </span>
                <span className="text-sm font-bold text-white">{t('exchange_s4_title', 'Exchange Trading')}</span>
              </div>
            </div>

          </div>
        </div>

        {/* 3 Exchange Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exchanges.map((ex) => (
            <div
              key={ex.id}
              className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-[#070b09] border border-zinc-800 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:scale-[1.02]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`web3-icon-badge p-3 rounded-2xl border ${ex.iconBg} font-mono font-black text-sm`}>
                    {ex.name.slice(0, 3).toUpperCase()}
                  </div>

                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${ex.badgeColor} flex items-center gap-1`}>
                    {isTradingLive ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{t('status_live_trading', '🟢 TRADING LIVE')}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-2.5 h-2.5 text-amber-400" />
                        <span>{t('trading_in_phase4', '🔒 TRADING IN PHASE 4')}</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                    {ex.name}
                  </h3>
                  <span className="text-xs font-mono font-medium text-zinc-400 block">
                    {t(ex.typeKey, ex.typeDefault)}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {t(ex.descKey, ex.descDefault)}
                </p>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono flex items-center justify-between">
                  <span className="text-zinc-400">{t('exchange_target_pair', 'Target Pair:')}</span>
                  <span className="text-emerald-400 font-bold">{ex.pair}</span>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>{t('exchange_phase3_roadmap', 'Phase 3 Roadmap')}</span>
                <span className="text-amber-400 font-semibold">{t('exchange_planned_launch', 'Planned Launch')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
