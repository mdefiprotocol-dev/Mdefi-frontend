import React from 'react';
import { 
  Award, 
  Crown, 
  Zap, 
  Clock, 
  Users, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { programPhaseService } from '../../services/programPhaseService';
import { LaunchModuleKey } from '../../config/launchPhaseConfig';
import { useLanguage } from '../../context/LanguageContext';

interface WeeklyRewardSectionProps {
  onSelectPool?: (moduleKey: LaunchModuleKey) => void;
}

export const WeeklyRewardSection: React.FC<WeeklyRewardSectionProps> = ({
  onSelectPool,
}) => {
  const { t } = useLanguage();
  const currentPhase = programPhaseService.getCurrentPhase();

  const pools: Array<{
    id: string;
    moduleKey: LaunchModuleKey;
    minPhase: number;
    titleKey: string;
    titleDefault: string;
    badgeKey: string;
    badgeDefault: string;
    descKey: string;
    descDefault: string;
    metric1LabelKey: string;
    metric1LabelDefault: string;
    metric1ValKey: string;
    metric1ValDefault: string;
    metric2LabelKey: string;
    metric2LabelDefault: string;
    metric2ValKey: string;
    metric2ValDefault: string;
    color: string;
    icon: any;
    cardBg: string;
    border: string;
    badgeBg: string;
  }> = [
    {
      id: 'starter',
      moduleKey: 'starter_reward',
      minPhase: 2,
      titleKey: 'weekly_starter_title',
      titleDefault: 'Weekly Reward Starter',
      badgeKey: 'weekly_starter_badge',
      badgeDefault: 'Community Pool',
      descKey: 'weekly_starter_desc',
      descDefault: '10% of weekly ecosystem deposit volume is accumulated in a dedicated smart contract vault and distributed pro-rata to community members with 1+ qualified direct partner.',
      metric1LabelKey: 'pool_allocation',
      metric1LabelDefault: 'Pool Allocation',
      metric1ValKey: 'weekly_starter_m1_val',
      metric1ValDefault: '10% Weekly Inflow',
      metric2LabelKey: 'qualification',
      metric2LabelDefault: 'Qualification',
      metric2ValKey: 'weekly_starter_m2_val',
      metric2ValDefault: '1 Direct Partner = 1 Share',
      color: 'emerald',
      icon: Award,
      cardBg: 'from-[#081810] via-zinc-950 to-[#040c07]',
      border: 'border-emerald-500/35',
      badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
    },
    {
      id: 'premium',
      moduleKey: 'premium_reward',
      minPhase: 3,
      titleKey: 'weekly_premium_title',
      titleDefault: 'Weekly Reward Premium',
      badgeKey: 'weekly_premium_badge',
      badgeDefault: 'Elite Pool',
      descKey: 'weekly_premium_desc',
      descDefault: 'Specialized high-yield pool allocated from protocol volumes for builders who have achieved 3 or more direct partner activations, with automated cycle settlements.',
      metric1LabelKey: 'pool_allocation',
      metric1LabelDefault: 'Pool Allocation',
      metric1ValKey: 'weekly_premium_m1_val',
      metric1ValDefault: 'Pro-Rata Pool Share',
      metric2LabelKey: 'qualification',
      metric2LabelDefault: 'Qualification',
      metric2ValKey: 'weekly_premium_m2_val',
      metric2ValDefault: '3 Direct Partners Minimum',
      color: 'cyan',
      icon: Crown,
      cardBg: 'from-[#06181f] via-zinc-950 to-[#030c12]',
      border: 'border-cyan-500/35',
      badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
    },
    {
      id: 'salary',
      moduleKey: 'salary',
      minPhase: 3,
      titleKey: 'weekly_salary_title',
      titleDefault: 'Weekly Passive Salary',
      badgeKey: 'weekly_salary_badge',
      badgeDefault: 'Staking Stipend',
      descKey: 'weekly_salary_desc',
      descDefault: 'Sustained protocol staking yield generated from perpetual network transaction and swap fees, delivering recurring weekly rewards to long-term participants.',
      metric1LabelKey: 'pool_allocation',
      metric1LabelDefault: 'Pool Allocation',
      metric1ValKey: 'weekly_salary_m1_val',
      metric1ValDefault: 'Protocol Fee Revenue',
      metric2LabelKey: 'distribution',
      metric2LabelDefault: 'Distribution',
      metric2ValKey: 'weekly_salary_m2_val',
      metric2ValDefault: '7-Day Recurring Cycle',
      color: 'amber',
      icon: Zap,
      cardBg: 'from-[#1a1205] via-zinc-950 to-[#0e0a03]',
      border: 'border-amber-500/35',
      badgeBg: 'bg-amber-950 text-amber-300 border-amber-500/40',
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>{t('weekly_badge', 'Yield & Performance Distribution • Launch Phase Control')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('weekly_title', 'Weekly Reward System')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {t('weekly_desc', 'Transparent on-chain weekly community cycles governed by verified smart contracts. Every week resets mathematically with zero manual intervention.')}
          </p>
        </div>

        {/* 3 Weekly Reward Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pools.map((p) => {
            const Icon = p.icon;
            const phaseStatus = programPhaseService.getModulePhaseStatus(p.moduleKey);
            return (
              <div
                key={p.id}
                onClick={() => onSelectPool?.(p.moduleKey)}
                className={`relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b ${p.cardBg} border ${p.border} shadow-xl flex flex-col justify-between overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-950/90 border border-white/10 flex items-center justify-center text-white shadow-inner">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                      phaseStatus.isUnlocked
                        ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
                        : 'bg-zinc-900 border-zinc-700 text-amber-400'
                    }`}>
                      {phaseStatus.isUnlocked ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>🟢 {t('status_live', 'LIVE')}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>🔒 {t('weekly_unlocks_in_phase', 'UNLOCKS IN PHASE')} {p.minPhase}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded border ${p.badgeBg} inline-block mb-2`}>
                      {t(p.badgeKey, p.badgeDefault)}
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {t(p.titleKey, p.titleDefault)}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {t(p.descKey, p.descDefault)}
                  </p>

                  {/* Pool Metrics Box */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">{t(p.metric1LabelKey, p.metric1LabelDefault)}:</span>
                      <span className="font-mono text-white font-bold">{t(p.metric1ValKey, p.metric1ValDefault)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">{t(p.metric2LabelKey, p.metric2LabelDefault)}:</span>
                      <span className="font-mono text-white font-bold">{t(p.metric2ValKey, p.metric2ValDefault)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{t('weekly_cycle_ledger', '7-Day Cycle Ledger')}</span>
                  </span>
                  <span>
                    {phaseStatus.isUnlocked ? t('weekly_phase_active', 'Phase Active') : `${t('phase_milestone', 'Phase')} ${p.minPhase} Launch`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
