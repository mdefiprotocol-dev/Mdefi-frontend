import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Clock, 
  Users, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  TrendingUp, 
  Layers, 
  Activity, 
  Diamond,
  DollarSign,
  Coins
} from 'lucide-react';
import { UserProfile, RewardBalances, ActivityItem } from '../types';
import { WeeklyPremiumData, WeeklyPremiumClaimRecord } from '../types/rewards';
import { rewardDashboardsService } from '../services/rewardDashboardsService';
import { centralEventSyncService } from '../services/centralEventSyncService';
import { RewardClaimChart } from '../components/rewards/RewardClaimChart';
import { RewardClaimModal } from '../components/rewards/RewardClaimModal';
import { AnimatedDollarCoin } from '../components/common/AnimatedDollarCoin';
import { ResponsivePagination } from '../components/common/ResponsivePagination';
import { groupActivitiesInPairs } from '../components/activity/CompactActivityRow';
import { formatCompactAddress } from '../utils/formatAddress';

interface WeeklyRewardPremiumViewProps {
  user: UserProfile;
  rewards: RewardBalances;
  onUpdateRewards?: (newRewards: Partial<RewardBalances>) => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  onAddActivity?: (activity: ActivityItem) => void;
}

export const WeeklyRewardPremiumView: React.FC<WeeklyRewardPremiumViewProps> = ({
  user,
  rewards,
  onUpdateRewards,
  onShowToast,
  onAddActivity,
}) => {
  const [data, setData] = useState<WeeklyPremiumData | null>(null);
  const [claims, setClaims] = useState<WeeklyPremiumClaimRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  // Pagination for Premium Claim Ledger
  const [claimPage, setClaimPage] = useState<number>(1);
  const claimPageSize = 4; // 4 records per page (renders as 2 compact 2-in-1 pairs on mobile)

  // Paged claims
  const pagedClaims = React.useMemo(() => {
    const startIndex = (claimPage - 1) * claimPageSize;
    return claims.slice(startIndex, startIndex + claimPageSize);
  }, [claims, claimPage, claimPageSize]);

  // Mobile 2-in-1 pairs
  const mobileClaimPairs = React.useMemo(() => {
    return groupActivitiesInPairs(pagedClaims);
  }, [pagedClaims]);

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const isClaimingRef = useRef(false);

  const [secondsRemaining, setSecondsRemaining] = useState<number>(2 * 86400 + 14 * 3600 + 32 * 60);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const d = await rewardDashboardsService.getPremiumData();
      const c = await rewardDashboardsService.getPremiumClaimHistory();
      if (mounted) {
        setData(d);
        setClaims(c);
        setSecondsRemaining(d.remainingSeconds);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const d = Math.floor(secs / 86400);
    const h = Math.floor((secs % 86400) / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  const handleCopyTx = (tx: string) => {
    navigator.clipboard?.writeText(tx);
    setCopiedTx(tx);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const handleConfirmClaim = async () => {
    if (isClaimingRef.current) {
      return { success: false, txHash: '', message: 'Claim transaction already processing.' };
    }
    isClaimingRef.current = true;
    try {
      const res = await rewardDashboardsService.claimPremiumReward();
      if (res.success && data) {
        const updatedTotal = res.totalSettledUsdt ?? (data.totalRewardClaimedUsdt + res.claimedAmountUsdt);
        setData((prev) => (prev ? { 
          ...prev, 
          claimableRewardUsdt: 0, 
          totalRewardClaimedUsdt: updatedTotal,
          totalClaimsCount: prev.totalClaimsCount + 1 
        } : prev));
        const updatedClaims = await rewardDashboardsService.getPremiumClaimHistory();
        setClaims(updatedClaims);

        if (onUpdateRewards) {
          onUpdateRewards({
            mbttcBalance: Math.max(0, rewards.mbttcBalance - res.claimFeeMbttc),
          });
        }
        if (onShowToast) {
          onShowToast(`Claimed +${res.claimedAmountUsdt.toFixed(2)} USDT! (Total Settled: $${updatedTotal.toFixed(2)})`, 'success');
        }
      }
      return res;
    } finally {
      isClaimingRef.current = false;
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          <span className="text-xs font-mono text-zinc-400">Loading Weekly Reward Premium...</span>
        </div>
      </div>
    );
  }

  const directPartnersCount = data.directPartners; // 12
  const requiredDirects = data.requiredDirectPartners; // 3
  const isQualified = directPartnersCount >= requiredDirects;
  const userShares = data.allocatedShares; // Exactly 1 share per direct partner = 12 shares

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Luminous ambient backdrop glow */}
      <div className="fixed top-24 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/3 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Card: Cycle Status, Countdown & Claim Action */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[#061014] via-[#081519] to-[#04090b] border border-cyan-500/35 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/20 via-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-12 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Week {data.currentWeek} Premium Cycle • {data.status}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Weekly Reward Premium
              <Diamond className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_12px_#22d3ee]" />
            </h1>

            <p className="text-sm text-zinc-300 max-w-xl leading-relaxed">
              High-tier institutional weekly distribution pool. Every direct partner gives exactly 1 share once 3 direct partners are qualified.
            </p>

            {/* Countdown bar & Premium Independent Smart Contract */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/60 border border-cyan-500/25">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-400 font-medium">Premium Contract Timer:</span>
                  <span className="font-mono font-bold text-cyan-300 tracking-wider">
                    {formatCountdown(secondsRemaining)}
                  </span>
                </div>
              </div>
              {data.contractAddress && (
                <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-zinc-900/80 border border-cyan-500/20 text-[11px] font-mono text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-zinc-300 font-semibold">{data.contractName || 'Premium Contract'}:</span>
                  <span className="text-cyan-400/90">{formatCompactAddress(data.contractAddress)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Hero Claimable Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.18)] flex flex-col justify-between min-w-[280px] lg:max-w-xs space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span>Claimable Reward</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                  Ready to Claim
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.35)]">
                  {data.claimableRewardUsdt.toFixed(2)}
                </span>
                <span className="text-sm font-bold font-mono text-cyan-400">USDT</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
                <span>Est. Cycle Reward:</span>
                <span className="font-mono text-zinc-200 font-semibold">{data.estimatedRewardUsdt.toFixed(2)} USDT</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-900 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400">Applicable Claim Fee:</span>
                <span className="font-mono text-amber-300 font-bold">{data.claimFeeMbttc.toFixed(2)} MBTTC</span>
              </div>

              <button
                id="btn-claim-premium"
                onClick={() => setIsClaimModalOpen(true)}
                disabled={!(data.isClaimAvailable ?? (data.claimableRewardUsdt > 0)) || data.claimableRewardUsdt <= 0}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
                  (data.isClaimAvailable ?? (data.claimableRewardUsdt > 0)) && data.claimableRewardUsdt > 0
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black shadow-[0_0_24px_rgba(6,182,212,0.4)] active:scale-[0.98] cursor-pointer'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>CLAIM REWARD (USDT)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Direct Partners & Threshold */}
        <div className="p-5 rounded-2xl bg-[#080d0a]/90 border border-cyan-500/25 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Direct Partners</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">{directPartnersCount}</span>
            <span className="text-xs text-zinc-400">Partners</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between pt-2 border-t border-zinc-900">
            <span>Required Directs:</span>
            <span className="font-mono text-cyan-400 font-bold">{requiredDirects} Directs</span>
          </div>
        </div>

        {/* KPI 2: Your Shares (1 Direct = 1 Share) */}
        <div className="p-5 rounded-2xl bg-[#080d0a]/90 border border-cyan-500/25 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Your Shares</span>
            <div className="w-8 h-8 rounded-lg bg-teal-950/60 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-cyan-300">{userShares}</span>
            <span className="text-xs text-zinc-400">Shares ({userShares} Directs)</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between pt-2 border-t border-zinc-900">
            <span>Share Weight:</span>
            <span className="font-mono text-cyan-300 font-bold">{data.userSharePercentage}% of pool</span>
          </div>
        </div>

        {/* KPI 3: Qualification Status */}
        <div className="p-5 rounded-2xl bg-[#080d0a]/90 border border-cyan-500/25 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Qualification Status</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-lg font-bold ${isQualified ? 'text-cyan-400' : 'text-amber-400'}`}>
              {isQualified ? 'Fully Qualified' : 'Unqualified'}
            </span>
            <span className="text-xs text-zinc-400">({directPartnersCount} / {requiredDirects} Directs)</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between pt-2 border-t border-zinc-900">
            <span>Progress:</span>
            <span className="font-mono text-cyan-400 font-bold">100% Qualified</span>
          </div>
        </div>

        {/* KPI 4: Live Pool Volume (USDT) */}
        <div className="p-5 rounded-2xl bg-[#080d0a]/90 border border-cyan-500/25 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Premium Pool Volume</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white">{data.currentPoolUsdt.toLocaleString()}</span>
            <span className="text-xs font-mono font-bold text-amber-400">USDT</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between pt-2 border-t border-zinc-900">
            <span>Weekly Inflow:</span>
            <span className="font-mono text-zinc-200">+{data.weeklyDepositsUsdt.toLocaleString()} USDT</span>
          </div>
        </div>
      </div>

      {/* Qualification & Share Engine Card */}
      <div className="p-6 rounded-3xl bg-[#080d0a]/90 border border-cyan-500/25 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Diamond className="w-5 h-5 text-cyan-400" />
              Premium Qualification & Share Engine
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Qualification requires 3 direct partners. Every direct partner gives exactly 1 share.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-cyan-500/30 text-xs font-mono">
              <span className="text-zinc-400 mr-2">Required Direct Partners:</span>
              <span className="text-cyan-400 font-bold">{requiredDirects}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-xs font-mono text-cyan-300">
              <span>Your Shares: </span>
              <span className="font-bold">{userShares} Shares</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 items-center">
          {/* Circular Qualification Progress Meter */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-zinc-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-cyan-400 transition-all duration-700"
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 * (1 - Math.min(1, directPartnersCount / requiredDirects))}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black font-mono text-white">{directPartnersCount}</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Directs</span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs font-bold text-cyan-400">
                {isQualified ? 'Qualified for Premium Pool' : 'Needs Directs'}
              </span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {isQualified ? 'Threshold of 3 directs met' : `Add ${requiredDirects - directPartnersCount} more to qualify`}
              </p>
            </div>
          </div>

          {/* Share Breakdown & Rule Explanation */}
          <div className="md:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-semibold">Share Attribution Model</span>
                <span className="font-mono text-cyan-400 font-bold">1 Direct Partner = 1 Share</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Once qualified with 3 directs, every direct partner gives exactly 1 share to your allocation in the Premium Pool.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs font-mono">
                <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">1 Direct</span>
                  <span className="font-bold text-zinc-200">1 Share</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">2 Directs</span>
                  <span className="font-bold text-zinc-200">2 Shares</span>
                </div>
                <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                  <span className="text-cyan-400/80 block text-[10px]">3 Directs (Req)</span>
                  <span className="font-bold text-cyan-300">3 Shares ★</span>
                </div>
                <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40">
                  <span className="text-cyan-400/90 block text-[10px]">You: 12 Directs</span>
                  <span className="font-bold text-cyan-300">12 Shares</span>
                </div>
              </div>
            </div>

            {/* Total Pool Shares & User Share Ratio */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <span className="text-zinc-400 block mb-1">Total Pool Shares</span>
                <span className="text-base font-black font-mono text-white">
                  {data.totalWeeklyShares.toLocaleString()}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Active across protocol</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <span className="text-zinc-400 block mb-1">Your Share Fraction</span>
                <span className="text-base font-black font-mono text-cyan-300">
                  {data.userSharePercentage}%
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Pro-rata allocation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Interactive Claim History Chart (USDT) */}
      <RewardClaimChart
        data={rewardDashboardsService.getChartData('premium', 'ALL')}
        title="WEEKLY PREMIUM REWARD CLAIM HISTORY (USDT)"
        tokenSymbol="USDT"
        themeColor="cyan"
      />

      {/* Transaction History Ledger */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#080d0a]/90 border border-cyan-500/25 shadow-xl space-y-4 min-w-0">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Weekly Premium Claim Ledger</h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {claims.length} Records Verified
          </span>
        </div>

        {/* Desktop Table View (>=768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="pb-3 font-semibold">CYCLE</th>
                <th className="pb-3 font-semibold">DIRECTS / SHARES</th>
                <th className="pb-3 font-semibold">REWARD (USDT)</th>
                <th className="pb-3 font-semibold">CLAIM FEE (MBTTC)</th>
                <th className="pb-3 font-semibold">STATUS</th>
                <th className="pb-3 font-semibold">DATE</th>
                <th className="pb-3 font-semibold text-right">TX HASH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {pagedClaims.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3 font-bold text-white">Week {row.week}</td>
                  <td className="py-3 text-zinc-300">
                    <span className="text-cyan-400 font-bold">{row.directPartners}</span> Directs ({row.shares} Sh.)
                  </td>
                  <td className="py-3 font-bold text-cyan-400">
                    +{row.rewardUsdt.toFixed(2)} USDT
                  </td>
                  <td className="py-3 text-amber-300 font-semibold">
                    {row.claimFeeMbttc.toFixed(2)} MBTTC
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] text-cyan-300">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-400">{row.claimDate}</td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyTx(row.txHash)}
                        className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy Tx Hash"
                      >
                        {copiedTx === row.txHash ? (
                          <Check className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <a
                        href={`https://bscscan.com/tx/${row.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-cyan-400 transition-colors"
                        title="View on BscScan"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile 2-in-1 Compact Cards (<768px) */}
        <div className="md:hidden space-y-3 font-mono">
          {mobileClaimPairs.map((pair, pIdx) => (
            <div
              key={`premium-pair-${pair[0]?.id || pIdx}`}
              className="rounded-2xl bg-zinc-950/85 border border-cyan-500/20 divide-y divide-zinc-850/80 overflow-hidden shadow-sm"
            >
              {pair.map((row) => (
                <div key={row.id} className="p-3.5 space-y-2 hover:bg-zinc-900/30 transition-colors">
                  {/* Row 1: Week + Directs / Shares (Left) & Reward (Right) */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">Week {row.week}</span>
                      <span className="text-[10px] text-zinc-400">
                        (<span className="text-cyan-400 font-semibold">{row.directPartners}</span> Directs / {row.shares} Sh.)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xs text-cyan-400">
                        +{row.rewardUsdt.toFixed(2)} USDT
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Fee + Date + Status + Hash */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-900">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-semibold">
                        <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400" />
                        {row.status}
                      </span>
                      <span>{row.claimDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400/90 text-[10px]">{row.claimFeeMbttc.toFixed(1)} MBTTC</span>
                      <button
                        onClick={() => handleCopyTx(row.txHash)}
                        className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy Tx Hash"
                      >
                        {copiedTx === row.txHash ? <Check className="w-2.5 h-2.5 text-cyan-400" /> : <Copy className="w-2.5 h-2.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Universal Pagination */}
        {claims.length > claimPageSize && (
          <div className="pt-2 border-t border-zinc-850">
            <ResponsivePagination
              currentPage={claimPage}
              totalItems={claims.length}
              pageSize={claimPageSize}
              onPageChange={(p) => setClaimPage(p)}
              showItemCount
            />
          </div>
        )}
      </div>

      {/* Claim Confirmation Modal */}
      <RewardClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        title="Claim Weekly Premium Reward"
        subtitle="Week 14 Premium Pool Distribution"
        rewardAmountUsdt={data.claimableRewardUsdt}
        totalSettledBefore={data.totalRewardClaimedUsdt}
        claimFeeMbttc={data.claimFeeMbttc}
        walletMbttcBalance={rewards.mbttcBalance}
        onConfirm={handleConfirmClaim}
        onSuccessConfirmed={(txHash, claimedAmount) => {
          // Central Event Sync: Single Source of Truth
          centralEventSyncService.dispatchAction({
            actionType: 'PREMIUM_CLAIM',
            txHash,
            walletAddress: user.walletAddress,
            amountUsdt: claimedAmount,
          });
        }}
      />
    </div>
  );
};
