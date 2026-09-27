import React from 'react';
import { Radio, Zap } from 'lucide-react';
import { TradingCandle, TickerMetrics } from './types';

interface ChartMetricsBarProps {
  metrics: TickerMetrics;
  hoveredCandle: TradingCandle | null;
  latestCandle: TradingCandle | null;
}

export const ChartMetricsBar: React.FC<ChartMetricsBarProps> = ({
  metrics,
  hoveredCandle,
  latestCandle,
}) => {
  const activeCandle = hoveredCandle || latestCandle;

  // On-Chain 3-Color Dynamic Logic:
  // 1. REGISTRATION / Genesis Mint -> GOLD (#f59e0b)
  // 2. PACKAGE BUY ($10 / $25) -> GREEN (#10b981)
  // 3. REWARD CLAIM -> RED (#ef4444)
  const isGoldCandle = 
    activeCandle?.dominantAction === 'REGISTRATION' || 
    Boolean(activeCandle?.isGold);

  const isGreenCandle = 
    activeCandle?.dominantAction === 'PACKAGE_BUY' || 
    (!isGoldCandle && Boolean(activeCandle?.isGreen));

  const closeColorClass = isGoldCandle
    ? 'text-amber-400 font-bold'
    : isGreenCandle
    ? 'text-emerald-400 font-bold'
    : 'text-red-400 font-bold';

  const actionBadgeText = isGoldCandle
    ? 'REGISTRATION'
    : isGreenCandle
    ? 'PACKAGE BUY'
    : 'REWARD CLAIM';

  // Events count: Shows selected candle's events if hovered, otherwise 24h total
  const displayEventsCount = hoveredCandle?.events 
    ? hoveredCandle.events.length 
    : metrics.activeEventsCount;

  return (
    <div className="space-y-2 pb-2.5 border-b border-zinc-800/80">
      {/* Top Stream Status & Protocol Sync */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
            BSC On-Chain Protocol Feed
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
            LIVE SYNC
          </span>

          {/* FOMO HIGHLIGHTER BADGE: TARGET LAUNCH $3.50 · 2M CAP */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)] animate-pulse">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>TARGET LAUNCH: $3.50</span>
            <span className="text-zinc-500">|</span>
            <span className="text-emerald-300">2M CAP LIMIT</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Candle State Pill */}
          {activeCandle && (
            <span 
              className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                isGoldCandle 
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' 
                  : isGreenCandle 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                  : 'bg-red-950/40 border-red-500/40 text-red-300'
              }`}
            >
              {actionBadgeText}
            </span>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border bg-emerald-950/50 border-emerald-500/30 text-emerald-300">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Stream: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Candlestick Real-Time OHLC + Volume Bar */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-[11px] font-mono bg-zinc-950/70 p-2 sm:px-3 sm:py-1.5 rounded-xl border border-zinc-800/80">
        {/* OHLC Readings */}
        <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1 text-zinc-400">
            <span className="text-zinc-500 font-bold">TIME:</span>
            <span className="text-zinc-200 font-semibold">{activeCandle?.time || 'Live'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 font-bold">O:</span>
            <span className="text-zinc-300">{activeCandle ? activeCandle.open.toFixed(4) : '—'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 font-bold">H:</span>
            <span className="text-emerald-400 font-semibold">{activeCandle ? activeCandle.high.toFixed(4) : '—'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 font-bold">L:</span>
            <span className="text-red-400 font-semibold">{activeCandle ? activeCandle.low.toFixed(4) : '—'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 font-bold">C:</span>
            <span className={closeColorClass}>
              {activeCandle ? activeCandle.close.toFixed(4) : '—'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 font-bold">VOL:</span>
            <span className="text-zinc-300">
              {activeCandle ? `${(activeCandle.volume / 1000).toFixed(1)}k MBTTC` : '—'}
            </span>
          </div>
        </div>

        {/* Right side stats: 24h Vol & Real On-Chain Activity Count */}
        <div className="flex items-center gap-3 sm:gap-4 text-zinc-400">
          <div className="hidden md:flex items-center gap-1">
            <span className="text-zinc-500">24H VOL:</span>
            <span className="text-zinc-200">{metrics.volume24h.toLocaleString()} MBTTC</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-semibold">
              {displayEventsCount} {hoveredCandle ? 'Events In Candle' : 'Events Logged'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};