import React from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  Layers, 
  Flame, 
  Users, 
  TrendingDown 
} from 'lucide-react';
import { 
  MINTING_PHASES_CONFIG, 
  ECOSYSTEM_TELEMETRY, 
  getActivePhaseConfig 
} from '../../data/contractConfig';
import { useLanguage } from '../../context/LanguageContext';

export const MintingPhasesSection: React.FC = () => {
  const { t } = useLanguage();
  const activeConfig = getActivePhaseConfig();
  const phases = MINTING_PHASES_CONFIG;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <GitBranch className="w-3.5 h-3.5 web3-icon-glyph" />
            <span>{t('minting_badge', 'MDeFi Hub Smart Contract Lifecycle')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('minting_title', 'MBTTC Minting Phases')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {t('minting_desc', 'The smart contract mints MBTTC according to strict algorithmic tiers. As total registered user milestones are reached, reward issuance is systematically halved.')}
          </p>
        </div>

        {/* Dynamic Live Phase Telemetry Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#061810] via-zinc-950 to-[#041219] border-2 border-emerald-500/40 shadow-[0_0_60px_rgba(16,185,129,0.18)]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left: User Count & Active Phase */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                  {t('minting_telemetry_label', 'LIVE HUB TELEMETRY')}
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-4 sm:gap-6">
                <div>
                  <span className="text-xs text-zinc-400 font-mono uppercase block">{t('minting_current_users', 'Current Users')}</span>
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                    {ECOSYSTEM_TELEMETRY.currentUsers.toLocaleString()}
                  </span>
                </div>
                <div className="border-l border-zinc-800 pl-4 sm:pl-6">
                  <span className="text-xs text-zinc-400 font-mono uppercase block">{t('minting_active_phase', 'Active Phase')}</span>
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-tight">
                    {activeConfig.name}
                  </span>
                </div>
                <div className="border-l border-zinc-800 pl-4 sm:pl-6">
                  <span className="text-xs text-zinc-400 font-mono uppercase block">{t('minting_next_reduction', 'Next Phase Reduction At')}</span>
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-300 tracking-tight">
                    {ECOSYSTEM_TELEMETRY.nextPhaseThreshold.toLocaleString()} {t('minting_users_suffix', 'Users')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Active Mint Rewards Badge Box */}
            <div className="w-full lg:w-auto p-4 rounded-2xl bg-zinc-950/90 border border-emerald-500/30 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                {t('minting_rewards_label', 'Current Mint Rewards')} ({activeConfig.name}):
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
                  {t('minting_reg_reward', 'Registration:')} {activeConfig.registrationReward} MBTTC
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                  {t('minting_ref_reward', 'Referral:')} {activeConfig.referralReward} MBTTC
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold">
                  {t('minting_quantum_reward', 'Quantum S4:')} {activeConfig.quantumS4Reward} MBTTC
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 3-Phase Structured Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {phases.map((ph) => {
            const isCurrent = ph.isCurrent;
            return (
              <div
                key={ph.phase}
                className={`relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b ${
                  ph.phase === 1 
                    ? 'from-emerald-950/50 via-zinc-950 to-[#040f08] border-2 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]'
                    : ph.phase === 2
                    ? 'from-cyan-950/30 via-zinc-950 to-[#040d14] border border-cyan-500/30'
                    : 'from-purple-950/30 via-zinc-950 to-[#0e0414] border border-purple-500/30'
                } flex flex-col justify-between overflow-hidden shadow-xl`}
              >
                <div className="space-y-4">
                  {/* Top Phase Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black tracking-widest text-zinc-400 uppercase">
                      {ph.name}
                    </span>

                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      isCurrent 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' 
                        : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                    } flex items-center gap-1.5`}>
                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                      <span>{t(isCurrent ? 'status_active_now' : 'status_planned', ph.status)}</span>
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {ph.userTierDescription}
                  </p>

                  {/* Reward Metrics Strip */}
                  <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">{t('minting_reg_reward', 'Registration Reward:')}</span>
                      <span className="font-bold text-emerald-400">{ph.registrationReward} MBTTC</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">{t('minting_ref_reward', 'Referral Reward:')}</span>
                      <span className="font-bold text-cyan-300">{ph.referralReward} MBTTC</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">{t('minting_quantum_reward', 'Quantum S4 Reward:')}</span>
                      <span className="font-bold text-purple-300">{ph.quantumS4Reward} MBTTC</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 pt-2 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-400' : 'text-zinc-600'}`} />
                      <span>{t('minting_max_cap', 'Max Cap Threshold:')} {ph.maxUsers.toLocaleString()} {t('minting_accounts_suffix', 'Accounts')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-400' : 'text-zinc-600'}`} />
                      <span>{t('minting_bep20_dist', 'On-chain BEP-20 automated distribution')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>{t('minting_contract_state', 'Smart Contract State:')}</span>
                  <span className={isCurrent ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                    {isCurrent ? t('minting_active_live', 'Active Live Emission') : t('minting_scheduled', 'Scheduled Milestone')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Post-Phase 3 Notice Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#04121a] via-zinc-950 to-[#0e0416] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
              {t('minting_after_p3_badge', 'AFTER PHASE 3 COMPLETION')}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {t('minting_hard_cap_title', 'No More Minting • 2,000,000 MBTTC Hard Cap Reached')}
            </h3>
            <p className="text-xs text-zinc-400 max-w-2xl">
              {t('minting_hard_cap_desc', 'Upon reaching the 2,000,000 MBTTC hard ceiling, the smart contract minting functions permanently self-terminate. The protocol transitions directly into Exchange Launch Preparation across PancakeSwap, Uniswap, and Bitget.')}
            </p>
          </div>

          <div className="shrink-0 px-4 py-2 rounded-2xl bg-zinc-900 border border-zinc-700/80 text-xs font-mono text-cyan-300 font-semibold">
            {t('minting_stage_p3_followup', 'Stage: Phase 3 Follow-Up')}
          </div>
        </div>
      </div>
    </section>
  );
};
