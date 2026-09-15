import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radio, 
  Activity as ActivityIcon, 
  Inbox
} from 'lucide-react';
import { mdefiService } from '../../services/mdefiService';
import { mbttcMarketService } from '../../services/mbttcMarketService';
import { centralEventSyncService } from '../../services/centralEventSyncService';
import { ActivityItem, EcosystemActivity, EcosystemActivityType } from '../../types';
import { CompactActivityPair, groupActivitiesInPairs } from '../activity/CompactActivityRow';
import { formatCompactAddress } from '../../utils/formatAddress';
import { useLanguage } from '../../context/LanguageContext';

// Comprehensive chronological ecosystem activity demo records
const DEMO_ECOSYSTEM_ACTIVITIES: EcosystemActivity[] = [
  {
    id: 'eco-demo-1',
    type: 'REGISTRATION',
    title: 'New Member Registration',
    description: 'New community member joined MDeFi',
    amount: 'New Member',
    member: '••••4821',
    timestamp: '2 min ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-2',
    type: 'PACKAGE',
    title: 'Quantum Node Activation',
    description: 'Quantum Node package activated',
    amount: '$70 USDT',
    member: '••••7319',
    timestamp: '5 min ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-3',
    type: 'MBTTC_CREDIT',
    title: 'MBTTC Credit',
    description: 'Reward credited to community member',
    amount: '+30 MBTTC',
    member: '••••1942',
    timestamp: '8 min ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-4',
    type: 'WEEKLY_REWARD',
    title: 'Weekly Reward',
    description: 'Weekly reward distribution',
    amount: '+330 USDT',
    member: '••••9021',
    timestamp: '12 min ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-5',
    type: 'DIRECT_INCOME',
    title: 'Direct Income',
    description: 'Referral income credited',
    amount: '+24 USDT',
    member: '••••6382',
    timestamp: '16 min ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-6',
    type: 'MATRIX_INCOME',
    title: 'Matrix Income',
    description: 'Matrix reward credited',
    amount: '+48 USDT',
    member: '••••5512',
    timestamp: '21 min ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-7',
    type: 'WEEKLY_SALARY',
    title: 'Weekly Salary',
    description: 'Rank-based weekly salary',
    amount: '+50 USDT',
    member: '••••8274',
    timestamp: '27 min ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-8',
    type: 'MBTTC_CLAIM',
    title: 'MBTTC Reward Claim',
    description: 'MBTTC reward claimed',
    amount: '+30 MBTTC',
    member: '••••3819',
    timestamp: '33 min ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-9',
    type: 'PACKAGE',
    title: 'Nexus Prime Activation',
    description: 'Nexus Prime package activated',
    amount: '$120 USDT',
    member: '••••2209',
    timestamp: '39 min ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-10',
    type: 'CLAIM',
    title: 'Reward Claim',
    description: 'Reward successfully claimed',
    amount: '+150 MBTTC',
    member: '••••6620',
    timestamp: '46 min ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-11',
    type: 'REGISTRATION',
    title: 'New Member Registration',
    description: 'New community member joined MDeFi',
    amount: 'New Member',
    member: '••••1051',
    timestamp: '54 min ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-12',
    type: 'WEEKLY_REWARD',
    title: 'Weekly Reward',
    description: 'Weekly reward distribution',
    amount: '+175.50 USDT',
    member: '••••4418',
    timestamp: '1 hour ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-13',
    type: 'DIRECT_INCOME',
    title: 'Direct Referral Commission',
    description: 'Level 1 direct partner activated node',
    amount: '+36 USDT',
    member: '••••7712',
    timestamp: '1.2 hours ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-14',
    type: 'MATRIX_INCOME',
    title: 'S4 Matrix Slot Spillover',
    description: 'Tier 2 matrix slot position earned',
    amount: '+60 USDT',
    member: '••••3190',
    timestamp: '1.5 hours ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-15',
    type: 'WEEKLY_SALARY',
    title: 'Supervisor Rank Salary',
    description: 'Leadership pool weekly salary unlocked',
    amount: '+100 USDT',
    member: '••••5823',
    timestamp: '2 hours ago',
    status: 'Simulated',
    isDemo: true,
  },
  {
    id: 'eco-demo-16',
    type: 'MBTTC_CREDIT',
    title: 'MBTTC Staking Production',
    description: 'Node validation reward distributed',
    amount: '+45 MBTTC',
    member: '••••8901',
    timestamp: '2.4 hours ago',
    status: 'Simulated',
    isDemo: true,
  },
];

