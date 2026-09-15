import React from 'react';
import { Sparkles, Bot, Terminal, Shield, Activity } from 'lucide-react';

interface AiProtocolGuideProps {
  tipTitle?: string;
  tipMessage: string;
  badgeLabel?: string;
  variant?: 'hero' | 'compact' | 'callout';
  themeColor?: 'emerald' | 'cyan' | 'purple' | 'amber';
}

export const AiProtocolGuide: React.FC<AiProtocolGuideProps> = ({
  tipTitle = 'PROTOCOL GUIDE INSIGHT',
  tipMessage,
  badgeLabel = 'AI MDeFi Protocol Guide',
  variant = 'hero',
  themeColor = 'emerald',
}) => {
  const getColors = () => {
    switch (themeColor) {
      case 'amber':
        return {
          glow: 'rgba(245, 158, 11, 0.25)',
          border: 'border-amber-500/40',
          bg: 'from-amber-950/40 via-yellow-950/20 to-black',
          badgeText: 'text-amber-300',
          badgeBg: 'bg-amber-950/80 border-amber-500/40',
          accent: '#f59e0b',
          visor: '#fbbf24',
          ring: 'border-amber-400/40',
        };
      case 'purple':
        return {
          glow: 'rgba(168, 85, 247, 0.25)',
          border: 'border-purple-500/40',
          bg: 'from-purple-950/40 via-fuchsia-950/20 to-black',
          badgeText: 'text-purple-300',
          badgeBg: 'bg-purple-950/80 border-purple-500/40',
          accent: '#a855f7',
          visor: '#c084fc',
          ring: 'border-purple-400/40',
        };
      case 'cyan':
        return {
          glow: 'rgba(6, 182, 212, 0.25)',
          border: 'border-cyan-500/40',
          bg: 'from-cyan-950/40 via-teal-950/20 to-black',
          badgeText: 'text-cyan-300',
          badgeBg: 'bg-cyan-950/80 border-cyan-500/40',
          accent: '#06b6d4',
          visor: '#22d3ee',
          ring: 'border-cyan-400/40',
        };
      default:
        return {
          glow: 'rgba(16, 185, 129, 0.25)',
          border: 'border-emerald-500/40',
          bg: 'from-emerald-950/40 via-teal-950/20 to-black',
          badgeText: 'text-emerald-300',
          badgeBg: 'bg-emerald-950/80 border-emerald-500/40',
          accent: '#10b981',
          visor: '#34d399',
          ring: 'border-emerald-400/40',
        };
    }
  };

  const colors = getColors();

  // Futuristic digital character SVG graphic
  const renderAvatarSvg = () => (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
      {/* Outer ambient holographic orbital rings */}
      <div 
        className={`absolute inset-0 rounded-full border border-dashed ${colors.ring} animate-[spin_16s_linear_infinite] motion-reduce:animate-none opacity-60`}
      />
      <div 
        className="absolute inset-2 rounded-full border border-white/10 animate-[spin_24s_linear_infinite_reverse] motion-reduce:animate-none opacity-40"
      />

      {/* Cybernetic Aura Halo */}
      <div 
        className="absolute inset-3 rounded-full blur-xl opacity-70 animate-pulse motion-reduce:animate-none"
        style={{ backgroundColor: colors.glow }}
      />

      {/* Vector Avatar Canvas */}
      <svg
        viewBox="0 0 140 140"
        className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-[bounce_6s_ease-in-out_infinite] motion-reduce:animate-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="suitGrad" x1="70" y1="95" x2="70" y2="140" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0f172a" />
            <stop offset="1" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="armorGrad" x1="50" y1="95" x2="90" y2="135" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e293b" />
            <stop offset="1" stopColor="#090d16" />
          </linearGradient>
          <linearGradient id="faceGrad" x1="70" y1="35" x2="70" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e293b" />
            <stop offset="0.5" stopColor="#0f172a" />
            <stop offset="1" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="visorGrad" x1="40" y1="52" x2="100" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor={colors.accent} stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="1" stopColor={colors.visor} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Ambient energy aura background */}
        <circle cx="70" cy="70" r="58" fill="#040b08" stroke={colors.accent} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 3" />

        {/* Floating particles around head */}
        <circle cx="34" cy="45" r="1.5" fill={colors.accent} className="animate-ping motion-reduce:animate-none opacity-80" />
        <circle cx="106" cy="48" r="1.5" fill={colors.visor} className="animate-ping motion-reduce:animate-none opacity-70" />
        <circle cx="95" cy="28" r="1" fill="#ffffff" />
        <circle cx="42" cy="80" r="1" fill="#ffffff" />

        {/* Cyber suit / shoulders */}
        <path
          d="M24 135 C24 105, 45 96, 70 96 C95 96, 116 105, 116 135 Z"
          fill="url(#suitGrad)"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Cyber armor chest lapel */}
        <path
          d="M44 110 L70 135 L96 110 L84 96 L70 106 L56 96 Z"
          fill="url(#armorGrad)"
          stroke={colors.accent}
          strokeWidth="1"
          strokeOpacity="0.6"
        />

        {/* MDeFi Core Power Jewel in chest */}
        <polygon
          points="70,112 76,118 70,124 64,118"
          fill={colors.accent}
          stroke="#ffffff"
          strokeWidth="0.8"
        />
        <circle cx="70" cy="118" r="2" fill="#ffffff" />

        {/* Neck */}
        <rect x="62" y="82" width="16" height="18" rx="3" fill="#090d16" stroke="#1e293b" strokeWidth="1" />
        <line x1="65" y1="88" x2="75" y2="88" stroke={colors.accent} strokeWidth="0.75" strokeOpacity="0.7" />
        <line x1="65" y1="92" x2="75" y2="92" stroke={colors.accent} strokeWidth="0.75" strokeOpacity="0.7" />

        {/* Head / Jaw Base */}
        <path
          d="M46 50 C46 32, 56 22, 70 22 C84 22, 94 32, 94 50 C94 68, 84 84, 70 86 C56 84, 46 68, 46 50 Z"
          fill="url(#faceGrad)"
          stroke="#334155"
          strokeWidth="1.2"
        />

        {/* Cybernetic Neural Crest (Hair / Interface crest) */}
        <path
          d="M52 30 C58 20, 82 20, 88 30 C82 24, 58 24, 52 30 Z"
          fill={colors.accent}
          opacity="0.8"
        />
        <path
          d="M70 18 L70 26"
          stroke={colors.accent}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Holographic Eyewear / Luminous Visor */}
        <path
          d="M44 48 C44 45, 96 45, 96 48 L93 60 C93 64, 70 66, 70 66 C70 66, 47 64, 47 60 Z"
          fill="url(#visorGrad)"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.95"
        />

        {/* Visor Scan Line Reflection */}
        <path
          d="M49 51 L91 51"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="58" cy="55" r="1.5" fill="#040b08" opacity="0.6" />
        <circle cx="82" cy="55" r="1.5" fill="#040b08" opacity="0.6" />

        {/* Audio / Neural Node Headset Pods */}
        <rect x="40" y="48" width="5" height="16" rx="2" fill="#020617" stroke={colors.accent} strokeWidth="1" />
        <rect x="95" y="48" width="5" height="16" rx="2" fill="#020617" stroke={colors.accent} strokeWidth="1" />
        <circle cx="42.5" cy="56" r="1.5" fill={colors.accent} />
        <circle cx="97.5" cy="56" r="1.5" fill={colors.accent} />

        {/* Subtle Lip / Expression Line */}
        <line x1="64" y1="74" x2="76" y2="74" stroke="#475569" strokeWidth="1" strokeLinecap="round" />
        <path d="M68 79 L72 79" stroke={colors.accent} strokeWidth="1" strokeOpacity="0.8" />
      </svg>
    </div>
  );

  if (variant === 'compact') {
    return (
      <div className={`rounded-2xl p-4 bg-gradient-to-r ${colors.bg} border ${colors.border} shadow-lg backdrop-blur-xl flex items-center gap-4`}>
        <div className="shrink-0 relative">
          <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Bot className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${colors.badgeBg} ${colors.badgeText}`}>
              {badgeLabel}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Visual Protocol Guide</span>
          </div>
          <p className="text-xs text-zinc-300 font-sans leading-relaxed">
            {tipMessage}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'callout') {
    return (
      <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-br ${colors.bg} border ${colors.border} shadow-md backdrop-blur-md`}>
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <Terminal className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${colors.badgeText}`}>
                {tipTitle}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase">
                {badgeLabel}
              </span>
            </div>
            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              {tipMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Hero variant (Desktop: Right side of Hero, Mobile: Clean responsive panel)
  return (
    <div className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br ${colors.bg} border ${colors.border} shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300`}>
      {/* Atmospheric corner highlights */}
      <div 
        className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-40"
        style={{ backgroundColor: colors.glow }}
      />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
        {/* Futuristic Avatar Graphic */}
        {renderAvatarSvg()}

        {/* Speech / Information Bubble */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider ${colors.badgeBg} ${colors.badgeText} shadow-sm`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>{badgeLabel}</span>
            </span>

            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950/80 px-2.5 py-0.5 rounded-full border border-zinc-800">
              Protocol Guide Insight
            </span>
          </div>

          <h4 className="text-sm font-mono font-bold text-white tracking-wide flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{tipTitle}</span>
          </h4>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans max-w-lg">
            {tipMessage}
          </p>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-center sm:justify-start gap-2 text-[10px] font-mono text-zinc-500">
            <Shield className="w-3 h-3 text-emerald-400/70" />
            <span>Visual educational guide only • No financial guarantees</span>
          </div>
        </div>
      </div>
    </div>
  );
};
