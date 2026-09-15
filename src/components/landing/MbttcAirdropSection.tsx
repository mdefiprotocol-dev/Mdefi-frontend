import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { MbttcCoin3D } from '../MbttcCoin3D';
import { useLanguage } from '../../context/LanguageContext';

interface MbttcAirdropSectionProps {
  onClaimClick: () => void;
}

export const MbttcAirdropSection: React.FC<MbttcAirdropSectionProps> = ({ onClaimClick }) => {
  const { t } = useLanguage();
  // Live ticking 4-hour countdown simulator
  const [timeLeft, setTimeLeft] = useState(14400); // 4 hours in seconds (4 * 3600)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 14400; // loop 4h cycle
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-[#081a11] via-[#05110a] to-[#030906] border-2 border-emerald-500/40 shadow-[0_0_70px_rgba(16,185,129,0.18)] overflow-hidden text-center space-y-8">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="space-y-3 relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 web3-icon-glyph" />
              <span>{t('airdrop_window', 'Community Distribution Window')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {t('airdrop_title', 'MBTTC Airdrop')}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300">
              {t('airdrop_desc', 'Claim every 4 hours. Automated on-chain distribution mechanism designed to reward active participants and distribute initial MBTTC ecosystem tokens.')}
            </p>
          </div>

          {/* Live 4-Hour Countdown Clock Box */}
          <div className="relative z-10 inline-block p-6 sm:p-8 rounded-3xl bg-zinc-950/85 border border-emerald-500/30 shadow-2xl backdrop-blur-xl max-w-md w-full mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-2 flex items-center justify-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400 web3-icon-glyph" />
              <span>{t('airdrop_next_window', 'NEXT CLAIM WINDOW')}</span>
            </span>

            {/* Countdown Digits */}
            <div className="py-2">
              <span className="text-4xl sm:text-6xl font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 drop-shadow-[0_0_25px_rgba(16,185,129,0.45)]">
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="text-[11px] text-zinc-400 mt-2 font-mono flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('airdrop_sync', 'Synchronized with BNB Smart Chain block time')}</span>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={onClaimClick}
                className="w-full py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Coins className="w-4 h-4 web3-icon-glyph" />
                <span>{t('airdrop_claim_btn', 'CLAIM MBTTC')}</span>
              </button>
            </div>
          </div>

          {/* Eligibility Note */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 web3-icon-glyph" />
              <span>{t('airdrop_eligible', 'Registered Accounts Eligible')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 web3-icon-glyph" />
              <span>{t('airdrop_rate_limit', 'Anti-Bot Cryptographic Rate Limit')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400 web3-icon-glyph" />
              <span>{t('airdrop_zero_lock', 'Zero Protocol Lockups')}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