// GPU-friendly Network Node & Orbital Signal Wave Vector Icon
const EcosystemPulseIcon: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion }) => (
  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-950/90 to-zinc-950/90 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.3)] overflow-hidden">
    {/* Orbital dashed ring */}
    <div 
      className={`absolute inset-1 rounded-full border border-dashed border-emerald-500/30 pointer-events-none ${
        reducedMotion ? '' : 'animate-[spin_20s_linear_infinite]'
      }`} 
    />
    {/* Signal pulse wave */}
    {!reducedMotion && (
      <div className="absolute inset-2 rounded-full border border-emerald-400/40 animate-ping opacity-30 pointer-events-none" />
    )}
    {/* Clean Web3 Network Node SVG */}
    <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7 text-emerald-400 relative z-10" aria-hidden="true">
      <line x1="16" y1="16" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 2" />
      <line x1="16" y1="16" x2="24" y2="9" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 2" />
      <line x1="16" y1="16" x2="8" y2="23" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 2" />
      <line x1="16" y1="16" x2="24" y2="23" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 2" />
      <line x1="16" y1="16" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
      
      {/* Satellite Nodes */}
      <circle cx="8" cy="9" r="2.5" fill="#10b981" />
      <circle cx="24" cy="9" r="2.5" fill="#34d399" />
      <circle cx="8" cy="23" r="2.5" fill="#059669" />
      <circle cx="24" cy="23" r="2.5" fill="#10b981" />
      <circle cx="16" cy="6" r="2" fill="#6ee7b7" />
      
      {/* Center Master Node */}
      <circle cx="16" cy="16" r="4.5" fill="#10b981" fillOpacity="0.25" stroke="#34d399" strokeWidth="2" />
      <circle cx="16" cy="16" r="2" fill="#ffffff" />
    </svg>
  </div>
);

// Helper to mask wallet address safely: e.g. "••••4821"
function formatMaskedMember(address?: string): string {
  if (!address) return '••••4821';
  const clean = address.trim();
  if (clean.includes('••••')) return clean;
  if (clean.length > 4) {
    return `••••${clean.slice(-4)}`;
  }
  return '••••4821';
}

