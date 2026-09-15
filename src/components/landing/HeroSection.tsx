import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Coins 
} from 'lucide-react';
import { MbttcCoin3D } from '../MbttcCoin3D';
import { programPhaseService } from '../../services/programPhaseService';
import { useLanguage } from '../../context/LanguageContext';

interface HeroSectionProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRegisterClick,
  onLoginClick,
  onExploreClick,
}) => {
  const { t } = useLanguage();
  const currentPhase = programPhaseService.getCurrentPhase();

  return (
    <section id="hero" className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Hero Narrative & Call-to-Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Live Web3 Protocol Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/35 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono font-bold tracking-wide text-emerald-300 uppercase">
                {t('hero_badge', `Phase ${currentPhase} Live • Registration Open • BNB Smart Chain`)}
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
                  MDeFi
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_35px_rgba(16,185,129,0.35)]">
                  {t('hero_heading_accent', 'Decentralized Matrix')}
                </span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-300 mt-1 font-mono">
                  {t('hero_heading_sub', '& Reward Ecosystem')}
                </span>
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('hero_desc', 'MDeFi unites next-generation decentralized matrix smart contracts with algorithmic staking incentives. Powered natively by the Magnet Bitcoin Token (MBTTC) across phased protocol modules.')}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
              <button
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_35px_rgba(16,185,129,0.45)] hover:shadow-[0_0_50px_rgba(16,185,129,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>{t('btn_register', 'REGISTER NOW')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onLoginClick}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider text-zinc-200 hover:text-white bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-700/80 hover:border-emerald-500/50 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('btn_login', 'LOGIN')}</span>
              </button>

              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl font-semibold text-xs tracking-wider text-zinc-400 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400 web3-icon-glyph" />
                <span>{t('hero_explore_ecosystem', 'EXPLORE ECOSYSTEM')}</span>
              </button>
            </div>

            {/* Key Trust Telemetry Indicators */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-emerald-500/15 text-center">
                <span className="text-base sm:text-xl font-black font-mono text-emerald-400 block">100%</span>
                <span className="text-[10px] text-zinc-400 font-medium">{t('hero_non_custodial', 'Non-Custodial')}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-cyan-500/15 text-center">
                <span className="text-base sm:text-xl font-black font-mono text-cyan-300 block">4 Hours</span>
                <span className="text-[10px] text-zinc-400 font-medium">{t('hero_airdrop_cycle', 'Airdrop Cycle')}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-purple-500/15 text-center">
                <span className="text-base sm:text-xl font-black font-mono text-purple-300 block">2,000,000</span>
                <span className="text-[10px] text-zinc-400 font-medium">{t('hero_max_mint', 'Max MBTTC Mint')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D MBTTC Coin Representation with Orbital Energy Waves (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Cosmic Planetary Glow Behind Coin */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Orbital Rings */}
            <div className="absolute w-[300px] sm:w-[380px] h-[300px] sm:h-[380px] rounded-full border border-emerald-500/20 pointer-events-none animate-spin" style={{ animationDuration: '32s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            </div>
            <div className="absolute w-[240px] sm:w-[310px] h-[240px] sm:h-[310px] rounded-full border border-cyan-500/25 pointer-events-none animate-spin" style={{ animationDuration: '24s', animationDirection: 'reverse' }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            </div>
            <div className="absolute w-[180px] sm:w-[230px] h-[180px] sm:h-[230px] rounded-full border border-purple-500/20 pointer-events-none animate-spin" style={{ animationDuration: '18s' }}>
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
            </div>

            {/* Interactive 3D MBTTC Coin */}
            <div className="relative z-10 py-6 sm:py-8 flex flex-col items-center">
              <div className="cursor-grab active:cursor-grabbing hover:scale-105 transition-transform duration-300">
                <MbttcCoin3D 
                  size="hero" 
                  interactive={true} 
                  autoRotate={true} 
                  glow={true} 
                  className="drop-shadow-[0_20px_45px_rgba(16,185,129,0.35)]"
                />
              </div>

              {/* Coin Meta Tag */}
              <div className="mt-6 px-4 py-2 rounded-full bg-zinc-950/80 border border-emerald-500/30 backdrop-blur-md text-center shadow-lg">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-emerald-400 web3-icon-glyph" />
                  <span>Magnet Bitcoin Token (MBTTC)</span>
                </span>
                <span className="text-[10px] text-zinc-400 block font-mono">
                  {t('hero_coin_rotation_tag', '3D Continuous Physical Milled Rotation')}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
