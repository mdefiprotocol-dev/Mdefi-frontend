import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Clock, 
  Users, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  TrendingUp, 
  Award,
  Crown,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Lock,
  Calendar,
  History,
  Shield,
  Gem,
  DollarSign,
  Coins
} from 'lucide-react';
import { UserProfile, RewardBalances } from '../types';
import { 
  WeeklySalaryData, 
  WeeklySalaryClaimRecord, 
  WeeklySalaryRankItem, 
  RankHistoryRecord,
  PassiveSalaryRankName 
} from '../types/rewards';
import { rewardDashboardsService } from '../services/rewardDashboardsService';
import { centralEventSyncService } from '../services/centralEventSyncService';
import { RewardClaimChart } from '../components/rewards/RewardClaimChart';
import { RewardClaimModal } from '../components/rewards/RewardClaimModal';
import { RankCards } from '../components/hub/weeklySalary/RankCards';
import { HowTotalRewardCalculated } from '../components/hub/weeklySalary/HowTotalRewardCalculated';
import { ResponsivePagination } from '../components/common/ResponsivePagination';
import { groupActivitiesInPairs } from '../components/activity/CompactActivityRow';
import { formatCompactAddress } from '../utils/formatAddress';
import { ActivityItem } from '../types';

interface WeeklyPassiveSalaryViewProps {
  user: UserProfile;
  rewards: RewardBalances;
  onUpdateRewards?: (newRewards: Partial<RewardBalances>) => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  onAddActivity?: (activity: ActivityItem) => void;
}

