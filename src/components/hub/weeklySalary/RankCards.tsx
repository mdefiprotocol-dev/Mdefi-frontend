import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Medal, 
  Crown, 
  Gem, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp, 
  Calendar, 
  Coins, 
  Layers, 
  Award,
  Zap,
  Info
} from 'lucide-react';
import { WEEKLY_SALARY_RANKS, WeeklySalaryRankDef } from '../../../data/weeklySalaryData';
import { rewardDashboardsService } from '../../../services/rewardDashboardsService';
import { WeeklySalaryData } from '../../../types/rewards';

interface RankCardsProps {
  salaryData?: WeeklySalaryData | null;
  onNavigateToSalary?: () => void;
}

export const RankCards: React.FC<RankCardsProps> = ({ 
  salaryData: externalSalaryData,
  onNavigateToSalary
}) => {
  const [internalSalaryData, setInternalSalaryData] = useState<WeeklySalaryData | null>(null);

  useEffect(() => {
    if (!externalSalaryData) {
      let mounted = true;
      rewardDashboardsService.getSalaryData().then((d) => {
        if (mounted) setInternalSalaryData(d);
      });
      return () => {
        mounted = false;
      };
    }
  }, [externalSalaryData]);

  const activeData = externalSalaryData || internalSalaryData;
  const userRankLevel = activeData?.currentRankLevel ?? 1;
  const userDirects = activeData?.directPartners ?? 12;

  // Distinct premium high-end rank iconography with custom atmospheric glow
  const renderRankIcon = (rank: WeeklySalaryRankDef, status: 'current' | 'next' | 'locked' | 'unlocked') => {
    switch (rank.id) {
      case 'bronze':
        return (
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-800/40 via-orange-950 to-zinc-950 border border-amber-600/50 shadow-[0_0_20px_rgba(217,119,6,0.25)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent -translate-x-full animate-[shimmer_3.5s_infinite]" />
            <Shield className="w-6 h-6 text-amber-500 drop-shadow-[0_0_8px_#d97706]" />
            <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_4px_#f59e0b]" />
          </div>
        );

      case 'silver':
        return (
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700/40 via-zinc-900 to-black border border-slate-300/50 shadow-[0_0_20px_rgba(226,232,240,0.22)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
            <Medal className="w-6 h-6 text-slate-200 drop-shadow-[0_0_8px_#e2e8f0]" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
          </div>
        );

      case 'gold':
        return (
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/30 via-yellow-950 to-black border border-yellow-400/70 shadow-[0_0_25px_rgba(250,204,21,0.35)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/20 via-amber-300/30 to-transparent animate-[spin_8s_linear_infinite]" />
            <Crown className="w-6 h-6 text-yellow-300 drop-shadow-[0_0_10px_#facc15] relative z-10" />
            <div className="absolute inset-0 rounded-2xl border border-yellow-300/30 animate-pulse opacity-20" />
          </div>
        );

      case 'platinum':
        return (
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-950/70 via-teal-950 to-black border border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.3)] overflow-hidden">
            <div className="absolute inset-0 bg-cyan-400/10 animate-pulse" />
            <Sparkles className="w-6 h-6 text-cyan-300 drop-shadow-[0_0_10px_#22d3ee]" />
            <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_6px_#67e8f9]" />
          </div>
        );

      case 'diamond':
        return (
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-950/60 via-blue-950 to-black border border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.25)] overflow-hidden">
            <Gem className="w-6 h-6 text-sky-400 drop-shadow-[0_0_10px_#38bdf8] transition-transform hover:scale-110" />
            <div className="absolute top-1 right-2 w-1 h-1 rounded-full bg-white animate-ping" />
          </div>
        );

      case 'blue-diamond':
        return (
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-950/70 via-indigo-950 to-black border border-blue-500/50 shadow-[0_0_22px_rgba(59,130,246,0.3)] overflow-hidden">
            <div className="absolute inset-0 rounded-2xl border border-blue-400/30 scale-90 animate-pulse" />
            <Gem className="w-6 h-6 text-blue-400 drop-shadow-[0_0_12px_#3b82f6]" />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
          </div>
        );

      case 'crown-diamond':
        return (
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-950/70 via-teal-950/60 to-black border border-emerald-400/60 shadow-[0_0_28px_rgba(16,185,129,0.35)] overflow-hidden">
            <Crown className="w-6 h-6 text-emerald-300 drop-shadow-[0_0_12px_#10b981]" />
            <div className="absolute -top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7]" />
            <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-teal-300 shadow-[0_0_6px_#5eead4]" />
          </div>
        );

      default:
        return (
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800">
            <Award className="w-6 h-6 text-emerald-400" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
            Executive Leadership Roadmap
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>OFFICIAL 7-RANK WEEKLY SALARY SCHEDULE</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-300 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
            Current: <strong className="text-emerald-400 font-bold">{activeData?.currentRankName || 'Bronze'}</strong> ({userDirects} Directs)
          </span>
        </div>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
        Every rank establishes guaranteed weekly salary disbursements in USDT for qualifying leadership tiers. Requirements are cumulative across your verified direct team with zero reset penalties.
      </p>

      {/* 
        PREMIUM RESPONSIVE GRID:
        Desktop: 3-column grid (lg:grid-cols-3)
        Tablet: 2-column grid (md:grid-cols-2)
        Mobile: 1-column stacked (grid-cols-1)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {WEEKLY_SALARY_RANKS.map((rank) => {
          // Determine status dynamically based on user rank level
          let status: 'current' | 'next' | 'locked' | 'unlocked' = 'locked';
          if (rank.level === userRankLevel) {
            status = 'current';
          } else if (rank.level < userRankLevel) {
            status = 'unlocked';
          } else if (rank.level === userRankLevel + 1) {
            status = 'next';
          } else {
            status = 'locked';
          }

          const isCurrent = status === 'current';
          const isNext = status === 'next';
          const isUnlocked = status === 'unlocked';
          const isLocked = status === 'locked';

          // Progress calculation towards this rank
          const progressPercent = Math.min(100, Math.round((userDirects / rank.requiredDirects) * 100));
          const directsShort = Math.max(0, rank.requiredDirects - userDirects);

          return (
            <div
              key={rank.id}
              className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl border ${
                isCurrent
                  ? 'bg-gradient-to-b from-[#131c17]/90 via-[#0d1511]/90 to-[#070b09]/95 border-emerald-400/80 shadow-[0_0_35px_rgba(16,185,129,0.22)] ring-1 ring-emerald-400/30'
                  : isNext
                  ? 'bg-gradient-to-b from-[#0e1b20]/85 via-[#091217]/90 to-[#050b0e]/95 border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.18)]'
                  : isUnlocked
                  ? 'bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 border-emerald-500/30 shadow-md'
                  : 'bg-gradient-to-b from-[#0d1017]/70 via-[#080b10]/80 to-[#05070a]/90 border-zinc-800/80 hover:border-zinc-700/80 shadow-md'
              }`}
            >
              {/* Card Header: Tier Level & Status Badge */}
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                      TIER 0{rank.level}
                    </span>
                    <span className="text-[10px] text-zinc-500">•</span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {rank.level === 1 ? 'Entry Milestone' : `+${rank.additionalDirects} Directs`}
                    </span>
                  </div>

                  {/* Status Badge System */}
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-400/60 text-emerald-300 text-[10px] font-mono font-black uppercase tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>ACTIVE PAYOUT</span>
                    </span>
                  )}
                  {isNext && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/60 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                      <span>NEXT TARGET</span>
                    </span>
                  )}
                  {isUnlocked && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>ACHIEVED</span>
                    </span>
                  )}
                  {isLocked && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-mono">
                      <Lock className="w-3 h-3 text-zinc-400" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>

                {/* Rank Identity Row: Icon, Title & Direct Count */}
                <div className="flex items-center gap-3.5 my-4">
                  {renderRankIcon(rank, status)}
                  <div className="min-w-0">
                    <h3 className="text-lg font-black font-mono tracking-tight text-white truncate">
                      {rank.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 mt-0.5">
                      <strong className="text-emerald-400 font-bold">{rank.requiredDirects}</strong> Cumulative Directs
                    </div>
                  </div>
                </div>

                {/* Primary Payout Box */}
                <div className={`p-4 rounded-2xl border space-y-3 mb-4 ${
                  isCurrent 
                    ? 'bg-zinc-950/90 border-emerald-500/30' 
                    : isNext 
                    ? 'bg-zinc-950/80 border-cyan-500/25' 
                    : 'bg-zinc-950/60 border-zinc-800/80'
                }`}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                      Weekly Salary:
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                        isCurrent ? 'text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]' : isNext ? 'text-cyan-300' : 'text-white'
                      }`}>
                        ${rank.weeklyRewardUsdt}
                      </span>
                      <span className="text-xs font-mono text-zinc-400 font-bold">USDT/wk</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-zinc-900">
                    <span className="text-zinc-400 text-[11px]">Duration:</span>
                    <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold text-[11px]">
                      {rank.maxWeeks} Weeks Max
                    </span>
                  </div>

                  {/* Total Potential with Explicit Calculation Breakdown */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                        Total Potential:
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        (${rank.weeklyRewardUsdt} × {rank.maxWeeks} wks)
                      </span>
                    </div>
                    <span className="text-base font-black font-mono text-emerald-400">
                      ${rank.totalPotentialUsdt.toLocaleString()} USDT
                    </span>
                  </div>
                </div>

                {/* Progress bar for NEXT rank or status insight */}
                {isNext ? (
                  <div className="space-y-1.5 p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 mb-4">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-cyan-300 font-semibold">Progress to {rank.name}:</span>
                      <span className="text-cyan-200 font-bold">{userDirects} / {rank.requiredDirects} ({progressPercent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/80 block text-right">
                      {directsShort} more direct partner{directsShort === 1 ? '' : 's'} needed
                    </span>
                  </div>
                ) : isCurrent ? (
                  <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 mb-4 flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Active Tier Qualified
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Settlement: Mon 00:00 UTC
                    </span>
                  </div>
                ) : isLocked ? (
                  <div className="p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800/80 mb-4 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                    <span>Directs required:</span>
                    <span className="text-zinc-300 font-semibold">{rank.requiredDirects} Directs ({directsShort} away)</span>
                  </div>
                ) : null}

                {/* Description */}
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans pb-2">
                  {rank.description}
                </p>
              </div>

              {/* Card Footer: Quick Action if applicable */}
              {isCurrent && onNavigateToSalary && (
                <button
                  type="button"
                  onClick={onNavigateToSalary}
                  className="mt-2 w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open Live Salary Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
