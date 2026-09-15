import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HubModule } from '../../data/hubModulesData';
import { HubAnimatedIcon } from './HubAnimatedIcon';
import { useLanguage } from '../../context/LanguageContext';

interface HubModuleCardProps {
  module: HubModule;
  onClick: (module: HubModule) => void;
}

const getTopBarGrad = (themeName: string) => {
  switch (themeName) {
    case 'Emerald-Cyan-Aqua-Gold':
      return 'from-emerald-400 via-teal-300 to-amber-300';
    case 'Green-Teal-Cyan':
      return 'from-teal-400 via-emerald-300 to-cyan-400';
    case 'Violet-Blue-Cyan':
      return 'from-indigo-400 via-purple-300 to-cyan-400';
    case 'Gold-Amber-Orange':
      return 'from-amber-400 via-yellow-300 to-orange-400';
    case 'Purple-Magenta-Gold':
      return 'from-purple-400 via-pink-400 to-amber-300';
    case 'Emerald-Teal-Blue':
      return 'from-emerald-400 via-teal-300 to-sky-400';
    case 'Blue-Cyan-Violet':
      return 'from-sky-400 via-cyan-300 to-indigo-400';
    case 'Orange-Gold-Yellow':
      return 'from-orange-400 via-amber-300 to-yellow-400';
    case 'Cyan-Aqua-Green':
      return 'from-cyan-400 via-teal-300 to-emerald-400';
    case 'Magenta-Violet-Purple':
      return 'from-fuchsia-400 via-purple-300 to-indigo-400';
    case 'Teal-Emerald-Green':
      return 'from-teal-400 via-emerald-300 to-green-400';
    default:
      return 'from-emerald-400 via-teal-300 to-cyan-400';
  }
};

export const HubModuleCard: React.FC<HubModuleCardProps> = ({ module, onClick }) => {
  const { t } = useLanguage();
  const isLive = module.status === 'LIVE NOW';
  const { theme } = module;

  const translatedTitle = t(`hub_mod_${module.id}_title`, module.title);
  const translatedSubtitle = t(`hub_mod_${module.id}_sub`, module.subtitle);
  const translatedMetadata = t(`hub_mod_${module.id}_meta`, module.metadata);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(module)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(module);
        }
      }}
      className={`group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden cursor-pointer select-none
        transition-all duration-300 ease-out
        bg-gradient-to-b ${theme.cardBg}
        border ${theme.borderBase} ${theme.borderHover}
        shadow-[0_8px_30px_rgba(0,0,0,0.6)]
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.8)]
        hover:-translate-y-1.5 active:translate-y-0 active:scale-[0.98]
        backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
      `}
    >
      {/* 0. Top Web3 Neon Accent Highlight Bar */}
      <div 
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${getTopBarGrad(theme.name)} opacity-85 group-hover:opacity-100 transition-opacity`} 
      />

      {/* 1. Subtle inner ambient glow & radial mesh reflection */}
      <div 
        aria-hidden="true"
        className={`pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl ${theme.glowBg} group-hover:scale-125 transition-transform duration-500 ease-out motion-reduce:transition-none`} 
      />

      {/* 2. Delicate diagonal light sweep on hover */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute -inset-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out motion-reduce:transition-none" 
      />

      {/* 3. Luminous thin top-edge highlight */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:via-white/30 transition-all duration-300" 
      />

      {/* ── TOP SECTION: [PREMIUM ANIMATED ICON] [STATUS] ── */}
      <div className="relative z-10 flex items-start justify-between gap-3 mb-5">
        <div className="group-hover:scale-105 transition-transform duration-300 ease-out">
          <HubAnimatedIcon iconType={module.iconType} size="md" />
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {/* Status Badge */}
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold tracking-wider uppercase border bg-emerald-950/90 text-emerald-300 border-emerald-400/60 shadow-[0_0_16px_rgba(16,185,129,0.45)]">
              {/* Premium subtle live pulse indicator */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              </span>
              <span>{t('status_live_now', 'LIVE NOW')}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase border bg-zinc-900/80 text-zinc-400 border-zinc-700/60 group-hover:border-zinc-600 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
              <span>{t('status_launching_soon', 'LAUNCHING SOON')}</span>
            </span>
          )}

          {/* Sequence index */}
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors">
            {t('hub_card_index', { index: module.cardIndex })}
          </span>
        </div>
      </div>

      {/* ── MIDDLE SECTION: [MODULE TITLE] [Short description] ── */}
      <div className="relative z-10 space-y-2 mb-6">
        <h3 className={`text-lg sm:text-xl font-black text-white tracking-tight font-mono transition-colors duration-200 ${theme.accentText ? `group-hover:${theme.accentText}` : 'group-hover:text-emerald-300'}`}>
          {translatedTitle}
        </h3>
        <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors line-clamp-2">
          {translatedSubtitle}
        </p>
      </div>

      {/* ── BOTTOM SECTION: [MODULE / ECOSYSTEM] [→] ── */}
      <div className="relative z-10 pt-4 border-t border-zinc-800/80 group-hover:border-zinc-700/80 flex items-center justify-between gap-3 text-xs font-mono transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-zinc-600 group-hover:bg-zinc-400'} shrink-0 transition-colors`} />
          <span className="text-zinc-400 text-[11px] font-medium tracking-wide truncate group-hover:text-zinc-200 transition-colors">
            {translatedMetadata}
          </span>
        </div>

        <div className={`flex items-center gap-1 font-bold shrink-0 transition-all duration-200 ${theme.actionColor}`}>
          <span className="text-[11px] tracking-wide">{t('explore', 'Explore')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </div>
  );
};
