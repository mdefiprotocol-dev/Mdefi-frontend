import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Layers, 
  Zap, 
  Gift, 
  Repeat, 
  Droplets, 
  ArrowRightLeft,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { TradingCandle, ChartEcosystemEvent } from './types';

interface ChartTooltipProps {
  candle: TradingCandle;
  x: number;
  y: number;
  containerWidth: number;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  candle,
  x,
  y,
  containerWidth,
}) => {
  // Prevent tooltip from overflowing the right edge
  const tooltipWidth = 240;
  const isRightSide = x > containerWidth - tooltipWidth - 20;
  const leftPos = isRightSide ? x - tooltipWidth - 15 : x + 15;
  const topPos = Math.max(10, Math.min(y - 60, 200));

  const changePrice = candle.close - candle.open;
  const changePercent = ((changePrice / candle.open) * 100).toFixed(2);
  const isPositive = changePrice >= 0;

  return (
    <div
      style={{ left: `${leftPos}px`, top: `${topPos}px` }}
      className="absolute pointer-events-none z-40 w-60 rounded-xl bg-zinc-950/95 border border-emerald-500/40 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-75 text-xs font-mono"
    >
      {/* Header with Time and Status */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <Clock className="w-3 h-3 text-zinc-400" />
          <span className="font-bold">{candle.time}</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-semibold">
          Simulated
        </span>
      </div>

      {/* OHLC Summary */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] mb-2">
        <div className="flex justify-between">
          <span className="text-zinc-400">Open:</span>
          <span className="text-zinc-200 font-bold">${candle.open.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">High:</span>
          <span className="text-emerald-400 font-bold">${candle.high.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Low:</span>
          <span className="text-red-400 font-bold">${candle.low.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Close:</span>
          <span className={isPositive ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
            ${candle.close.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Volume & Change */}
      <div className="flex items-center justify-between border-t border-zinc-900 pt-1.5 text-[11px]">
        <span className="text-zinc-400">24h Delta:</span>
        <span className={`font-bold flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{changePercent}%
        </span>
      </div>
      <div className="flex items-center justify-between text-[11px] mt-0.5">
        <span className="text-zinc-400">Volume:</span>
        <span className="text-zinc-300 font-semibold">{candle.volume.toLocaleString()} MBTTC</span>
      </div>

      {/* Attached Ecosystem Events (Claims, Referrals, Nodes, etc.) */}
      {candle.events && candle.events.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-zinc-800 space-y-1.5">
          <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Ecosystem Activities ({candle.events.length})</span>
          </div>

          {candle.events.map((ev) => (
            <div
              key={ev.id}
              className={`p-1.5 rounded-lg border text-[11px] ${
                ev.isOutgoing
                  ? 'bg-red-950/70 border-red-500/40 text-red-200'
                  : ev.type === 'Package Activation'
                  ? 'bg-emerald-950/80 border-emerald-400/50 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                  : ev.type === 'Matrix Income'
                  ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-200'
                  : ev.type === 'Recycle'
                  ? 'bg-purple-950/70 border-purple-500/40 text-purple-200'
                  : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1">
                  {ev.type === 'Claim' && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                  {ev.type === 'Referral' && <Users className="w-3 h-3 text-emerald-400" />}
                  {ev.type === 'Package Activation' && <Layers className="w-3 h-3 text-emerald-300" />}
                  {ev.type === 'Matrix Income' && <Zap className="w-3 h-3 text-cyan-400" />}
                  {ev.type === 'Recycle' && <Repeat className="w-3 h-3 text-purple-400" />}
                  <span>{ev.title}</span>
                </span>
                <span className={ev.isOutgoing ? 'text-red-400 font-extrabold' : 'text-emerald-400 font-extrabold'}>
                  {ev.amount}
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2">
                {ev.details}
              </div>
              <div className="text-[9px] text-zinc-400 mt-0.5">
                {ev.formattedTime}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
