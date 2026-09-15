import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Award, 
  Clock, 
  TrendingUp, 
  Coins, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { WeeklySalaryData } from '../../../types/rewards';
import { rewardDashboardsService } from '../../../services/rewardDashboardsService';
import { NavPage } from '../../../types';

interface UserSalaryStatsProps {
  onNavigate?: (page: NavPage) => void;
}

export const UserSalaryStats: React.FC<UserSalaryStatsProps> = ({ onNavigate }) => {
  const [salaryData, setSalaryData] = useState<WeeklySalaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const data = await rewardDashboardsService.getSalaryData();
        if (mounted) {
          setSalaryData(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
            Account Telemetry
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>LIVE ACCOUNT SALARY STATUS</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-zinc-950 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Connected Node State
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-amber-950/60 text-amber-300 border border-amber-500/30">
            DEMO / SIMULATED
          </span>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center font-mono text-xs text-zinc-400 animate-pulse">
          Connecting to contract state telemetry...
        </div>
      ) : salaryData ? (
        <div className="space-y-6">
          {/* Main 4 Metric Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            {/* 1: Current Rank */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">CURRENT RANK</span>
              <span className="text-base font-black text-white block">
                {salaryData.currentRankName}
              </span>
              <span className="text-[10px] text-emerald-400 block font-semibold">
                Level 0{salaryData.currentRankLevel}
              </span>
            </div>

            {/* 2: Direct Count */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">DIRECT COUNT</span>
              <span className="text-base font-black text-emerald-300 block">
                {salaryData.directPartners} Partners
              </span>
              <span className="text-[10px] text-zinc-400 block">
                Qualified Directs
              </span>
            </div>

            {/* 3: Weekly Reward */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">WEEKLY REWARD</span>
              <span className="text-base font-black text-cyan-300 block">
                ${salaryData.weeklySalaryUsdt.toFixed(2)} USDT
              </span>
              <span className="text-[10px] text-zinc-400 block">
                Per 7-day Epoch
              </span>
            </div>

            {/* 4: Pending Reward */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">PENDING REWARD</span>
              <span className="text-base font-black text-teal-300 block">
                ${salaryData.pendingSalaryUsdt.toFixed(2)} USDT
              </span>
              <span className="text-[10px] text-zinc-400 block">
                {salaryData.pendingWeeks} Weeks Unclaimed
              </span>
            </div>
          </div>

          {/* Detailed Status Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-400">NEXT RANK:</span>
              <span className="font-bold text-white">{salaryData.nextRankName}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-400">DIRECTS REQUIRED:</span>
              <span className="font-bold text-emerald-400">{salaryData.remainingDirectsForNext} more</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-400">RANK PROGRESS:</span>
              <span className="font-bold text-cyan-300">{salaryData.nextRankProgressPercent}%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-400">MAXIMUM WEEKS:</span>
              <span className="font-bold text-zinc-200">12 Weeks</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-400">CLAIMED WEEKS:</span>
              <span className="font-bold text-zinc-200">{salaryData.totalClaimsCount} Weeks</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-400">REMAINING WEEKS:</span>
              <span className="font-bold text-emerald-400">{salaryData.remainingClaimableWeeks} Weeks</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex justify-between items-center sm:col-span-2 lg:col-span-3">
              <span className="text-zinc-400">NEXT CLAIM CYCLE TIME:</span>
              <span className="font-bold text-teal-300">{salaryData.nextClaimDateFormatted}</span>
            </div>
          </div>

          {/* Action To Live Dashboard */}
          {onNavigate && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-emerald-500/30 gap-3">
              <div className="text-xs text-zinc-300 font-mono">
                Looking to claim mature weekly rewards or view transaction histories?
              </div>
              <button
                type="button"
                onClick={() => onNavigate('weekly_passive_salary')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all shrink-0"
              >
                <span>Open Live Salary View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 text-center font-mono text-xs text-zinc-500">
          Waiting for on-chain data
        </div>
      )}
    </div>
  );
};
