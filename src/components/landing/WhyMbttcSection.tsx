import React from 'react';
import { 
  Coins, 
  Sparkles, 
  Award, 
  Zap, 
  Flame, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const WhyMbttcSection: React.FC = () => {
  const { t } = useLanguage();

  const reasons = [
    {
      icon: Coins,
      titleKey: 'why_p1_title',
      titleDefault: 'Native Ecosystem Token',
      subtitleKey: 'why_p1_subtitle',
      subtitleDefault: 'Single Standard Engine',
      descKey: 'why_p1_desc',
      descDefault: 'Engineered as the foundational cryptographic settlement asset for all MDeFi protocol contracts, matrix node trees, and weekly reward pools.',
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'from-emerald-950/30 via-zinc-950 to-[#040d07]',
    },
    {
      icon: Sparkles,
      titleKey: 'why_p2_title',
      titleDefault: '4-Hour Airdrop Utility',
      subtitleKey: 'why_p2_subtitle',
      subtitleDefault: 'Frequent Community Accrual',
      descKey: 'why_p2_desc',
      descDefault: 'Continuous micro-distributions that activate every 4 hours, fostering daily active user engagement and sustainable token decentralization.',
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'from-cyan-950/30 via-zinc-950 to-[#040d12]',
    },
    {
      icon: Award,
      titleKey: 'why_p3_title',
      titleDefault: 'Reward Claim Utility',
      subtitleKey: 'why_p3_subtitle',
      subtitleDefault: 'Validator Settlement Relayer',
      descKey: 'why_p3_desc',
      descDefault: 'Users utilize MBTTC to execute eligible ecosystem reward and bonus claims with near-zero gas friction on the BNB Smart Chain network.',
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'from-purple-950/30 via-zinc-950 to-[#0e0414]',
    },
    {
      icon: Zap,
      titleKey: 'why_p4_title',
      titleDefault: 'Ecosystem Transaction Utility',
      subtitleKey: 'why_p4_subtitle',
      subtitleDefault: 'Matrix Liquidity Fuel',
      descKey: 'why_p4_desc',
      descDefault: 'Powers fast, low-cost internal routing across S4 Node, Quantum Node, and Nexus Prime matrix placements without reliance on third-party tokens.',
      color: 'text-teal-400',
      border: 'border-teal-500/30',
      bg: 'from-teal-950/30 via-zinc-950 to-[#03110c]',
    },
    {
      icon: Flame,
      titleKey: 'why_p5_title',
      titleDefault: 'Deflationary Burn Mechanism',
      subtitleKey: 'why_p5_subtitle',
      subtitleDefault: 'Immutable Supply Contraction',
      descKey: 'why_p5_desc',
      descDefault: 'Every claim transaction programmatically incinerates a portion of consumed MBTTC into a dead address (0x...000), reducing supply over time.',
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'from-amber-950/30 via-zinc-950 to-[#120a02]',
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 web3-icon-glyph" />
            <span>{t('why_mbttc_badge', 'Token Value Mechanics')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('why_mbttc_title', 'Why MBTTC?')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {t('why_mbttc_desc', 'Built from genesis with actual on-chain utilities rather than speculative hype. Five core design pillars anchor the Magnet Bitcoin Token architecture.')}
          </p>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <div
                key={i}
                className={`relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b ${r.bg} border ${r.border} shadow-xl flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`web3-icon-badge p-3 rounded-2xl bg-zinc-950 border border-white/10 ${r.color} shadow-inner`}>
                      <Icon className="w-6 h-6 web3-icon-glyph" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase text-zinc-500">
                      {t('why_mbttc_pillar_label', 'Pillar')} 0{i + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {t(r.titleKey, r.titleDefault)}
                    </h3>
                    <span className="text-xs font-mono text-zinc-400 block mt-0.5">
                      {t(r.subtitleKey, r.subtitleDefault)}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {t(r.descKey, r.descDefault)}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 web3-icon-glyph" />
                    <span>{t('why_mbttc_verified_rule', 'Verified Protocol Rule')}</span>
                  </span>
                  <span>BEP-20</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
