import React from 'react';
import { 
  GitCommit, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Layers, 
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const RoadmapSection: React.FC = () => {
  const { t } = useLanguage();
  const milestones = [
    {
      quarterKey: 'milestone_genesis_quarter',
      quarterDefault: 'GENESIS & PROTOCOL AUDIT',
      titleKey: 'milestone_genesis_title',
      titleDefault: 'Foundation Architecture',
      statusKey: 'status_completed',
      statusDefault: 'COMPLETED',
      isPast: true,
      itemKeys: ['rm_gen_1', 'rm_gen_2', 'rm_gen_3', 'rm_gen_4'],
      items: [
        'MDeFi Hub Smart Contract deployment on BNB Smart Chain',
        'MBTTC BEP-20 token contract creation (2,000,000 max mint cap)',
        'S4 Node binary matrix smart contract verification',
        'Non-custodial cryptographic wallet architecture test'
      ],
      border: 'border-emerald-500/40',
      badge: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
    },
    {
      quarterKey: 'milestone_p1_quarter',
      quarterDefault: 'CURRENT PHASE 1',
      titleKey: 'milestone_p1_title',
      titleDefault: 'Community Genesis & S4 Node Live',
      statusKey: 'status_active_now',
      statusDefault: 'ACTIVE NOW',
      isPast: false,
      isCurrent: true,
      itemKeys: ['rm_p1_1', 'rm_p1_2', 'rm_p1_3', 'rm_p1_4'],
      items: [
        'Public launch of S4 Junior ($10) & Senior ($25) Matrix Nodes',
        'Activation of 4-hour community MBTTC airdrop system',
        'Registration rewards (100 MBTTC per verified account)',
        'Direct referral tree tracking and instant matrix settlement'
      ],
      border: 'border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.25)]',
      badge: 'bg-emerald-900 text-emerald-200 border-emerald-400 font-bold',
    },
    {
      quarterKey: 'milestone_p2_quarter',
      quarterDefault: 'PHASE 2 PIPELINE',
      titleKey: 'milestone_p2_title',
      titleDefault: 'Concentric Nodes & Weekly Pools',
      statusKey: 'status_in_dev',
      statusDefault: 'IN DEVELOPMENT',
      isPast: false,
      itemKeys: ['rm_p2_1', 'rm_p2_2', 'rm_p2_3', 'rm_p2_4'],
      items: [
        'Quantum Node ($70) 30-position radial matrix rollout',
        'Nexus Prime ($120) global revenue priority deployment',
        'Weekly Reward Starter & Premium 10% pool distributions',
        'Weekly Passive Salary staking smart contract activation'
      ],
      border: 'border-cyan-500/30',
      badge: 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
    },
    {
      quarterKey: 'milestone_p3_quarter',
      quarterDefault: 'PHASE 3 & HORIZON',
      titleKey: 'milestone_p3_title',
      titleDefault: 'Mint Completion & Exchange Listings',
      statusKey: 'status_planned',
      statusDefault: 'PLANNED',
      isPast: false,
      itemKeys: ['rm_p3_1', 'rm_p3_2', 'rm_p3_3', 'rm_p3_4'],
      items: [
        'Fulfillment of 2,000,000 MBTTC maximum mint supply program',
        'LP Bond 400,000 MBTTC decentralized liquidity pool locks',
        'PancakeSwap (DEX) & Uniswap multi-chain liquidity pools',
        'Bitget centralized global spot market launch'
      ],
      border: 'border-purple-500/30',
      badge: 'bg-purple-950 text-purple-300 border-purple-500/40',
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 web3-icon-glyph" />
            <span>{t('roadmap_badge', 'Strategic Ecosystem Trajectory')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('roadmap_title', 'Ecosystem Roadmap')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {t('roadmap_desc', 'From cryptographic contract foundation to global multi-exchange liquidity. Every phase is governed mathematically on-chain.')}
          </p>
        </div>

        {/* Roadmap Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-6 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-[#050c07] border ${m.border} flex flex-col justify-between space-y-4 shadow-xl`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                    {t(m.quarterKey, m.quarterDefault)}
                  </span>
                  <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${m.badge} flex items-center gap-1`}>
                    {m.isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                    <span>{t(m.statusKey, m.statusDefault)}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">
                  {t(m.titleKey, m.titleDefault)}
                </h3>

                <ul className="space-y-2 pt-2 border-t border-zinc-800/80">
                  {m.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${m.isPast || m.isCurrent ? 'text-emerald-400' : 'text-zinc-600'}`} />
                      <span>{t(m.itemKeys[i], item)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{t('phase_milestone', 'Phase Milestone')} 0{idx + 1}</span>
                <span>BNB Smart Chain</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
