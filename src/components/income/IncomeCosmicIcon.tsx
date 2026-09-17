import React from 'react';
import { 
  Share2, 
  Layers, 
  Gem, 
  Atom, 
  Cpu, 
  Sparkles, 
  Flame, 
  Asterisk, 
  Orbit, 
  Moon, 
  Sun, 
  Diamond, 
  Crown, 
  Activity 
} from 'lucide-react';
import { IncomeCategoryItem } from '../../types/income';

interface IncomeCosmicIconProps {
  iconType: IncomeCategoryItem['iconType'];
  accentColor: IncomeCategoryItem['accentColor'];
  highlight?: boolean;
}

export const IncomeCosmicIcon: React.FC<IncomeCosmicIconProps> = ({
  iconType,
  accentColor,
  highlight = false,
}) => {
  // Container styling mapped to sophisticated Web3 cyber-palette
  const colorMap = {
    emerald: {
      container: 'bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      iconText: 'text-emerald-400',
      ringColor: 'stroke-emerald-400',
      fillColor: 'fill-emerald-400',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    },
    cyan: {
      container: 'bg-cyan-950/40 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)]',
      iconText: 'text-cyan-400',
      ringColor: 'stroke-cyan-400',
      fillColor: 'fill-cyan-400',
      glow: 'shadow-[0_0_12px_rgba(6,182,212,0.5)]',
    },
    purple: {
      container: 'bg-purple-950/40 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.2)]',
      iconText: 'text-purple-400',
      ringColor: 'stroke-purple-400',
      fillColor: 'fill-purple-400',
      glow: 'shadow-[0_0_12px_rgba(168,85,247,0.5)]',
    },
    blue: {
      container: 'bg-blue-950/40 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.2)]',
      iconText: 'text-blue-400',
      ringColor: 'stroke-blue-400',
      fillColor: 'fill-blue-400',
      glow: 'shadow-[0_0_12px_rgba(59,130,246,0.5)]',
    },
    amber: {
      container: 'bg-amber-950/40 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      iconText: 'text-amber-400',
      ringColor: 'stroke-amber-400',
      fillColor: 'fill-amber-400',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    },
    gold: {
      container: 'bg-yellow-950/40 border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.2)]',
      iconText: 'text-yellow-300',
      ringColor: 'stroke-yellow-400',
      fillColor: 'fill-yellow-300',
      glow: 'shadow-[0_0_12px_rgba(234,179,8,0.5)]',
    },
    teal: {
      container: 'bg-teal-950/40 border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.2)]',
      iconText: 'text-teal-400',
      ringColor: 'stroke-teal-400',
      fillColor: 'fill-teal-400',
      glow: 'shadow-[0_0_12px_rgba(20,184,166,0.5)]',
    },
    fuchsia: {
      container: 'bg-fuchsia-950/40 border-fuchsia-500/40 shadow-[0_0_20px_rgba(217,70,239,0.2)]',
      iconText: 'text-fuchsia-400',
      ringColor: 'stroke-fuchsia-400',
      fillColor: 'fill-fuchsia-400',
      glow: 'shadow-[0_0_12px_rgba(217,70,239,0.5)]',
    },
    rose: {
      container: 'bg-rose-950/40 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.2)]',
      iconText: 'text-rose-400',
      ringColor: 'stroke-rose-400',
      fillColor: 'fill-rose-400',
      glow: 'shadow-[0_0_12px_rgba(244,63,94,0.5)]',
    },
  }[accentColor] || {
    container: 'bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    iconText: 'text-emerald-400',
    ringColor: 'stroke-emerald-400',
    fillColor: 'fill-emerald-400',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
  };

  const renderIconGraphic = () => {
    switch (iconType) {
      case 's4_network':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 56 56">
              {/* Connecting node network links */}
              <line x1="14" y1="14" x2="28" y2="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className={`${colorMap.ringColor} opacity-50`} />
              <line x1="42" y1="14" x2="28" y2="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className={`${colorMap.ringColor} opacity-50`} />
              <line x1="28" y1="42" x2="28" y2="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className={`${colorMap.ringColor} opacity-50`} />
              {/* Pulsing micro-nodes */}
              <circle cx="14" cy="14" r="2.5" className={`${colorMap.fillColor} animate-ping motion-reduce:animate-none opacity-40`} />
              <circle cx="14" cy="14" r="2" className={colorMap.fillColor} />
              <circle cx="42" cy="14" r="2" className={colorMap.fillColor} />
              <circle cx="28" cy="42" r="2" className={colorMap.fillColor} />
            </svg>
            <Share2 className={`w-6 h-6 ${colorMap.iconText} drop-shadow-[0_0_8px_currentColor] z-10`} />
          </div>
        );

      case 's4_junior_matrix':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_16s_linear_infinite] motion-reduce:animate-none" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" strokeWidth="1" strokeDasharray="3 4" className={`${colorMap.ringColor} opacity-40`} />
              <circle cx="28" cy="6" r="2.5" className={colorMap.fillColor} />
              <circle cx="28" cy="50" r="1.5" className={colorMap.fillColor} />
            </svg>
            <Layers className={`w-6 h-6 ${colorMap.iconText} drop-shadow-[0_0_8px_currentColor] z-10`} />
          </div>
        );

      case 's4_senior_matrix':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_12s_linear_infinite_reverse] motion-reduce:animate-none" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="23" fill="none" strokeWidth="1.2" strokeDasharray="6 4" className={`${colorMap.ringColor} opacity-50`} />
              <rect x="26" y="3" width="4" height="4" transform="rotate(45 28 5)" className={colorMap.fillColor} />
              <rect x="26" y="47" width="4" height="4" transform="rotate(45 28 49)" className={colorMap.fillColor} />
            </svg>
            <Gem className={`w-6 h-6 ${colorMap.iconText} drop-shadow-[0_0_10px_currentColor] z-10 animate-pulse motion-reduce:animate-none`} />
          </div>
        );

      case 'quantum_atom':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 56 56">
              <ellipse cx="28" cy="28" rx="22" ry="9" fill="none" strokeWidth="1" strokeDasharray="3 3" transform="rotate(30 28 28)" className={`${colorMap.ringColor} opacity-50`} />
              <ellipse cx="28" cy="28" rx="22" ry="9" fill="none" strokeWidth="1" strokeDasharray="3 3" transform="rotate(-30 28 28)" className={`${colorMap.ringColor} opacity-50`} />
            </svg>
            <Atom className={`w-6 h-6 ${colorMap.iconText} drop-shadow-[0_0_8px_currentColor] z-10 animate-[spin_20s_linear_infinite] motion-reduce:animate-none`} />
          </div>
        );

      case 'quantum_matrix':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 56 56">
              {/* Luminous Matrix Grid Dots */}
              <circle cx="12" cy="12" r="1.5" className={`${colorMap.fillColor} opacity-40 animate-pulse`} />
              <circle cx="28" cy="10" r="1.5" className={`${colorMap.fillColor} opacity-70`} />
              <circle cx="44" cy="12" r="1.5" className={`${colorMap.fillColor} opacity-40 animate-pulse`} />
              <circle cx="10" cy="28" r="1.5" className={`${colorMap.fillColor} opacity-60`} />
              <circle cx="46" cy="28" r="1.5" className={`${colorMap.fillColor} opacity-60`} />
              <circle cx="12" cy="44" r="1.5" className={`${colorMap.fillColor} opacity-40`} />
              <circle cx="28" cy="46" r="1.5" className={`${colorMap.fillColor} opacity-70 animate-pulse`} />
              <circle cx="44" cy="44" r="1.5" className={`${colorMap.fillColor} opacity-40`} />
            </svg>
            <Cpu className={`w-6 h-6 ${colorMap.iconText} drop-shadow-[0_0_8px_currentColor] z-10`} />
          </div>
        );

      case 'magic_star':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_10s_linear_infinite] motion-reduce:animate-none" viewBox="0 0 56 56">
              <path d="M28 8 L30 20 L42 22 L31 28 L35 40 L28 32 L21 40 L25 28 L14 22 L26 20 Z" fill="none" stroke="currentColor" strokeWidth="0.8" className={`${colorMap.ringColor} opacity-30`} />
              <circle cx="10" cy="18" r="1.5" className={`${colorMap.fillColor} animate-ping opacity-50`} />
              <circle cx="46" cy="38" r="1.5" className={`${colorMap.fillColor} animate-ping opacity-50`} />
            </svg>
            <Sparkles className={`w-6 h-6 ${colorMap.iconText} drop-shadow-[0_0_10px_currentColor] z-10 animate-bounce motion-reduce:animate-none`} style={{ animationDuration: '3s' }} />
          </div>
        );

      case 'magic_crystal':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_24s_linear_infinite] motion-reduce:animate-none" viewBox="0 0 56 56">
              <polygon points="28,8 44,20 44,36 28,48 12,36 12,20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className={`${colorMap.ringColor} opacity-40`} />
            </svg>
            <Flame className={`w-6 h-6 ${colorMap.iconText} drop-shadow-[0_0_10px_currentColor] z-10 animate-pulse motion-reduce:animate-none`} />
          </div>
        );

      case 'nexus_star':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 56 56">
              <line x1="28" y1="8" x2="28" y2="48" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" className={`${colorMap.ringColor} opacity-40`} />
              <line x1="8" y1="28" x2="48" y2="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" className={`${colorMap.ringColor} opacity-40`} />
              <line x1="14" y1="14" x2="42" y2="42" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" className={`${colorMap.ringColor} opacity-40`} />
              <line x1="14" y1="42" x2="42" y2="14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" className={`${colorMap.ringColor} opacity-40`} />
            </svg>
            <Asterisk className={`w-6 h-6 ${colorMap.iconText} drop-shadow-[0_0_10px_currentColor] z-10 animate-[spin_14s_linear_infinite] motion-reduce:animate-none`} />
          </div>
        );

      case 'nexus_generation':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="16" fill="none" strokeWidth="1" strokeDasharray="4 2" className={`${colorMap.ringColor} opacity-50 animate-[spin_10s_linear_infinite]`} />
              <circle cx="28" cy="28" r="23" fill="none" strokeWidth="1" strokeDasharray="2 4" className={`${colorMap.ringColor} opacity-40 animate-[spin_16s_linear_infinite_reverse]`} />
            </svg>
            <Orbit className={`w-6 h-6 ${colorMap.iconText} drop-shadow-[0_0_8px_currentColor] z-10`} />
          </div>
        );

      case 'magic_moon':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_18s_linear_infinite] motion-reduce:animate-none" viewBox="0 0 56 56">
              <ellipse cx="28" cy="28" rx="22" ry="14" fill="none" strokeWidth="1" strokeDasharray="3 3" transform="rotate(-25 28 28)" className={`${colorMap.ringColor} opacity-40`} />
              <circle cx="48" cy="22" r="2" className={`${colorMap.fillColor} drop-shadow-[0_0_6px_currentColor]`} />
              <circle cx="8" cy="34" r="1.5" className={`${colorMap.fillColor} opacity-60`} />
            </svg>
            <Moon className={`w-6 h-6 ${colorMap.iconText} drop-shadow-[0_0_10px_currentColor] z-10`} />
          </div>
        );

      case 'weekly_starter_sun':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 56 56">
              {/* Upward sunrise ray aura */}
              <path d="M12 40 Q28 10 44 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" className={`${colorMap.ringColor} opacity-50`} />
              <circle cx="28" cy="18" r="2" className={`${colorMap.fillColor} animate-ping opacity-30`} />
            </svg>
            <Sun className={`w-6 h-6 ${colorMap.iconText} drop-shadow-[0_0_12px_currentColor] z-10 animate-[spin_24s_linear_infinite] motion-reduce:animate-none`} />
          </div>
        );

      case 'weekly_premium_diamond':
        return (
          <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" strokeWidth="1" strokeDasharray="4 4" className={`${colorMap.ringColor} opacity-40 animate-[spin_14s_linear_infinite]`} />
            </svg>
            {/* Diagonal light sweep bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
            <Diamond className={`w-6 h-6 ${colorMap.iconText} drop-shadow-[0_0_12px_currentColor] z-10`} />
          </div>
        );

      case 'weekly_salary_crown':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 56 56">
              {/* Ascending regal energy particles */}
              <circle cx="20" cy="46" r="1.5" className={`${colorMap.fillColor} opacity-60 animate-pulse`} />
              <circle cx="28" cy="44" r="1.5" className={`${colorMap.fillColor} opacity-80`} />
              <circle cx="36" cy="46" r="1.5" className={`${colorMap.fillColor} opacity-60 animate-pulse`} />
              <circle cx="28" cy="12" r="2" className={`${colorMap.fillColor} animate-ping opacity-40`} />
            </svg>
            <Crown className={`w-6 h-6 ${colorMap.iconText} drop-shadow-[0_0_12px_currentColor] z-10`} />
          </div>
        );

    
      default:
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 56 56">
              {/* Multi-ring cosmic solar orbit */}
              <circle cx="28" cy="28" r="23" fill="none" strokeWidth="1.2" strokeDasharray="4 3" className="stroke-emerald-400 opacity-60 animate-[spin_12s_linear_infinite]" />
              <circle cx="28" cy="28" r="17" fill="none" strokeWidth="1" strokeDasharray="3 4" className="stroke-cyan-400 opacity-60 animate-[spin_8s_linear_infinite_reverse]" />
              <circle cx="28" cy="5" r="2.5" className="fill-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <circle cx="28" cy="45" r="2" className="fill-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </svg>
            <Activity className="w-7 h-7 text-emerald-300 drop-shadow-[0_0_14px_rgba(16,185,129,0.8)] z-10 animate-pulse" />
          </div>
        );
    }
  };

  return (
    <div className={`relative ${highlight ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-13 h-13 sm:w-14 sm:h-14'} rounded-2xl flex items-center justify-center border backdrop-blur-xl transition-all duration-300 ${colorMap.container}`}>
      {renderIconGraphic()}
    </div>
  );
};
