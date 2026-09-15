import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Lock, 
  UserPlus, 
  LogIn, 
  Coins 
} from 'lucide-react';
import { MbttcCoin3D } from '../MbttcCoin3D';
import { useLanguage } from '../../context/LanguageContext';

interface FinalRegistrationCtaProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

export const FinalRegistrationCta: React.FC<FinalRegistrationCtaProps> = ({
  onRegisterClick,
  onLoginClick,
}) => {
  const { t } = useLanguage();
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-[#081a11] via-[#05110a] to-[#020704] border-2 border-emerald-500/40 shadow-[0_0_80px_rgba(16,185,129,0.25)] overflow-hidden text-center space-y-8">
          
          {/* Ambient Cosmic Lights */}
          <div className="absolute -top-20 left-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Center 3D Coin Asset */}
          <div className="relative z-10 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/25 rounded-full blur-2xl pointer-events-none" />
              <MbttcCoin3D 
                size="lg" 
                interactive={true} 
                autoRotate={true} 
                glow={true} 
                className="drop-shadow-[0_15px_35px_rgba(16,185,129,0.4)]"
              />
            </div>
          </div>

          {/* Heading & Copy */}
          <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-3.5 h-3.5 web3-icon-glyph" />
              <span>{t('final_cta_badge', 'Decentralized Web3 Gateway')}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {t('final_cta_title', 'START YOUR MDEFI JOURNEY')}
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl mx-auto">
              {t('final_cta_desc', 'Connect your Web3 wallet and enter the MDeFi ecosystem. Activate the S4 node, claim 4-hour MBTTC airdrops, and build your decentralized matrix today.')}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto pt-2">
            <button
              onClick={onRegisterClick}
              className="w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <UserPlus className="w-4 h-4 web3-icon-glyph" />
              <span>{t('btn_register', 'REGISTER NOW')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onLoginClick}
              className="w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider text-zinc-200 hover:text-white bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-700/80 hover:border-emerald-500/50 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 web3-icon-glyph" />
              <span>{t('btn_login', 'LOGIN')}</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="relative z-10 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 web3-icon-glyph" />
              <span>{t('final_cta_non_custodial', '100% Non-Custodial')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400 web3-icon-glyph" />
              <span>{t('final_cta_instant', 'Instant On-Chain Approvals')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-400 web3-icon-glyph" />
              <span>{t('final_cta_audited', 'Audited Smart Contracts')}</span>
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
