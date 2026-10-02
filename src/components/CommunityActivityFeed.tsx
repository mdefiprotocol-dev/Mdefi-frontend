import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserPlus,
  Users,
  Coins,
  Sparkles,
  Package,
  Layers,
  TrendingUp,
  ArrowUpRight,
  Crown,
  Award,
  Gift,
  Trophy,
  CheckCircle2,
  ArrowDownLeft,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Copy,
  Check,
  Activity,
  Radio,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
  GitFork
} from 'lucide-react';
import { ActivityItem, NavPage } from '../types';
import { communityRecentActivities } from '../data/mockData';
import { mdefiService } from '../services/mdefiService';
import { mbttcMarketService } from '../services/mbttcMarketService';
import { centralEventSyncService } from '../services/centralEventSyncService';
import { formatCompactAddress, copyFullAddress } from '../utils/formatAddress';
import { getNotificationDeduplicationKey } from '../utils/notificationDeduplication';
import { ResponsivePagination } from './common/ResponsivePagination';
import { groupActivitiesInPairs } from './activity/CompactActivityRow';

export type ActivityCategory = 
  | 'ALL'
  | 'REGISTRATION'
  | 'MBTTC'
  | 'PACKAGE'
  | 'INCOME'
  | 'MATRIX'
  | 'SALARY'
  | 'REWARD';

interface CommunityActivityFeedProps {
  onNavigate: (page: NavPage) => void;
  userActivities?: ActivityItem[];
}

export interface ResolvedActivityVisual {
  category: ActivityCategory;
  categoryLabel: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  glowColor: string;
  ringColor: string;
  isProfit: boolean;
  iconComponent: React.ComponentType<{ className?: string }>;
  animationType: 'pulse' | 'glow' | 'float' | 'crown' | 'sparkle' | 'static';
}

/**
 * Strict category resolution engine:
 * 1. REGISTRATION events belong strictly to REGISTRATIONS.
 * 2. Real USDT commissions belong strictly to INCOME.
 * 3. Token yields & claims belong strictly to MBTTC.
 */
