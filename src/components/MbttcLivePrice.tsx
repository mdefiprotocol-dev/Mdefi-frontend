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

              {/* Status Badge: "● DEMO MARKET DATA" or "● LIVE MARKET DATA" */}
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-[10px] font-mono text-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  ● LIVE MARKET DATA
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  ● DEMO MARKET DATA
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400">
              {isLive 
                ? 'On-chain BSC DEX AMM pool telemetry &bull; Real-time pricing'
                : 'Simulated market data for interface preview & testing'}
            </p>
          </div>
        </div>

        {/* Integration Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
          isLive 
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
        }`}>
          {isLive ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-mono text-[11px]">
                Connected: BSC DEX Smart Contract
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-mono text-[11px]">
                DEMO / SIMULATED MODE (Pre-DEX Deployment)
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Price & Metrics Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-5">
        {/* Metric 1: Current Price */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-emerald-500/20 col-span-1 md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 block">
              {isLive ? 'Current On-Chain Price' : 'Current Price (Simulated Benchmark)'}
            </span>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
              isLive ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950/80 text-amber-300'
            }`}>
              {isLive ? 'LIVE DEX' : 'DEMO'}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              ${currentPrice.toFixed(isLive ? 4 : 2)}
            </span>
            <span className="text-lg text-emerald-400 font-mono font-bold">
              USDT
            </span>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800">
              1 MBTTC ≈ ${currentPrice.toFixed(2)} USDT
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800/60 text-xs">
            <span className="text-[11px] text-emerald-400/90 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isLive ? 'Live On-Chain Liquidity Pair' : 'Simulated Benchmark Corridor'}
            </span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-[11px] text-zinc-400">
              {isLive ? 'Real AMM execution' : 'DEX pool deploy in Phase 7'}
            </span>
          </div>
        </div>

        {/* Metric 2: 24H Price Change */}
        <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 block">
              24H Price Change
            </span>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
              isLive ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950/80 text-amber-300'
            }`}>
              {isLive ? 'LIVE' : 'SIMULATED'}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
                +${stats.change24h.toFixed(3)}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 font-mono text-xs border border-emerald-500/30">
                +{stats.change24hPercent.toFixed(2)}%
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono block mt-1">
              {isLive ? 'Verified 24H DEX Rolling' : 'Demo 24H Simulated Variance'}
            </span>
          </div>

          <div className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>{isLive ? 'Real pool volume active' : 'Simulated baseline steady'}</span>
          </div>
        </div>

        {/* Metric 3: 24H Range & Volume */}
        <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-400">24H High / Low</span>
              <span className="font-mono text-white font-semibold">
                ${stats.high24h.toFixed(3)} / ${stats.low24h.toFixed(3)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-400">24H Volume</span>
              <span className="font-mono text-emerald-300 text-[11px]">
                ${stats.volume24h.toLocaleString()} {isLive ? 'USDT' : '(Simulated)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/60">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                Data Source
              </span>
              <span className="font-mono text-zinc-300 text-[11px]">
                {isLive ? 'BSC On-Chain' : 'Demo Engine'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Transparency Policy */}
      <div className="relative z-10 mt-4 p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          <strong className="text-zinc-200">Data Integrity Policy:</strong>{' '}
          {isLive ? (
            <>
              Live market feed is actively connected to the on-chain DEX pool on BNB Smart Chain. All trades execute directly through decentralized smart contracts.
            </>
          ) : (
            <>
              For the development environment, realistic <strong className="text-amber-300">DEMO / SIMULATED</strong> market data is displayed for testing and preview before smart contract DEX integration goes live. Demo data is never stored on-chain or presented as actual trading history.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