export const WeeklyPassiveSalaryView: React.FC<WeeklyPassiveSalaryViewProps> = ({
  user,
  rewards,
  onUpdateRewards,
  onShowToast,
  onAddActivity,
}) => {
  const [data, setData] = useState<WeeklySalaryData | null>(null);
  const [ranks, setRanks] = useState<WeeklySalaryRankItem[]>([]);
  const [claims, setClaims] = useState<WeeklySalaryClaimRecord[]>([]);
  const [rankHistory, setRankHistory] = useState<RankHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  // Pagination for Passive Salary Claim Ledger
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
      const d = await rewardDashboardsService.getSalaryData();
      const r = await rewardDashboardsService.getSalaryRankRoadmap();
      const c = await rewardDashboardsService.getSalaryClaimHistory();
      const rh = await rewardDashboardsService.getRankHistory();
      if (mounted) {
        setData(d);
        setRanks(r);
        setClaims(c);
        setRankHistory(rh);
        setSecondsRemaining(d.nextClaimRemainingSeconds);
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
      const res = await rewardDashboardsService.claimSalaryReward();
      if (res.success && data) {
        const updatedTotal = res.totalSettledUsdt ?? (data.totalSalaryClaimedUsdt + res.claimedAmountUsdt);
        setData((prev) => (prev ? { 
          ...prev, 
          pendingSalaryUsdt: 0,
          pendingWeeks: 0,
          claimableSalaryUsdt: 0, 
          totalSalaryClaimedUsdt: updatedTotal,
          totalClaimsCount: prev.totalClaimsCount + 1 
        } : prev));
        const updatedClaims = await rewardDashboardsService.getSalaryClaimHistory();
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
          <div className="w-10 h-10 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          <span className="text-xs font-mono text-zinc-400">Loading Weekly Passive Salary...</span>
        </div>
      </div>
    );
  }

  // Render distinct premium icon for each rank
  const renderRankIcon = (rank: PassiveSalaryRankName, status: string) => {
    switch (rank) {
      case 'Bronze':
        return (
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-800/40 via-orange-950 to-zinc-950 border border-amber-600/50 shadow-[0_0_20px_rgba(217,119,6,0.25)] overflow-hidden">
            {/* Soft metallic shine animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-full animate-[shimmer_3.5s_infinite]" />
            <Shield className="w-6 h-6 text-amber-500 drop-shadow-[0_0_8px_#d97706]" />
            <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_4px_#f59e0b]" />
          </div>
        );

      case 'Silver':
        return (
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700/50 via-zinc-900 to-black border border-slate-300/50 shadow-[0_0_20px_rgba(226,232,240,0.25)] overflow-hidden">
            {/* Smooth silver light sweep animation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
            <Shield className="w-6 h-6 text-slate-200 drop-shadow-[0_0_8px_#e2e8f0]" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
          </div>
        );

      case 'Gold':
        return (
          <div className="relative w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/30 via-yellow-950 to-black border-2 border-yellow-400/80 shadow-[0_0_30px_rgba(250,204,21,0.45)] overflow-hidden animate-pulse">
            {/* Warm golden shimmer aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/20 via-amber-300/35 to-transparent animate-[spin_8s_linear_infinite]" />
            <Award className="w-7 h-7 text-yellow-300 drop-shadow-[0_0_12px_#facc15] relative z-10" />
            <div className="absolute inset-0 rounded-2xl border border-yellow-300/40 animate-ping opacity-25" />
          </div>
        );

      case 'Platinum':
        return (
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-950/70 via-teal-950 to-black border border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.35)] overflow-hidden">
            {/* Elegant crystal glow */}
            <div className="absolute inset-0 bg-cyan-400/10 animate-pulse" />
            <Sparkles className="w-6 h-6 text-cyan-300 drop-shadow-[0_0_10px_#22d3ee]" />
            <div className="absolute top-1 left-2 w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_6px_#67e8f9]" />
          </div>
        );

      case 'Diamond':
        return (
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-950/60 via-blue-950 to-black border border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.25)] overflow-hidden">
            {/* Diamond sparkle/pulse */}
            <Gem className="w-6 h-6 text-sky-400 drop-shadow-[0_0_10px_#38bdf8] transition-transform hover:scale-110" />
            <div className="absolute top-1 right-2 w-1 h-1 rounded-full bg-white animate-ping" />
          </div>
        );

      case 'Blue Diamond':
        return (
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-950/70 via-indigo-950 to-black border border-blue-500/50 shadow-[0_0_22px_rgba(59,130,246,0.3)] overflow-hidden">
            {/* Subtle energy wave */}
            <div className="absolute inset-0 rounded-2xl border border-blue-400/30 scale-90 animate-pulse" />
            <Gem className="w-6 h-6 text-blue-400 drop-shadow-[0_0_12px_#3b82f6]" />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
          </div>
        );

      case 'Crown Diamond':
        return (
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-950/70 via-amber-950/50 to-black border border-purple-400/60 shadow-[0_0_25px_rgba(192,132,252,0.35)] overflow-hidden">
            {/* Royal crown glow with subtle particle orbit */}
            <Crown className="w-6 h-6 text-purple-300 drop-shadow-[0_0_12px_#c084fc]" />
            <div className="absolute -top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d]" />
            <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-purple-300 shadow-[0_0_6px_#d8b4fe]" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Luminous ambient backdrop glow */}
      <div className="fixed top-24 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/3 left-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Card: Current Rank, Progression & Pending Salary Vault */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[#120f07] via-[#161208] to-[#0a0804] border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.18)] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/20 via-yellow-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 left-12 w-48 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-xs font-semibold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Rank-Based Weekly Leadership Salary (USDT)</span>
            </div>

            {/* Rank Identity with animated glow */}
            <div className="flex items-center gap-4">
              {renderRankIcon(data.currentRankName, 'current')}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Active Rank</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold">
                    Tier {data.currentRankLevel}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                  {data.currentRankName} Leader
                  <span className="text-sm font-mono text-emerald-400 font-bold px-2.5 py-0.5 rounded-lg bg-black/60 border border-emerald-500/30">
                    +{data.weeklySalaryUsdt.toFixed(2)} USDT / Week
                  </span>
                </h1>
              </div>
            </div>

            {/* Next Rank Progress Bar */}
            <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/25 max-w-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400">Progression to</span>
                  <span className="text-cyan-300 font-bold">
                    {data.nextRankName} (${ranks.find((r) => r.rankName === data.nextRankName)?.weeklySalaryUsdt || 30} USDT/wk):
                  </span>
                </div>
                <span className="font-mono text-emerald-300 font-bold">
                  {data.directPartners} / {data.nextRankRequiredDirects} Directs ({data.nextRankProgressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-cyan-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(250,204,21,0.5)]"
                  style={{ width: `${data.nextRankProgressPercent}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400 pt-0.5">
                <span>{data.remainingDirectsForNext} more direct partner{data.remainingDirectsForNext === 1 ? '' : 's'} needed</span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Salary Contract Timer:</span>
                  <span className="font-mono text-amber-300 font-bold">{formatCountdown(secondsRemaining)}</span>
                  {data.contractAddress && (
                    <span className="text-zinc-500 font-mono text-[10px]">({formatCompactAddress(data.contractAddress)})</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pending Salary Vault Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/90 border border-amber-500/35 shadow-[0_0_35px_rgba(245,158,11,0.2)] flex flex-col justify-between min-w-[280px] lg:max-w-xs space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span>Pending Salary Vault</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300">
                  {data.pendingWeeks} Weeks Accumulated
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black font-mono text-amber-300 drop-shadow-[0_0_15px_rgba(250,204,21,0.35)]">
                  {data.pendingSalaryUsdt.toFixed(2)}
                </span>
                <span className="text-sm font-bold font-mono text-amber-400">USDT</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
                <span>Weekly Rate:</span>
                <span className="font-mono text-zinc-200 font-semibold">{data.weeklySalaryUsdt.toFixed(2)} USDT / wk</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-900 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400">Applicable Claim Fee:</span>
                <span className="font-mono text-amber-300 font-bold">{data.claimFeeMbttc.toFixed(2)} MBTTC</span>
              </div>

              <button
                id="btn-claim-salary"
                onClick={() => setIsClaimModalOpen(true)}
                disabled={!(data.isClaimAvailable ?? (data.pendingSalaryUsdt > 0)) || data.pendingSalaryUsdt <= 0}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 ${
                  (data.isClaimAvailable ?? (data.pendingSalaryUsdt > 0)) && data.pendingSalaryUsdt > 0
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black shadow-[0_0_24px_rgba(245,158,11,0.4)] active:scale-[0.98] cursor-pointer'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>CLAIM SALARY ({data.pendingWeeks} WEEKS)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Leadership Tier */}
        <div className="p-5 rounded-2xl bg-[#080d0a]/90 border border-amber-500/25 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Active Leadership Tier</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-yellow-300">{data.currentRankName}</span>
            <span className="text-xs text-zinc-400">Tier {data.currentRankLevel}</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between pt-2 border-t border-zinc-900">
            <span>Direct Partners:</span>
            <span className="font-mono text-amber-400 font-bold">{data.directPartners} Verified Directs</span>
          </div>
        </div>

        {/* KPI 2: Weekly Salary Rate (USDT) */}
        <div className="p-5 rounded-2xl bg-[#080d0a]/90 border border-amber-500/25 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Weekly Salary Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-emerald-300">
              {data.weeklySalaryUsdt.toFixed(2)}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">USDT / wk</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between pt-2 border-t border-zinc-900">
            <span>Settlement:</span>
            <span className="text-zinc-200">Every Monday 00:00 UTC</span>
          </div>
        </div>

        {/* KPI 3: Total Salary Claimed (USDT) */}
        <div className="p-5 rounded-2xl bg-[#080d0a]/90 border border-amber-500/25 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Total Salary Claimed</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white">
              {data.totalSalaryClaimedUsdt.toFixed(2)}
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">USDT</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between pt-2 border-t border-zinc-900">
            <span>Claims Count:</span>
            <span className="font-mono text-zinc-200">{data.totalClaimsCount} Confirmed Payouts</span>
          </div>
        </div>

        {/* KPI 4: Lifetime Salary Earned (USDT) */}
        <div className="p-5 rounded-2xl bg-[#080d0a]/90 border border-amber-500/25 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Lifetime Salary Value</span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-amber-300">
              {data.lifetimeSalaryEarnedUsdt.toFixed(2)}
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">USDT</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between pt-2 border-t border-zinc-900">
            <span>Status:</span>
            <span className="text-emerald-400 font-semibold font-mono">Immutable Smart Contract</span>
          </div>
        </div>
      </div>

      {/* 7-RANK PREMIUM REDESIGNED WEB3 DASHBOARD (3-col Desktop, 2-col Tablet, 1-col Mobile) */}
      <RankCards salaryData={data} />

      {/* HOW TOTAL REWARD IS CALCULATED (Weekly Salary × Maximum Weeks = Total Potential Earnings) */}
      <HowTotalRewardCalculated />

      {/* SVG Interactive Claim History Chart (USDT) */}
      <RewardClaimChart
        data={rewardDashboardsService.getChartData('salary', 'ALL')}
        title="WEEKLY PASSIVE SALARY CLAIM HISTORY (USDT)"
        tokenSymbol="USDT"
        themeColor="purple"
      />

      {/* Transaction History & Rank History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payout History Ledger (2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#080d0a]/90 border border-amber-500/25 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Passive Salary Claim Ledger</h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {claims.length} Confirmed Payouts
            </span>
          </div>

          {/* Desktop Table View (>=768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="pb-3 font-semibold">DATE</th>
                  <th className="pb-3 font-semibold">WEEKS</th>
                  <th className="pb-3 font-semibold">SALARY (USDT)</th>
                  <th className="pb-3 font-semibold">FEE (MBTTC)</th>
                  <th className="pb-3 font-semibold">STATUS</th>
                  <th className="pb-3 font-semibold text-right">TX HASH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {pagedClaims.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3 text-zinc-400">{row.claimDate}</td>
                    <td className="py-3 font-semibold text-zinc-200">{row.weekNumbers}</td>
                    <td className="py-3 font-bold text-emerald-400">
                      +{row.salaryAmountUsdt.toFixed(2)} USDT
                    </td>
                    <td className="py-3 text-amber-300 font-semibold">
                      {row.claimFeeMbttc.toFixed(2)} MBTTC
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyTx(row.txHash)}
                          className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy Tx Hash"
                        >
                          {copiedTx === row.txHash ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <a
                          href={`https://bscscan.com/tx/${row.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors"
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
                key={`salary-pair-${pair[0]?.id || pIdx}`}
                className="rounded-2xl bg-zinc-950/85 border border-amber-500/20 divide-y divide-zinc-850/80 overflow-hidden shadow-sm"
              >
                {pair.map((row) => (
                  <div key={row.id} className="p-3.5 space-y-2 hover:bg-zinc-900/30 transition-colors">
                    {/* Row 1: Weeks (Left) & Salary Amount (Right) */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{row.weekNumbers}</span>
                        <span className="text-[10px] text-zinc-400">{row.claimDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xs text-emerald-400">
                          +{row.salaryAmountUsdt.toFixed(2)} USDT
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Fee + Status + Hash */}
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-900">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-semibold">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          {row.status}
                        </span>
                        <span className="text-amber-400/90">{row.claimFeeMbttc.toFixed(1)} MBTTC</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyTx(row.txHash)}
                          className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy Tx Hash"
                        >
                          {copiedTx === row.txHash ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
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

        {/* Rank Promotion History (1 column) */}
        <div className="p-6 rounded-3xl bg-[#080d0a]/90 border border-amber-500/25 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <h3 className="text-base font-bold text-white">Rank Milestones</h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">On-Chain Verified</span>
          </div>

          <div className="space-y-3">
            {rankHistory.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                    R{3 - idx}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">{item.rank} Rank</span>
                    <span className="text-[11px] text-zinc-400 font-mono">Week {item.week} • {item.date}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/30 to-teal-950/20 border border-cyan-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-cyan-300">
              <Sparkles className="w-4 h-4" />
              <span>Next Milestone: {data.nextRankName}</span>
            </div>
            <span className="font-mono text-cyan-400 font-bold">
              {data.nextRankRequiredDirects} Directs (${ranks.find((r) => r.rankName === data.nextRankName)?.weeklySalaryUsdt || 30}/wk)
            </span>
          </div>
        </div>
      </div>

      {/* Claim Confirmation Modal */}
      <RewardClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        title="Claim Weekly Passive Salary"
        subtitle="Rank Payout • Verified Contract Vault"
        rewardAmountUsdt={data.pendingSalaryUsdt}
        totalSettledBefore={data.totalSalaryClaimedUsdt}
        claimFeeMbttc={data.claimFeeMbttc}
        walletMbttcBalance={rewards.mbttcBalance}
        pendingWeeks={data.pendingWeeks}
        onConfirm={handleConfirmClaim}
        onSuccessConfirmed={(txHash, claimedAmount) => {
          // Central Event Sync: Single Source of Truth
          centralEventSyncService.dispatchAction({
            actionType: 'SALARY_CLAIM',
            txHash,
            walletAddress: user.walletAddress,
            amountUsdt: claimedAmount,
          });
        }}
      />
    </div>
  );
};
