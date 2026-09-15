import React from 'react';
import { 
  UserPlus, 
  Package, 
  Coins, 
  TrendingUp, 
  GitFork, 
  Gift, 
  Crown, 
  Wallet, 
  BadgeCheck, 
  Clock, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { EcosystemActivity, EcosystemActivityType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export interface CompactActivityRowProps {
  activity: EcosystemActivity;
  reducedMotion?: boolean;
  variant?: 'public' | 'dashboard';
  className?: string;
}

export interface CompactActivityPairProps {
  activities: EcosystemActivity[];
  reducedMotion?: boolean;
  variant?: 'public' | 'dashboard';
  className?: string;
}

interface ActivityVisualConfig {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  glowColor: string;
  amountColor: string;
  typeBadgeBg: string;
  typeBadgeText: string;
  typeBadgeBorder: string;
  typeLabel: string;
}

const getActivityVisualConfig = (type: EcosystemActivityType): ActivityVisualConfig => {
  switch (type) {
    case 'REGISTRATION':
      return {
        icon: UserPlus,
        iconBg: 'bg-emerald-950/80',
        iconBorder: 'border-emerald-500/40',
        iconColor: 'text-emerald-400',
        glowColor: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
        amountColor: 'text-emerald-300',
        typeBadgeBg: 'bg-emerald-950/70',
        typeBadgeText: 'text-emerald-300',
        typeBadgeBorder: 'border-emerald-500/30',
        typeLabel: 'REGISTRATION',
      };
    case 'PACKAGE':
      return {
        icon: Package,
        iconBg: 'bg-cyan-950/80',
        iconBorder: 'border-cyan-500/40',
        iconColor: 'text-cyan-400',
        glowColor: 'shadow-[0_0_12px_rgba(6,182,212,0.25)]',
        amountColor: 'text-cyan-300',
        typeBadgeBg: 'bg-cyan-950/70',
        typeBadgeText: 'text-cyan-300',
        typeBadgeBorder: 'border-cyan-500/30',
        typeLabel: 'PACKAGE',
      };
    case 'MBTTC_CREDIT':
      return {
        icon: Coins,
        iconBg: 'bg-emerald-950/80',
        iconBorder: 'border-emerald-500/40',
        iconColor: 'text-emerald-400',
        glowColor: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
        amountColor: 'text-emerald-300',
        typeBadgeBg: 'bg-emerald-950/70',
        typeBadgeText: 'text-emerald-300',
        typeBadgeBorder: 'border-emerald-500/30',
        typeLabel: 'MBTTC CREDIT',
      };
    case 'MBTTC_CLAIM':
      return {
        icon: BadgeCheck,
        iconBg: 'bg-teal-950/80',
        iconBorder: 'border-teal-500/40',
        iconColor: 'text-teal-300',
        glowColor: 'shadow-[0_0_12px_rgba(20,184,166,0.25)]',
        amountColor: 'text-teal-300',
        typeBadgeBg: 'bg-teal-950/70',
        typeBadgeText: 'text-teal-300',
        typeBadgeBorder: 'border-teal-500/30',
        typeLabel: 'MBTTC CLAIM',
      };
    case 'DIRECT_INCOME':
      return {
        icon: TrendingUp,
        iconBg: 'bg-emerald-950/80',
        iconBorder: 'border-emerald-500/40',
        iconColor: 'text-emerald-400',
        glowColor: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
        amountColor: 'text-emerald-300',
        typeBadgeBg: 'bg-emerald-950/70',
        typeBadgeText: 'text-emerald-300',
        typeBadgeBorder: 'border-emerald-500/30',
        typeLabel: 'DIRECT INCOME',
      };
    case 'MATRIX_INCOME':
      return {
        icon: GitFork,
        iconBg: 'bg-purple-950/80',
        iconBorder: 'border-purple-500/40',
        iconColor: 'text-purple-400',
        glowColor: 'shadow-[0_0_12px_rgba(168,85,247,0.25)]',
        amountColor: 'text-purple-300',
        typeBadgeBg: 'bg-purple-950/70',
        typeBadgeText: 'text-purple-300',
        typeBadgeBorder: 'border-purple-500/30',
        typeLabel: 'MATRIX',
      };
    case 'WEEKLY_REWARD':
      return {
        icon: Gift,
        iconBg: 'bg-amber-950/80',
        iconBorder: 'border-amber-500/40',
        iconColor: 'text-amber-400',
        glowColor: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
        amountColor: 'text-amber-300 font-bold',
        typeBadgeBg: 'bg-amber-950/70',
        typeBadgeText: 'text-amber-300',
        typeBadgeBorder: 'border-amber-500/30',
        typeLabel: 'WEEKLY REWARD',
      };
    case 'WEEKLY_SALARY':
      return {
        icon: Crown,
        iconBg: 'bg-yellow-950/80',
        iconBorder: 'border-yellow-500/40',
        iconColor: 'text-yellow-400',
        glowColor: 'shadow-[0_0_12px_rgba(234,179,8,0.25)]',
        amountColor: 'text-yellow-300 font-bold',
        typeBadgeBg: 'bg-yellow-950/70',
        typeBadgeText: 'text-yellow-300',
        typeBadgeBorder: 'border-yellow-500/30',
        typeLabel: 'WEEKLY SALARY',
      };
    case 'CLAIM':
    default:
      return {
        icon: Wallet,
        iconBg: 'bg-blue-950/80',
        iconBorder: 'border-blue-500/40',
        iconColor: 'text-blue-300',
        glowColor: 'shadow-[0_0_12px_rgba(59,130,246,0.25)]',
        amountColor: 'text-blue-300',
        typeBadgeBg: 'bg-blue-950/70',
        typeBadgeText: 'text-blue-300',
        typeBadgeBorder: 'border-blue-500/30',
        typeLabel: 'CLAIM',
      };
  }
};

/**
 * Single Transaction Activity Item
 * Strictly preserves:
 * 1. Activity icon
 * 2. Activity title
 * 3. Short description (collapses/truncates if space is constrained)
 * 4. Amount / status (never removed)
 * 5. Masked member identifier (e.g. ••••4821)
 * 6. Relative timestamp
 */
export const CompactActivityItem: React.FC<{
  activity: EcosystemActivity;
  reducedMotion?: boolean;
  variant?: 'public' | 'dashboard';
  isNested?: boolean;
}> = ({
  activity,
  reducedMotion = false,
  variant = 'public',
  isNested = false,
}) => {
  const config = getActivityVisualConfig(activity.type);
  const IconComp = config.icon;

  return (
    <div className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3.5 min-w-0 w-full max-w-full transition-colors p-2.5 sm:p-3.5 ${
      isNested ? 'hover:bg-zinc-900/40' : ''
    }`}>
      {/* Top / Left Column: Icon + Core Metadata */}
      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1 w-full sm:w-auto">
        {/* Animated Visual Icon Container */}
        <div className="relative shrink-0 mt-0.5 sm:mt-0">
          <div 
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border ${config.iconBg} ${config.iconBorder} flex items-center justify-center ${config.iconColor} ${config.glowColor} transition-transform duration-200 group-hover:scale-105`}
          >
            <IconComp className={`w-4 h-4 ${reducedMotion ? '' : 'transition-transform group-hover:rotate-6'}`} />
          </div>

          {/* Status dot */}
          {activity.status === 'Confirmed' ? (
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
          ) : (
            <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-zinc-950 ${reducedMotion ? '' : 'animate-pulse'}`} />
          )}
        </div>

        {/* Title, Subtitle, & Member Metadata */}
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
            <span className="text-xs sm:text-sm font-bold text-zinc-100 tracking-tight group-hover:text-white transition-colors truncate max-w-full">
              {activity.title}
            </span>

            {/* Type Chip */}
            <span className={`hidden sm:inline-block text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border shrink-0 ${config.typeBadgeBg} ${config.typeBadgeBorder} ${config.typeBadgeText}`}>
              {config.typeLabel}
            </span>
          </div>

          {/* Collapsible description prioritizing vertical space */}
          <p className="text-[11px] sm:text-xs text-zinc-400 truncate max-w-full">
            {activity.description}
          </p>

          {/* Masked Member and Relative Timestamp */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono text-zinc-500 pt-0.5 flex-wrap min-w-0">
            <span className="text-zinc-400 font-medium shrink-0">
              {activity.member}
            </span>
            <span className="text-zinc-600 shrink-0">·</span>
            <span className="flex items-center gap-1 text-zinc-400 shrink-0">
              <Clock className="w-2.5 h-2.5 text-zinc-500" />
              <span className="truncate">{activity.timestamp}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom / Right Column: Amount Badge & Status (Moves to next line on mobile/very small screens, right side on desktop) */}
      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 sm:flex-col sm:items-end sm:text-right pt-1.5 sm:pt-0 border-t border-zinc-900/70 sm:border-0 pl-[42px] sm:pl-0 min-w-0">
        {/* Mobile Status Indicator (Left side of sub-row) */}
        <div className="sm:hidden flex items-center gap-1 text-[9px] font-mono shrink-0">
          {activity.status === 'Confirmed' ? (
            <span className="text-emerald-400 flex items-center gap-0.5 font-medium">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>Confirmed</span>
            </span>
          ) : (
            <span className="text-amber-400/90 font-medium">
              Demo
            </span>
          )}
        </div>

        {/* Amount Badge */}
        <div className={`text-xs sm:text-sm font-mono font-black tracking-tight whitespace-nowrap px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-zinc-900/80 border border-zinc-800 ${config.amountColor} shrink-0`}>
          {activity.amount}
        </div>

        {/* Desktop Status Indicator (Below amount badge on >= sm) */}
        <div className="hidden sm:flex mt-1 items-center gap-1 text-[9px] font-mono">
          {activity.status === 'Confirmed' ? (
            <span className="text-emerald-400 flex items-center gap-0.5 font-medium">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>Confirmed</span>
            </span>
          ) : (
            <span className="text-amber-400/90 font-medium">
              Demo
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Compact Container that displays up to TWO transactions in one visual card
 * Separated by a subtle divider, saving 40%+ vertical space on mobile and desktop
 */
export const CompactActivityPair: React.FC<CompactActivityPairProps> = ({
  activities,
  reducedMotion = false,
  variant = 'public',
  className = '',
}) => {
  if (!activities || activities.length === 0) return null;

  return (
    <div 
      className={`group relative rounded-2xl bg-zinc-950/70 hover:bg-zinc-950/90 border border-zinc-800/80 hover:border-emerald-500/35 overflow-hidden transition-all duration-200 shadow-[0_0_15px_rgba(0,0,0,0.25)] w-full min-w-0 max-w-full ${className}`}
    >
      {/* Subtle hover backlight glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Internal items with subtle divider */}
      <div className="relative z-10 divide-y divide-zinc-850/80 w-full min-w-0">
        {activities.map((act) => (
          <CompactActivityItem
            key={act.id}
            activity={act}
            reducedMotion={reducedMotion}
            variant={variant}
            isNested
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Standalone CompactActivityRow (For single activity display)
 */
export const CompactActivityRow: React.FC<CompactActivityRowProps> = ({
  activity,
  reducedMotion = false,
  variant = 'public',
  className = '',
}) => {
  return (
    <div 
      className={`group relative rounded-2xl bg-zinc-950/70 hover:bg-zinc-950/90 border border-zinc-800/80 hover:border-emerald-500/35 p-0.5 transition-all duration-200 shadow-[0_0_15px_rgba(0,0,0,0.25)] w-full min-w-0 max-w-full overflow-hidden ${className}`}
    >
      <CompactActivityItem
        activity={activity}
        reducedMotion={reducedMotion}
        variant={variant}
      />
    </div>
  );
};

/**
 * Utility helper to chunk any array into pairs of 2 for compact 2-in-1 container layout
 */
export function groupActivitiesInPairs<T>(items: T[]): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    result.push(items.slice(i, i + 2));
  }
  return result;
}
