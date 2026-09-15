import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserPlus,
  Users,
  Coins,
  Sparkles,
  Package,
  TrendingUp,
  Crown,
  Gift,
  CheckCircle2,
  ChevronRight,
  Radio,
  Clock,
  ChevronDown,
  ChevronUp,
  GitFork,
  Activity,
  ArrowRight
} from 'lucide-react';
import { ActivityItem, NavPage, UserProfile } from '../types';
import { mdefiService } from '../services/mdefiService';
import { mbttcMarketService } from '../services/mbttcMarketService';
import { centralEventSyncService } from '../services/centralEventSyncService';

interface TeamActivitiesFeedProps {
  user: UserProfile;
  onNavigate: (page: NavPage) => void;
  userActivities?: ActivityItem[];
}

export type TeamActivityCategory = 
  | 'ALL'
  | 'REGISTRATION'
  | 'PACKAGE'
  | 'MBTTC'
  | 'INCOME'
  | 'MATRIX'
  | 'WEEKLY_REWARD'
  | 'WEEKLY_SALARY';

export interface TeamActivityRecord {
  id: string;
  category: TeamActivityCategory;
  categoryLabel: string;
  title: string;
  description: string;
  memberIdentifier: string;
  amount: string;
  timestamp: string;
  status: 'Simulated' | 'Confirmed' | 'Pending';
  isProfit: boolean;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  ringColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

// Realistic sample activities strictly for DEMO / SIMULATED preview mode
const DEMO_TEAM_RECORDS: TeamActivityRecord[] = [
  {
    id: 'demo-team-1',
    category: 'REGISTRATION',
    categoryLabel: 'TEAM REGISTRATION',
    title: 'Team Registration',
    description: 'Demo community member joined',
    memberIdentifier: 'Demo Member ••••4821',
    amount: 'New Member',
    timestamp: '3 min ago',
    status: 'Simulated',
    isProfit: false,
    icon: UserPlus,
    iconBg: 'bg-emerald-950/80',
    iconBorder: 'border-emerald-500/40',
    iconColor: 'text-emerald-400',
    ringColor: 'border-emerald-400/40',
    badgeBg: 'bg-emerald-950/70',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
  },
  {
    id: 'demo-team-2',
    category: 'PACKAGE',
    categoryLabel: 'PACKAGE ACTIVATION',
    title: 'Package Activation',
    description: 'Nexus Prime',
    memberIdentifier: 'Demo Member ••••7319',
    amount: '$120 USDT',
    timestamp: '8 min ago',
    status: 'Simulated',
    isProfit: true,
    icon: Package,
    iconBg: 'bg-teal-950/80',
    iconBorder: 'border-teal-500/40',
    iconColor: 'text-teal-300',
    ringColor: 'border-teal-400/40',
    badgeBg: 'bg-teal-950/70',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/30',
  },
  {
    id: 'demo-team-3',
    category: 'MBTTC',
    categoryLabel: 'MBTTC CREDIT',
    title: 'MBTTC Credit',
    description: 'Team reward credited',
    memberIdentifier: 'Demo Member ••••1942',
    amount: '+30 MBTTC',
    timestamp: '12 min ago',
    status: 'Simulated',
    isProfit: true,
    icon: Coins,
    iconBg: 'bg-amber-950/80',
    iconBorder: 'border-amber-500/40',
    iconColor: 'text-amber-300',
    ringColor: 'border-amber-400/40',
    badgeBg: 'bg-amber-950/70',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/30',
  },
  {
    id: 'demo-team-4',
    category: 'INCOME',
    categoryLabel: 'TEAM INCOME',
    title: 'Team Income',
    description: 'Matrix income activity',
    memberIdentifier: 'Demo Member ••••6382',
    amount: '+$24 USDT',
    timestamp: '18 min ago',
    status: 'Simulated',
    isProfit: true,
    icon: TrendingUp,
    iconBg: 'bg-emerald-950/80',
    iconBorder: 'border-emerald-500/40',
    iconColor: 'text-emerald-400',
    ringColor: 'border-emerald-400/40',
    badgeBg: 'bg-emerald-950/70',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
  },
  {
    id: 'demo-team-5',
    category: 'WEEKLY_REWARD',
    categoryLabel: 'WEEKLY REWARD',
    title: 'Weekly Reward',
    description: 'Weekly Reward Starter',
    memberIdentifier: 'Demo Member ••••9021',
    amount: '+$175 USDT',
    timestamp: '25 min ago',
    status: 'Simulated',
    isProfit: true,
    icon: Gift,
    iconBg: 'bg-yellow-950/80',
    iconBorder: 'border-yellow-500/40',
    iconColor: 'text-yellow-300',
    ringColor: 'border-yellow-400/40',
    badgeBg: 'bg-yellow-950/70',
    badgeText: 'text-yellow-300',
    badgeBorder: 'border-yellow-500/30',
  },
  {
    id: 'demo-team-6',
    category: 'WEEKLY_SALARY',
    categoryLabel: 'WEEKLY SALARY',
    title: 'Weekly Salary',
    description: 'Rank-based salary activity',
    memberIdentifier: 'Demo Member ••••8274',
    amount: '+$50 USDT',
    timestamp: '31 min ago',
    status: 'Simulated',
    isProfit: true,
    icon: Crown,
    iconBg: 'bg-amber-950/80',
    iconBorder: 'border-amber-500/40',
    iconColor: 'text-amber-300',
    ringColor: 'border-amber-400/40',
    badgeBg: 'bg-amber-950/70',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/30',
  },
  {
    id: 'demo-team-7',
    category: 'PACKAGE',
    categoryLabel: 'PACKAGE ACTIVATION',
    title: 'Package Activation',
    description: 'Quantum Node',
    memberIdentifier: 'Demo Member ••••3819',
    amount: '$70 USDT',
    timestamp: '42 min ago',
    status: 'Simulated',
    isProfit: true,
    icon: Package,
    iconBg: 'bg-teal-950/80',
    iconBorder: 'border-teal-500/40',
    iconColor: 'text-teal-300',
    ringColor: 'border-teal-400/40',
    badgeBg: 'bg-teal-950/70',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/30',
  },
  {
    id: 'demo-team-8',
    category: 'MATRIX',
    categoryLabel: 'MATRIX ACTIVITY',
    title: 'Matrix Activity',
    description: 'Radial matrix downline slot placement',
    memberIdentifier: 'Demo Member ••••5512',
    amount: '+$14 USDT',
    timestamp: '1 hour ago',
    status: 'Simulated',
    isProfit: true,
    icon: GitFork,
    iconBg: 'bg-cyan-950/80',
    iconBorder: 'border-cyan-500/40',
    iconColor: 'text-cyan-300',
    ringColor: 'border-cyan-400/40',
    badgeBg: 'bg-cyan-950/70',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/30',
  },
];

export const TeamActivitiesFeed: React.FC<TeamActivitiesFeedProps> = ({
  user,
  onNavigate,
  userActivities,
}) => {
  const [activeCategory, setActiveCategory] = useState<TeamActivityCategory>('ALL');
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [liveTeamRecords, setLiveTeamRecords] = useState<TeamActivityRecord[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Fetch real team data if on-chain service is active
  useEffect(() => {
    let isMounted = true;
    mdefiService.getTeamTransactions(user.walletAddress).then((res) => {
      if (!isMounted) return;
      if (res.isRealData && res.transactions.length > 0) {
        setIsLive(true);
        // Map real transactions to TeamActivityRecord without fabrication
        const mapped: TeamActivityRecord[] = res.transactions.map((tx) => ({
          id: tx.id,
          category: 'INCOME',
          categoryLabel: 'TEAM ACTIVITY',
          title: tx.activityType,
          description: tx.packageDetails || tx.activityType,
          memberIdentifier: tx.memberWallet 
            ? `${tx.memberWallet.slice(0, 6)}...${tx.memberWallet.slice(-4)}`
            : 'Team Member',
          amount: tx.amount,
          timestamp: tx.timestamp,
          status: 'Confirmed',
          isProfit: tx.amount.includes('+') || !tx.amount.includes('-'),
          icon: Users,
          iconBg: 'bg-emerald-950/80',
          iconBorder: 'border-emerald-500/40',
          iconColor: 'text-emerald-400',
          ringColor: 'border-emerald-400/40',
          badgeBg: 'bg-emerald-950/70',
          badgeText: 'text-emerald-300',
          badgeBorder: 'border-emerald-500/30',
        }));
        setLiveTeamRecords(mapped);
      } else {
        setIsLive(false);
      }
    }).catch(() => {
      if (isMounted) setIsLive(false);
    });

    return () => {
      isMounted = false;
    };
  }, [user.walletAddress]);

  // Subscribe to Central Event Sync for instant reactive team event reflection
  useEffect(() => {
    const unsubscribe = centralEventSyncService.subscribe((syncState) => {
      if (syncState.teamTransactions.length > 0) {
        const syncedMapped: TeamActivityRecord[] = syncState.teamTransactions.map((tx) => {
          const actLower = tx.activityType.toLowerCase();
          const category: TeamActivityCategory = 
            actLower.includes('registration') ? 'REGISTRATION' :
            actLower.includes('package') ? 'PACKAGE' :
            actLower.includes('salary') ? 'WEEKLY_SALARY' :
            actLower.includes('starter') || actLower.includes('weekly') || actLower.includes('premium') ? 'WEEKLY_REWARD' :
            actLower.includes('matrix') ? 'MATRIX' :
            actLower.includes('mbttc') ? 'MBTTC' : 'INCOME';

          return {
            id: tx.id,
            category,
            categoryLabel: tx.activityType.toUpperCase(),
            title: tx.activityType,
            description: tx.details || tx.packageName,
            memberIdentifier: tx.memberWallet 
              ? `${tx.memberWallet.slice(0, 6)}...${tx.memberWallet.slice(-4)}`
              : tx.userId || 'Team Member',
            amount: tx.amount,
            timestamp: tx.timestamp || 'Just now',
            status: 'Confirmed',
            isProfit: !tx.amount.includes('-'),
            icon: Users,
            iconBg: 'bg-emerald-950/80',
            iconBorder: 'border-emerald-500/40',
            iconColor: 'text-emerald-400',
            ringColor: 'border-emerald-400/40',
            badgeBg: 'bg-emerald-950/70',
            badgeText: 'text-emerald-300',
            badgeBorder: 'border-emerald-500/30',
          };
        });

        setLiveTeamRecords((prev) => {
          const prevIds = new Set(prev.map((p) => p.id));
          const newItems = syncedMapped.filter((s) => !prevIds.has(s.id));
          return [...newItems, ...prev];
        });
      }
    });

    return unsubscribe;
  }, []);

  // Determine active records: in DEMO mode, use DEMO_TEAM_RECORDS merged with synced; in LIVE mode, use verified records
  const records = useMemo(() => {
    if (liveTeamRecords.length > 0) {
      const liveIds = new Set(liveTeamRecords.map((r) => r.id));
      const remainingDemo = DEMO_TEAM_RECORDS.filter((d) => !liveIds.has(d.id));
      return [...liveTeamRecords, ...remainingDemo];
    }
    return DEMO_TEAM_RECORDS;
  }, [liveTeamRecords]);

  // Filter records by category
  const filteredRecords = useMemo(() => {
    if (activeCategory === 'ALL') return records;
    return records.filter((r) => r.category === activeCategory);
  }, [records, activeCategory]);

  const displayedRecords = useMemo(() => {
    if (expanded) return filteredRecords;
    return filteredRecords.slice(0, 6);
  }, [filteredRecords, expanded]);

  const categories: { id: TeamActivityCategory; label: string }[] = [
    { id: 'ALL', label: 'ALL TEAM' },
    { id: 'REGISTRATION', label: 'REGISTRATIONS' },
    { id: 'PACKAGE', label: 'PACKAGES' },
    { id: 'MBTTC', label: 'MBTTC TOKENS' },
    { id: 'INCOME', label: 'TEAM INCOME' },
    { id: 'MATRIX', label: 'MATRIX' },
    { id: 'WEEKLY_REWARD', label: 'WEEKLY REWARDS' },
    { id: 'WEEKLY_SALARY', label: 'WEEKLY SALARY' },
  ];

  return (
    <div 
      id="team-activities-feed"
      className="relative rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl p-4 sm:p-6 shadow-[0_0_40px_rgba(0,0,0,0.45)] overflow-hidden"
    >
      {/* Subtle emerald corner glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header & Live / Demo Status Indicator */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>CONNECTED USER NETWORK</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            TEAM ACTIVITIES
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Activity across your team
          </p>
        </div>

        {/* Status Indicator Badge (Strict adherence to DEMO vs LIVE labeling) */}
        <div className="flex items-center gap-2 shrink-0">
          {isLive ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>● LIVE TEAM ACTIVITY</span>
            </div>
          ) : (
            <div className="inline-flex flex-col items-end">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-xs font-mono font-bold text-amber-300">
                <span className={`w-2 h-2 rounded-full bg-amber-400 ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                <span>● DEMO TEAM ACTIVITY</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 mt-0.5">
                DEMO / SIMULATED
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="relative z-10 mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-mono font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Team Activities Feed Rows */}
      <div className="relative z-10 mt-3 space-y-2.5">
        {displayedRecords.length === 0 ? (
          <div className="py-8 text-center rounded-2xl bg-zinc-950/40 border border-zinc-800/60 space-y-1">
            <Users className="w-6 h-6 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400 font-mono">No team activity found in this category.</p>
          </div>
        ) : (
          displayedRecords.map((item) => {
            const IconComp = item.icon;
            return (
              <div 
                key={item.id}
                className="p-3 sm:p-3.5 rounded-2xl bg-zinc-950/80 hover:bg-zinc-950/95 border border-zinc-800/80 hover:border-emerald-500/30 transition-all space-y-2 font-mono group"
              >
                {/* Row 1: Icon + Title & Amount */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={`p-2 rounded-xl border ${item.iconBg} ${item.iconBorder} ${item.iconColor} shrink-0 group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider border ${item.badgeBg} ${item.badgeText} ${item.badgeBorder}`}>
                          {item.categoryLabel}
                        </span>
                        <span className="font-sans font-bold text-xs sm:text-sm text-white truncate">
                          {item.title}
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-zinc-400 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs sm:text-sm font-extrabold shrink-0 text-right ${
                    item.isProfit ? 'text-emerald-400' : 'text-zinc-300'
                  }`}>
                    {item.amount}
                  </span>
                </div>

                {/* Row 2: Member Identifier & Timestamp */}
                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-zinc-900 text-[10px] sm:text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500">Member:</span>
                    <span className="text-zinc-300 font-semibold">{item.memberIdentifier}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{item.timestamp}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {isLive ? 'Verified' : 'Simulated'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Action Footer: Toggle Expand & Navigate to My Team */}
      <div className="relative z-10 mt-4 pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {filteredRecords.length > 6 && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show Fewer ({displayedRecords.length})</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Show More ({filteredRecords.length - 6} remaining)</span>
              </>
            )}
          </button>
        )}

        <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
          <button
            type="button"
            onClick={() => onNavigate('team')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800/90 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>VIEW FULL TEAM MATRIX</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('transactions')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black text-xs font-mono font-black tracking-wider transition-all shadow-[0_0_12px_rgba(16,185,129,0.25)] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>LEDGER RECORDS</span>
            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
