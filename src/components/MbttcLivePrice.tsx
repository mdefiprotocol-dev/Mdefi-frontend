import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  Layers, 
  ShieldCheck, 
  AlertCircle, 
  BarChart2, 
  Zap, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { MarketStats, mbttcMarketService } from '../services/mbttcMarketService';

interface MbttcLivePriceProps {
  benchmarkRate?: number;
  stats?: MarketStats;
}

export const MbttcLivePrice: React.FC<MbttcLivePriceProps> = ({
  benchmarkRate,
  stats: externalStats,
}) => {
  const [stats, setStats] = useState<MarketStats>(
    externalStats || mbttcMarketService.getMarketStatsSync()
  );

  useEffect(() => {
    if (externalStats) {
      setStats(externalStats);
      return;
    }
    const unsubscribe = mbttcMarketService.subscribe((updated) => {
      setStats(updated);
    });
    return unsubscribe;
  }, [externalStats]);

  const isLive = stats.isLive;
  const currentPrice = benchmarkRate !== undefined && !isLive ? benchmarkRate : stats.price;

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-[#0e1913] via-[#09120e] to-[#060a08] border border-emerald-500/30 p-6 sm:p-7 shadow-[0_0_35px_rgba(16,185,129,0.07)] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-950/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                MBTTC MARKET OVERVIEW
              </span>

              {/* Status Badge: Professional DEX / Telemetry Status */}
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-[10px] font-mono text-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  ● LIVE DEX TELEMETRY
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ● PHASE 7 AMM TELEMETRY
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              {isLive 
                ? 'On-chain BSC DEX AMM pool telemetry &bull; Real-time pricing'
                : 'PancakeSwap V2 AMM Liquidity Pairing Corridor &bull; Target $3.50 USDT'}
            </p>
          </div>
        </div>

        {/* Integration Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs bg-emerald-950/40 border-emerald-500/30 text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-mono text-[11px]">
            {isLive ? 'Connected: PancakeSwap V2 Router' : 'Treasury Liquidity Vault: Protocol Synchronized'}
          </span>
        </div>
      </div>

      {/* Main Price & Metrics Grid (On-Chain Treasury Bond IPO Aligned) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-5">
        {/* Metric 1: Current Price (Anchor $3.50 Target) */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-emerald-500/30 col-span-1 md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 block">
              {isLive ? 'Current On-Chain DEX Rate' : 'Target Launch Valuation (Phase 7)'}
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
              {isLive ? 'LIVE AMM' : 'PRE-MARKET'}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              ${(currentPrice > 0 ? currentPrice : 3.50).toFixed(2)}
            </span>
            <span className="text-lg text-emerald-400 font-mono font-bold">
              USDT
            </span>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              1 MBTTC = ${(currentPrice > 0 ? currentPrice : 3.50).toFixed(2)} USDT
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800/60 text-xs">
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              PancakeSwap V2 BEP-20 Router
            </span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-[11px] text-zinc-300 font-mono">
              Phase 1 Token Production Active
            </span>
          </div>
        </div>

        {/* Metric 2: Treasury Liquidity Accumulated (TreasuryBondIPO getVaultStats) */}
        <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 block">
              Treasury Liquidity
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
              ON-CHAIN
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                ${(stats as any)?.vaultBalance || '0.00'}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">USDT</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono block mt-1">
              Target Pool: ${(stats as any)?.targetVault || '1,000,000.00'} USDT
            </span>
          </div>

          <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1 font-mono font-semibold">
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>Vault Progress: {Number((stats as any)?.progress || 0)}%</span>
          </div>
        </div>

        {/* Metric 3: Trading Infrastructure Status */}
        <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-400">AMM Router</span>
              <span className="font-mono text-emerald-300 font-semibold text-[11px]">
                PancakeSwap V2
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-400">Settlement Chain</span>
              <span className="font-mono text-white text-[11px]">
                BNB Smart Chain (BEP-20)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/60">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                Target Launch
              </span>
              <span className="font-mono text-emerald-400 font-bold text-[11px]">
                Phase 7 DEX Launch
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Transparency Policy */}
      <div className="relative z-10 mt-4 p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
          <strong className="text-zinc-200">Protocol Oracle Telemetry:</strong>{' '}
          MBTTC token minting is fully active on BNB Smart Chain. Automated Market Maker (AMM) liquidity pairing on PancakeSwap V2 opens in Phase 7 anchored to the $3.50 USDT target valuation standard.
        </p>
      </div>
    </div>
  );
};