function resolveActivityVisual(
  type: string = '', 
  title: string = '', 
  amount: string = ''
): ResolvedActivityVisual {
  const t = (type + ' ' + title).toLowerCase();
  const a = amount.toLowerCase();

  // 1. REGISTRATION (Checked FIRST so registration cards always populate REGISTRATIONS tab)
  if (t.includes('registration') || t.includes('register') || a.includes('node active') || a.includes('node registered')) {
    return {
      category: 'REGISTRATION',
      categoryLabel: 'REGISTRATION',
      badgeBg: 'bg-emerald-950/70',
      badgeText: 'text-emerald-300 font-bold',
      badgeBorder: 'border-emerald-500/40',
      iconBg: 'bg-emerald-950/80',
      iconBorder: 'border-emerald-500/40',
      iconColor: 'text-emerald-400',
      glowColor: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
      ringColor: 'border-emerald-400/40',
      isProfit: false,
      iconComponent: UserPlus,
      animationType: 'pulse',
    };
  }

  // 2. DIRECT INCOME (Real USDT Commission only)
  if (t.includes('direct referral income') || t.includes('direct income') || t.includes('commission') || (t.includes('income') && a.includes('usdt'))) {
    return {
      category: 'INCOME',
      categoryLabel: 'DIRECT USDT',
      badgeBg: 'bg-emerald-950/80',
      badgeText: 'text-emerald-200 font-bold',
      badgeBorder: 'border-emerald-400/50',
      iconBg: 'bg-gradient-to-br from-emerald-900/90 to-teal-950/80',
      iconBorder: 'border-emerald-400/60',
      iconColor: 'text-emerald-300',
      glowColor: 'shadow-[0_0_22px_rgba(16,185,129,0.4)]',
      ringColor: 'border-emerald-400/60',
      isProfit: true,
      iconComponent: TrendingUp,
      animationType: 'pulse',
    };
  }

  // 3. MBTTC TOKENS (Airdrop welcome tokens, yield pool credits, token claims)
  if (t.includes('mbttc') || a.includes('mbttc') || t.includes('yield') || t.includes('airdrop') || t.includes('mint')) {
    const isClaim = t.includes('claim');
    return {
      category: 'MBTTC',
      categoryLabel: isClaim ? 'MBTTC CLAIM' : 'MBTTC REWARD',
      badgeBg: 'bg-amber-950/80',
      badgeText: 'text-amber-300 font-bold',
      badgeBorder: 'border-amber-500/40',
      iconBg: 'bg-gradient-to-br from-amber-950/90 to-yellow-950/70',
      iconBorder: 'border-amber-500/50',
      iconColor: 'text-amber-300',
      glowColor: 'shadow-[0_0_18px_rgba(245,158,11,0.3)]',
      ringColor: 'border-amber-400/50',
      isProfit: true,
      iconComponent: isClaim ? CheckCircle2 : Coins,
      animationType: 'sparkle',
    };
  }

  // 4. MATRIX INCOME (S4, Quantum, Nexus radial matrix)
  if (t.includes('matrix') || t.includes('s4') || t.includes('quantum') || t.includes('radial') || t.includes('slot') || t.includes('spillover')) {
    return {
      category: 'MATRIX',
      categoryLabel: 'MATRIX',
      badgeBg: 'bg-teal-950/70',
      badgeText: 'text-teal-300 font-bold',
      badgeBorder: 'border-teal-500/30',
      iconBg: 'bg-teal-950/80',
      iconBorder: 'border-teal-500/40',
      iconColor: 'text-teal-300',
      glowColor: 'shadow-[0_0_15px_rgba(20,184,166,0.25)]',
      ringColor: 'border-teal-400/40',
      isProfit: true,
      iconComponent: GitFork,
      animationType: 'float',
    };
  }

  // 5. PACKAGES (Node purchase & activation events)
  if (t.includes('package') || t.includes('node activation') || t.includes('activated') || t.includes('upgrade') || t.includes('prime')) {
    return {
      category: 'PACKAGE',
      categoryLabel: 'PACKAGE',
      badgeBg: 'bg-cyan-950/60',
      badgeText: 'text-cyan-300 font-bold',
      badgeBorder: 'border-cyan-500/30',
      iconBg: 'bg-cyan-950/80',
      iconBorder: 'border-cyan-500/40',
      iconColor: 'text-cyan-300',
      glowColor: 'shadow-[0_0_15px_rgba(6,182,212,0.25)]',
      ringColor: 'border-cyan-400/40',
      isProfit: false,
      iconComponent: Package,
      animationType: 'float',
    };
  }

  // 6. WEEKLY SALARY
  if (t.includes('salary') || t.includes('passive salary') || t.includes('supervisor')) {
    return {
      category: 'SALARY',
      categoryLabel: 'SALARY',
      badgeBg: 'bg-amber-950/70',
      badgeText: 'text-amber-300 font-bold',
      badgeBorder: 'border-amber-500/40',
      iconBg: 'bg-gradient-to-br from-amber-950/90 to-yellow-950/70',
      iconBorder: 'border-amber-500/50',
      iconColor: 'text-amber-300',
      glowColor: 'shadow-[0_0_18px_rgba(245,158,11,0.3)]',
      ringColor: 'border-amber-400/50',
      isProfit: true,
      iconComponent: Crown,
      animationType: 'crown',
    };
  }

  // 7. WEEKLY REWARDS (Pool distributions)
  if (t.includes('weekly reward') || t.includes('starter pool') || t.includes('premium pool') || t.includes('pool distribution')) {
    return {
      category: 'REWARD',
      categoryLabel: 'REWARD',
      badgeBg: 'bg-emerald-950/70',
      badgeText: 'text-emerald-300 font-bold',
      badgeBorder: 'border-emerald-500/30',
      iconBg: 'bg-emerald-950/80',
      iconBorder: 'border-emerald-500/40',
      iconColor: 'text-emerald-300',
      glowColor: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
      ringColor: 'border-emerald-400/40',
      isProfit: true,
      iconComponent: Gift,
      animationType: 'sparkle',
    };
  }

  // 8. OTHER (Token Swap, Approvals, Generic)
  if (t.includes('swap')) {
    return {
      category: 'MBTTC',
      categoryLabel: 'DEX SWAP',
      badgeBg: 'bg-zinc-900',
      badgeText: 'text-zinc-300 font-bold',
      badgeBorder: 'border-zinc-800',
      iconBg: 'bg-zinc-900',
      iconBorder: 'border-zinc-700',
      iconColor: 'text-emerald-400',
      glowColor: 'shadow-sm',
      ringColor: 'border-zinc-600',
      isProfit: false,
      iconComponent: RefreshCw,
      animationType: 'static',
    };
  }

  // Fallback
  return {
    category: 'ALL',
    categoryLabel: 'ACTIVITY',
    badgeBg: 'bg-zinc-900',
    badgeText: 'text-zinc-300',
    badgeBorder: 'border-zinc-800',
    iconBg: 'bg-zinc-900',
    iconBorder: 'border-zinc-700',
    iconColor: 'text-zinc-300',
    glowColor: 'shadow-sm',
    ringColor: 'border-zinc-700',
    isProfit: a.startsWith('+'),
    iconComponent: Activity,
    animationType: 'static',
  };
}

