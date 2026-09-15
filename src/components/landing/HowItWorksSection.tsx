import React from 'react';
import { 
  Wallet, 
  UserCheck, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HowItWorksSectionProps {
  onRegisterClick: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onRegisterClick }) => {
  const { t } = useLanguage();
  const steps = [
    {
      step: '01',
      titleKey: 'hiw_step1_title',
      titleDefault: 'Connect Web3 Wallet',
      descKey: 'hiw_step1_desc',
      descDefault: 'Connect your decentralized BEP-20 wallet (MetaMask, Trust Wallet, Binance Web3 Wallet) on BNB Smart Chain.',
      icon: Wallet,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
    {
      step: '02',
      titleKey: 'hiw_step2_title',
      titleDefault: 'Upline Verification',
      descKey: 'hiw_step2_desc',
      descDefault: 'Register under your sponsor ID or automatically attach to the configured MDeFi Admin ID for instant placement.',
      icon: UserCheck,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
    },
    {
      step: '03',
      titleKey: 'hiw_step3_title',
      titleDefault: 'System Approvals',
      descKey: 'hiw_step3_desc',
      descDefault: 'Authorize the MDeFi Hub smart contract and token approval with one transparent cryptographic confirmation.',
      icon: ShieldCheck,
      color: 'text-purple-400',
      border: 'border-purple-500/30',
    },
    {
      step: '04',
      titleKey: 'hiw_step4_title',
      titleDefault: 'Activate & Earn',
      descKey: 'hiw_step4_desc',
      descDefault: 'Activate your S4 Junior or Senior node, unlock direct spillover matrix trees, and claim 4-hour MBTTC airdrops.',
      icon: Zap,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 web3-icon-glyph" />
            <span>{t('hiw_badge', 'Seamless Web3 Onboarding')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('hiw_title', 'How It Works')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {t('hiw_desc', 'Four streamlined steps to activate your non-custodial decentralized matrix account and join the MDeFi global network.')}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className={`relative rounded-3xl p-6 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-[#060b08] border ${st.border} flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-transform duration-300 shadow-lg`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-zinc-600">
                      {st.step}
                    </span>
                    <div className={`web3-icon-badge p-2.5 rounded-xl bg-zinc-950 border border-white/10 ${st.color}`}>
                      <Icon className="w-5 h-5 web3-icon-glyph" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {t(st.titleKey, st.titleDefault)}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {t(st.descKey, st.descDefault)}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-900 flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{t('hiw_automated', 'Automated On-Chain')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="text-center pt-4">
          <button
            onClick={onRegisterClick}
            className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{t('btn_get_started', 'GET STARTED NOW')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
