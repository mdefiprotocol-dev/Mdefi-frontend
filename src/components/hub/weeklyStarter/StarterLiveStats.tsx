import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Clock, 
  Users, 
  Share2, 
  Coins, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { rewardDashboardsService } from '../../../services/rewardDashboardsService';
import { WeeklyStarterData } from '../../../types/rewards';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

interface StarterLiveStatsProps {
  onOpenLiveDashboard?: () => void;
}

export const StarterLiveStats: React.FC<StarterLiveStatsProps> = ({ onOpenLiveDashboard }) => {
  const [data, setData] = useState<WeeklyStarterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    rewardDashboardsService.getStarterData().then((res) => {
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const formatCountdown = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hrs = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hrs}h ${mins}m`;
  };

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-3.5">
          <WeeklyRewardAnimatedIcon type="usdt" theme="amber" size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
                Section 10 • Protocol State
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                DEMO / SIMULATED ENVIRONMENT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              LIVE PROTOCOL METRICS
            </h2>
          </div>
        </div>

        {onOpenLiveDashboard && (
          <button
            type="button"
            onClick={onOpenLiveDashboard}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-all shadow-md cursor-pointer shrink-0"
          >
            <span>Open Claim Interface</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs font-mono text-zinc-500">
          Waiting for on-chain data telemetry...
        </div>
      ) : !data ? (
        <div className="p-8 text-center text-xs font-mono text-zinc-500">
          Waiting for on-chain data connection.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            {/* Week Epoch */}
            <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Cycle Epoch</span>
              <span className="text-lg font-bold text-white block">Week #{data.currentWeek}</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {data.status}
              </span>
            </div>

            {/* Countdown */}
            <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Cycle Closing</span>
              <span className="text-lg font-bold text-cyan-300 block">{formatCountdown(data.remainingSeconds)}</span>
              <span className="text-[10px] text-zinc-500">Auto-settles Sunday 23:59 UTC</span>
            </div>

            {/* Directs / Qualification */}
            <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Direct Team</span>
              <span className="text-lg font-bold text-amber-300 block">{data.directPartners} Directs</span>
              <span className="text-[10px] text-zinc-400">Req: 2 to qualify</span>
            </div>

            {/* Allocated Shares */}
            <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Your Shares</span>
              <span className="text-lg font-bold text-emerald-300 block">{data.allocatedShares} Shares</span>
              <span className="text-[10px] text-emerald-400">
                {data.isQualified ? 'Qualified ✓' : 'Under Minimum'}
              </span>
            </div>
          </div>

          {/* Secondary Telemetry: Distributable Pool & Claim Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Current Pool Volume</span>
              <span className="text-xl font-bold text-white mt-1 block">
                ${data.currentPoolUsdt.toLocaleString()} <span className="text-xs text-zinc-400 font-normal">USDT</span>
              </span>
              <span className="text-[10px] text-zinc-500 mt-1 block">Network liquidity in vault</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Estimated Epoch Share</span>
              <span className="text-xl font-bold text-cyan-300 mt-1 block">
                ~${data.estimatedRewardUsdt.toFixed(2)} <span className="text-xs text-zinc-400 font-normal">USDT</span>
              </span>
              <span className="text-[10px] text-zinc-500 mt-1 block">Proportional estimate</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">Claimable Reward</span>
              <span className="text-xl font-bold text-emerald-300 mt-1 block">
                ${data.claimableRewardUsdt.toFixed(2)} <span className="text-xs text-zinc-400 font-normal">USDT</span>
              </span>
              <span className="text-[10px] text-zinc-500 mt-1 block">MBTTC fee: {data.claimFeeMbttc} MBTTC</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