export const CommunityRecentActivitySection: React.FC = () => {
  const { t } = useLanguage();
  const [liveActivities, setLiveActivities] = useState<EcosystemActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check live vs demo mode
  const isLive = mbttcMarketService.getMode() === 'live' || 
    Boolean(typeof window !== 'undefined' && (window as any).__MDEFI_REAL_CONTRACT_CONNECTED__);

  // Motion preference detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Fetch real activities in LIVE mode
  useEffect(() => {
    if (!isLive) return;
    let isMounted = true;
    setIsLoading(true);

    mdefiService.getCommunityActivities()
      .then((items: ActivityItem[]) => {
        if (!isMounted) return;
        // Transform verified on-chain activities into standardized EcosystemActivity records
        const transformed: EcosystemActivity[] = items.map((item, idx) => {
          const typeLower = (item.type || '').toLowerCase();
          let actType: EcosystemActivityType = 'PACKAGE';
          
          if (typeLower.includes('register') || typeLower.includes('user')) {
            actType = 'REGISTRATION';
          } else if (typeLower.includes('claim')) {
            actType = typeLower.includes('mbttc') ? 'MBTTC_CLAIM' : 'CLAIM';
          } else if (typeLower.includes('token') || typeLower.includes('mbttc')) {
            actType = 'MBTTC_CREDIT';
          } else if (typeLower.includes('direct') || typeLower.includes('referral')) {
            actType = 'DIRECT_INCOME';
          } else if (typeLower.includes('matrix')) {
            actType = 'MATRIX_INCOME';
          } else if (typeLower.includes('salary')) {
            actType = 'WEEKLY_SALARY';
          } else if (typeLower.includes('reward') || typeLower.includes('starter') || typeLower.includes('premium')) {
            actType = 'WEEKLY_REWARD';
          }

          const rawWallet = item.walletAddress || (item as any).wallet;
          const rawDescription = item.details || (item as any).description;

          return {
            id: item.id || `live-${idx}`,
            type: actType,
            title: item.title || item.type,
            description: rawDescription || 'Verified protocol ecosystem event',
            amount: item.amount,
            member: formatMaskedMember(rawWallet),
            timestamp: item.date || 'Recent',
            status: 'Confirmed',
            isDemo: false,
          };
        });

        setLiveActivities(transformed);
      })
      .catch((err) => {
        console.error('[CommunityRecentActivitySection] Failed to load live activities:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isLive]);

  // Unified chronological activity feed (live rolling community feed, unpaginated)
  const allActivities = useMemo(() => {
    if (isLive) return liveActivities;
    const synced = centralEventSyncService.getState().publicEcosystemActivities;
    const syncedIds = new Set(synced.map((s) => s.id));
    const remainingDemo = DEMO_ECOSYSTEM_ACTIVITIES.filter((d) => !syncedIds.has(d.id));
    return [...synced, ...remainingDemo];
  }, [isLive, liveActivities]);

  // Group rolling activity records in pairs for compact 2-in-1 layout
  const pairedActivities = useMemo(() => {
    return groupActivitiesInPairs(allActivities);
  }, [allActivities]);

  return (
    <section
      id="community-activity"
      aria-labelledby="ecosystem-activities-heading"
      className="relative my-10 sm:my-16 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 z-10 w-full min-w-0 max-w-full overflow-hidden"
    >
      {/* Main Glass Panel */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0a140e] via-[#07100b] to-[#050b07] border border-emerald-500/25 p-3.5 sm:p-7 lg:p-8 shadow-[0_0_50px_rgba(0,0,0,0.55)] overflow-hidden w-full min-w-0 max-w-full">
        {/* Ambient background flares */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* SECTION HEADER */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5 pb-5 sm:pb-6 border-b border-zinc-800/80 min-w-0">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
            {/* Animated SVG Network Node Icon */}
            <EcosystemPulseIcon reducedMotion={prefersReducedMotion} />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ActivityIcon className="w-3.5 h-3.5 shrink-0 web3-icon-glyph" />
                  <span className="truncate">{t('activity_pulse_label', 'GLOBAL ECOSYSTEM PULSE')}</span>
                </span>
              </div>
              <h2
                id="ecosystem-activities-heading"
                className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight break-words"
              >
                {t('activity_heading', 'MDeFi Ecosystem Activities')}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {t('activity_subheading', 'Real-time activity across the MDeFi ecosystem')}
              </p>
            </div>
          </div>

          {/* Operational Status Indicator */}
          <div className="flex flex-col items-start md:items-end shrink-0 pt-1 md:pt-0">
            {isLive ? (
              <div className="inline-flex flex-col items-start md:items-end">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <span className="relative flex h-2 w-2">
                    {!prefersReducedMotion && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    )}
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span>{t('activity_live_badge', '● LIVE ACTIVITY')}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 mt-1">
                  {t('activity_verified_events', 'VERIFIED ECOSYSTEM EVENTS')}
                </span>
              </div>
            ) : (
              <div className="inline-flex flex-col items-start md:items-end">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-xs font-mono font-bold text-amber-300">
                  <span className={`w-2 h-2 rounded-full bg-amber-400 ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                  <span>{t('activity_demo_badge', '● DEMO ACTIVITY')}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 mt-1">
                  {t('activity_simulated_preview', 'SIMULATED PREVIEW DATA')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* UNIFIED CHRONOLOGICAL ACTIVITY STREAM (NO CATEGORY FILTER TABS) */}
        <div className="relative z-10 mt-4 sm:mt-5 min-w-0 w-full max-w-full">
          {isLoading ? (
            <div className="py-14 text-center text-zinc-500 font-mono text-xs flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 animate-spin" />
              <span>{t('activity_loading', 'Querying verified on-chain telemetry...')}</span>
            </div>
          ) : allActivities.length === 0 ? (
            /* Live empty state: Spec mandated when verified event source has 0 transactions */
            <div className="py-14 px-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                <Inbox className="w-6 h-6" />
              </div>
              <p className="text-sm font-mono text-zinc-300 font-medium">
                {t('activity_empty_title', 'No live ecosystem activity recorded yet.')}
              </p>
              <p className="text-xs text-zinc-500 max-w-sm">
                {t('activity_empty_desc', 'Waiting for verified on-chain transactions. Real protocol events will automatically stream here.')}
              </p>
            </div>
          ) : (
            /* Compact Activity Containers: 2-in-1 paired records optimizing vertical density */
            <div className="space-y-2 sm:space-y-3 min-w-0 w-full max-w-full">
              {pairedActivities.map((pair, idx) => (
                <CompactActivityPair
                  key={pair[0]?.id ? `pair-${pair[0].id}` : `pair-${idx}`}
                  activities={pair}
                  reducedMotion={prefersReducedMotion}
                  variant="public"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
