import React from 'react';
import { 
  Flame, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  Lock, 
  Zap, 
  Coins, 
  RefreshCcw, 
  CheckCircle2 
} from 'lucide-react';
import { MbttcCoin3D } from '../MbttcCoin3D';
import { BURN_DEAD_ADDRESS } from '../../data/contractConfig';
import { useLanguage } from '../../context/LanguageContext';

export const BurnDeflationSection: React.FC = () => {
  const { t } = useLanguage();

  const burnMechanics = [
    {
      titleKey: 'burn_m1_title',
      titleDefault: '2,000,000 MBTTC Hard Cap',
      descKey: 'burn_m1_desc',
      descDefault: 'Strict mathematical ceiling written into the immutable smart contract. No minting function exists after Phase 3 completion.',
      icon: Lock,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/60 border-emerald-500/30',
    },
    {
      titleKey: 'burn_m2_title',
      titleDefault: 'Weekly Reward Claim Burns',
      descKey: 'burn_m2_desc',
      descDefault: 'Claiming accumulated Weekly Starter and Premium rewards programmatically burns a fraction of consumed MBTTC forever.',
      icon: Flame,
      color: 'text-amber-400',
      bg: 'bg-amber-950/60 border-amber-500/30',
    },
    {
      titleKey: 'burn_m3_title',
      titleDefault: 'Passive Salary Stipend Burns',
      descKey: 'burn_m3_desc',
      descDefault: 'Each weekly salary claim transaction executes an automated dead-address burn relayer, continually shrinking circulating supply.',
      icon: Zap,
      color: 'text-orange-400',
      bg: 'bg-orange-950/60 border-orange-500/30',
    },
    {
      titleKey: 'burn_m4_title',
      titleDefault: 'Transaction Fee Incineration',
      descKey: 'burn_m4_desc',
      descDefault: 'A permanent 1.5% protocol transaction fee is routed to the unrecoverable blackhole address (0x000...dEaD).',
      icon: TrendingDown,
      color: 'text-rose-400',
      bg: 'bg-rose-950/60 border-rose-500/30',
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Flame className="w-3.5 h-3.5 text-amber-400 web3-icon-glyph" />
            <span>{t('burn_badge', 'Deflationary Economic Architecture')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('burn_title', 'Burn & Deflationary Utility')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {t('burn_desc', 'Why MBTTC does not inflate forever: Programmatic burn triggers continuously reduce the circulating token supply with every reward claim and transaction.')}
          </p>
        </div>

        {/* Visual Deflation Pipeline Card */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#140b04] via-[#0d0703] to-[#050302] border-2 border-amber-500/40 shadow-[0_0_70px_rgba(245,158,11,0.18)] overflow-hidden">
          {/* Flame Ambient Glows */}
          <div className="absolute -top-24 left-1/3 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-orange-600/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Central Pipeline Diagram */}
          <div className="relative z-10 space-y-8">
            <div className="text-center">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                {t('burn_loop_label', 'Continuous Scarcity Loop')}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {t('burn_engine_title', 'Automated Token Combustion Engine')}
              </h3>
            </div>

            {/* 4-Step Flow Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-3">
              {/* Step 1: Token Consumption */}
              <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-center space-y-2 relative group hover:border-amber-500/40 transition-all">
                <div className="w-10 h-10 mx-auto rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 font-mono text-xs font-bold">
                  01
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  {t('burn_step1_title', 'TOKEN CONSUMPTION')}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {t('burn_step1_desc', 'Users execute Matrix actions, Weekly Reward claims, and Salary withdrawals.')}
                </p>
              </div>

              {/* Step 2: Automatic Burn */}
              <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-center space-y-2 relative group shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <div className="w-10 h-10 mx-auto rounded-xl bg-amber-900/60 border border-amber-400 flex items-center justify-center text-amber-300">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                  {t('burn_step2_title', 'AUTOMATIC BURN')}
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {t('burn_step2_desc', 'Smart contract routes consumed MBTTC directly into unrecoverable dead address.')}
                </p>
              </div>

              {/* Step 3: Reduced Supply */}
              <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-center space-y-2 relative group hover:border-orange-500/40 transition-all">
                <div className="w-10 h-10 mx-auto rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-orange-400">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  {t('burn_step3_title', 'REDUCED SUPPLY')}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {t('burn_step3_desc', 'Active circulating market float permanently decreases on-chain.')}
                </p>
              </div>

              {/* Step 4: Value Scarcity */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-zinc-950 border border-emerald-500/40 text-center space-y-2 relative group shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-900/60 border border-emerald-400 flex items-center justify-center text-emerald-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                  {t('burn_step4_title', 'VALUE SCARCITY')}
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {t('burn_step4_desc', 'Fixed hard cap meets shrinking liquid supply, strengthening network tokenomics.')}
                </p>
              </div>
            </div>

            {/* Middle Animated Burning Graphic & Dead Address Display */}
            <div className="p-5 sm:p-6 rounded-2xl bg-black/70 border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <MbttcCoin3D size="md" interactive={false} autoRotate={true} glow={true} />
                  {/* Subtle Flame Aura */}
                  <div className="absolute -inset-2 bg-amber-500/30 rounded-full blur-md animate-pulse pointer-events-none" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                    {t('burn_dead_addr_title', 'Verified Dead Address Incineration')}
                  </span>
                  <span className="text-xs sm:text-sm font-mono text-zinc-300 break-all font-semibold">
                    {BURN_DEAD_ADDRESS}
                  </span>
                </div>
              </div>

              <div className="shrink-0 px-4 py-2 rounded-xl bg-amber-950/80 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-amber-400 web3-icon-glyph" />
                <span>{t('burn_zero_extract', 'Zero Private Extraction')}</span>
              </div>
            </div>

            {/* 4 Pillars Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {burnMechanics.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-amber-500/30 transition-all space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`web3-icon-badge p-2 rounded-xl border ${item.bg} ${item.color}`}>
                        <Icon className="w-4 h-4 web3-icon-glyph" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
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
    </section>
  );
};