/**
 * Format address into compact Web3 display: 0x71C8••B389
 */
function formatShortAddressWithDots(address?: string): string {
  if (!address) return '';
  const clean = address.trim();
  if (clean.length <= 12) return clean;
  if (clean.startsWith('0x') || clean.startsWith('0X')) {
    return `${clean.slice(0, 6)}••${clean.slice(-4)}`;
  }
  return `${clean.slice(0, 4)}••${clean.slice(-4)}`;
}

export const DEMO_COMMUNITY_ACTIVITIES: ActivityItem[] = [
  {
    id: 'demo-team-1',
    type: 'Registration',
    title: 'Your Account Registration',
    amount: 'Node Active',
    date: 'Just now',
    status: 'Confirmed',
    txHash: '',
    details: 'Protocol account established',
    walletAddress: 'Your Account',
    read: true,
  }
];

export const CommunityActivityFeed: React.FC<CommunityActivityFeedProps> = ({
  onNavigate,
  userActivities = [],
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ActivityCategory>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const pageSize = 8; // 8 records per page = 4 compact paired containers

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const [isLive, setIsLive] = useState<boolean>(() => {
    return mbttcMarketService.getMode() === 'live';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const [syncedPublicItems, setSyncedPublicItems] = useState<ActivityItem[]>([]);
  const [onChainTeamItems, setOnChainTeamItems] = useState<ActivityItem[]>([]);

  // Real On-Chain Direct Team & Self Activities Fetcher
  useEffect(() => {
    let isMounted = true;
    const activeWallet = (typeof window !== 'undefined' && (window as any).ethereum?.selectedAddress) || '';

    mdefiService.getTeamTransactions(activeWallet).then((res) => {
      if (!isMounted) return;
      if (res.isRealData && res.transactions.length > 0) {
        setIsLive(true);
        const mapped: ActivityItem[] = res.transactions.map((tx) => {
          const actLower = (tx.activityType || '').toLowerCase();
          const amtLower = (tx.amount || '').toLowerCase();

          let resolvedType: any = 'Income';
          if (actLower.includes('registration') || actLower.includes('register') || amtLower.includes('node active') || amtLower.includes('node registered')) {
            resolvedType = 'Registration';
          } else if (actLower.includes('package') || actLower.includes('node activation')) {
            resolvedType = 'Package Activation';
          } else if (actLower.includes('claim')) {
            resolvedType = 'MBTTC Claim';
          } else if (actLower.includes('mbttc') || amtLower.includes('mbttc') || actLower.includes('yield') || actLower.includes('airdrop') || actLower.includes('mint')) {
            resolvedType = 'MBTTC Credit';
          } else if (actLower.includes('salary')) {
            resolvedType = 'Weekly Salary';
          } else if (actLower.includes('reward')) {
            resolvedType = 'Weekly Reward';
          }

          return {
            id: tx.id,
            type: resolvedType,
            title: tx.activityType,
            amount: tx.amount,
            date: tx.timestamp || tx.date || 'Just now',
            status: 'Confirmed',
            txHash: tx.txHash || '',
            details: tx.details || tx.packageName || 'Confirmed on protocol smart contract.',
            walletAddress: tx.memberWallet || tx.userId || 'Team Member',
            read: true,
          };
        });
        setOnChainTeamItems(mapped);
      }
    }).catch((err) => {
      console.warn('[CommunityActivityFeed] Live on-chain sync notice:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = mbttcMarketService.subscribe((stats) => {
      setIsLive(stats.isLive);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = centralEventSyncService.subscribe((syncState) => {
      if (syncState.publicEcosystemActivities.length > 0) {
        const mapped: ActivityItem[] = syncState.publicEcosystemActivities.map((act) => ({
          id: act.id,
          type: (act.type === 'REGISTRATION' ? 'Registration' :
                act.type === 'PACKAGE' ? 'Package Activation' :
                act.type === 'MBTTC_CLAIM' ? 'MBTTC Claim' :
                act.type === 'MBTTC_CREDIT' ? 'MBTTC Distribution' :
                act.type === 'WEEKLY_REWARD' ? 'Weekly Reward' :
                act.type === 'WEEKLY_SALARY' ? 'Weekly Salary' :
                act.type === 'CLAIM' ? 'Claim' : 'Income') as any,
          title: act.title,
          amount: act.amount,
          date: act.timestamp || 'Just now',
          status: 'Confirmed',
          txHash: '',
          details: act.description,
          walletAddress: act.member,
          read: true,
        }));
        setSyncedPublicItems(mapped);
      }
    });
    return unsubscribe;
  }, []);

  const allFeedItems = useMemo(() => {
    const combined = [...onChainTeamItems, ...syncedPublicItems, ...(userActivities || [])];
    
    if (combined.length > 0) {
      const seen = new Set<string>();
      return combined.filter((item) => {
        const key = item.id || getNotificationDeduplicationKey(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    return [];
  }, [onChainTeamItems, syncedPublicItems, userActivities]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'ALL') return allFeedItems;
    return allFeedItems.filter((item) => {
      const visual = resolveActivityVisual(item.type, item.title, item.amount);
      return visual.category === activeCategory;
    });
  }, [allFeedItems, activeCategory]);

  const currentRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const pairedRecords = useMemo(() => {
    return groupActivitiesInPairs(currentRecords);
  }, [currentRecords]);

  const handleCopy = async (id: string, text: string) => {
    const ok = await copyFullAddress(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const categories: { id: ActivityCategory; label: string }[] = [
    { id: 'ALL', label: 'ALL ACTIVITY' },
    { id: 'REGISTRATION', label: 'REGISTRATIONS' },
    { id: 'MBTTC', label: 'MBTTC TOKENS' },
    { id: 'PACKAGE', label: 'PACKAGES' },
    { id: 'INCOME', label: 'DIRECT INCOME' },
    { id: 'MATRIX', label: 'MATRIX' },
    { id: 'SALARY', label: 'WEEKLY SALARY' },
    { id: 'REWARD', label: 'WEEKLY REWARDS' },
  ];

  return (
    <div 
      id="community-activity-feed"
      className="relative mt-8 rounded-3xl bg-gradient-to-b from-[#0a140e] via-[#07100b] to-[#050b07] border border-emerald-500/25 p-4 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.55)] overflow-hidden"
    >
      {/* Background corner glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* 1. SECTION HEADER */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
              <Radio className={`w-3.5 h-3.5 ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
              <span>CONNECTED TEAM PULSE</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Team Activities</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Activity across your account and direct team network
          </p>
        </div>

        {/* Status Indicator Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {isLive ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <span className="relative flex h-2 w-2">
                {!prefersReducedMotion && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>● LIVE TEAM ACTIVITY</span>
            </div>
          ) : (
            <div className="inline-flex flex-col items-end">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-xs font-mono font-bold text-amber-300">
                <span className={`w-2 h-2 rounded-full bg-amber-400 ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                <span>● DEMO TEAM ACTIVITY</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 mt-0.5">
                SIMULATED PREVIEW DATA
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. LIVE TELEMETRY BANNER */}
      <div className="relative z-10 mt-3 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 text-zinc-300">
          <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {isLive 
              ? 'Streaming verified events for your account and direct team network.'
              : 'Streaming simulated preview for your account and team. Real events will stream when on-chain activity occurs.'}
          </span>
        </div>
        <div className="text-[11px] font-mono text-zinc-400 shrink-0">
          Feed: <span className="text-emerald-400 font-semibold">{filteredItems.length}</span> verified records
        </div>
      </div>

      {/* 3. CATEGORY FILTER PILLS */}
      <div className="relative z-10 mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border border-zinc-800/80'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. ACTIVITY LIST CONTAINER: Clean Responsive Card Layout */}
      <div className="relative z-10 mt-4 space-y-2.5 sm:space-y-3">
        {currentRecords.length === 0 ? (
          /* EMPTY STATE */
          <div className="py-12 px-4 text-center rounded-2xl bg-zinc-950/40 border border-zinc-800/60 space-y-2">
            <Activity className="w-8 h-8 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-300 font-mono">TEAM ACTIVITY</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No verified team activity recorded in this category yet.
            </p>
          </div>
        ) : (
          pairedRecords.map((pair, pairIndex) => (
            <div
              key={`team-pair-${pair[0]?.id || pairIndex}`}
              className="group relative rounded-2xl bg-zinc-950/70 hover:bg-zinc-950/95 border border-zinc-800/80 hover:border-emerald-500/40 transition-all duration-200 shadow-sm divide-y divide-zinc-850/80 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {pair.map((act, index) => {
                const visual = resolveActivityVisual(act.type, act.title, act.amount);
                const IconComponent = visual.iconComponent;
                const isCopied = copiedId === act.id;
                const shortAddress = formatShortAddressWithDots(act.walletAddress || act.txHash);

                return (
                  <div
                    key={act.id || `feed-item-${index}`}
                    className="relative z-10 p-3 sm:p-3.5 hover:bg-zinc-900/40 transition-colors"
                  >
                    {/* TOP ROW: Icon + Badges + Title on Left, Amount on Right */}
                    <div className="flex items-start sm:items-center justify-between gap-2.5">
                      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        {/* Animated Icon */}
                        <div className="relative shrink-0 mt-0.5 sm:mt-0">
                          {!prefersReducedMotion && (visual.animationType === 'pulse' || visual.animationType === 'float') && (
                            <div className={`absolute -inset-0.5 rounded-xl border border-dashed ${visual.ringColor} opacity-40 animate-[spin_16s_linear_infinite]`} />
                          )}
                          <div className={`relative p-2 sm:p-2.5 rounded-xl border ${visual.iconBg} ${visual.iconBorder} ${visual.iconColor} ${visual.glowColor} transition-transform duration-200 group-hover:scale-105`}>
                            <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                          </div>
                        </div>

                        {/* Title and Category Badge */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider border shrink-0 ${visual.badgeBg} ${visual.badgeText} ${visual.badgeBorder}`}>
                              {visual.categoryLabel}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-white leading-tight break-words">
                              {act.title || act.type}
                            </h4>
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount Badge (Never collapses or wraps awkwardly) */}
                      <div className="shrink-0 text-right">
                        <div className={`text-xs sm:text-sm font-extrabold font-mono tracking-tight px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800/90 whitespace-nowrap shadow-sm ${
                          visual.isProfit ? 'text-emerald-400' : 'text-zinc-200'
                        }`}>
                          {act.amount}
                        </div>
                      </div>
                    </div>

                    {/* MIDDLE ROW: Activity Details with Bold Highlighted MDF IDs */}
                    <div className="mt-1.5 sm:mt-1 pl-9 sm:pl-11">
                      <p className="text-[11px] sm:text-xs text-zinc-300 leading-normal line-clamp-2">
                        {act.details ? (
                          act.details.split(/(MDF-\d+)/g).map((part, pIdx) =>
                            part.startsWith('MDF-') ? (
                              <span key={pIdx} className="font-mono font-bold text-emerald-400 px-1 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30">
                                {part}
                              </span>
                            ) : (
                              part
                            )
                          )
                        ) : (
                          'Team activity confirmed on protocol smart contract.'
                        )}
                      </p>
                    </div>

                    {/* BOTTOM ROW: Address, Timestamp & Copy Action */}
                    <div className="mt-2 pl-9 sm:pl-11 flex items-center justify-between gap-2 flex-wrap text-[10px] sm:text-[11px] font-mono text-zinc-500">
                      <div className="flex items-center gap-2 flex-wrap">
                        {act.walletAddress && (
                          <span className="text-zinc-300 font-medium">
                            {act.walletAddress.startsWith('0x') ? shortAddress : act.walletAddress}
                          </span>
                        )}
                        <span>&bull;</span>
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-zinc-500" />
                          <span>{act.date}</span>
                        </span>
                      </div>

                      {/* Copy Address Button */}
                      {isLive && act.walletAddress?.startsWith('0x') && (
                        <button
                          type="button"
                          onClick={() => handleCopy(act.id, act.walletAddress || act.txHash || '')}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
                          title="Copy Address"
                        >
                          <span className="text-[10px] hidden xs:inline">{shortAddress}</span>
                          {isCopied ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* 5. DYNAMIC & UNLIMITED PAGINATION */}
      {filteredItems.length > pageSize && (
        <div className="relative z-10 mt-5 pt-4 border-t border-zinc-850">
          <ResponsivePagination
            currentPage={currentPage}
            totalItems={filteredItems.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            showItemCount
          />
        </div>
      )}

      {/* 6. ACTION FOOTER */}
      <div className="relative z-10 mt-5 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[11px] font-mono text-zinc-500">
          Showing <span className="text-zinc-300 font-semibold">{filteredItems.length}</span> total team records
        </div>

        <button
          type="button"
          onClick={() => onNavigate('transactions')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black text-xs font-mono font-black tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>VIEW ALL ACTIVITY</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};