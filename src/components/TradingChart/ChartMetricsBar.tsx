import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Sparkles, 
  Zap, 
  Users, 
  Layers, 
  Gift, 
  Repeat,
  Radio
} from 'lucide-react';
import { TradingCandle, TickerMetrics, EcosystemEventType } from './types';

interface ChartMetricsBarProps {
  metrics: TickerMetrics;
  hoveredCandle: TradingCandle | null;
  latestCandle: TradingCandle | null;
  onSimulateEvent: (type: EcosystemEventType) => void;
  isLivePulseActive: boolean;
  onToggleLivePulse: () => void;
}

export const ChartMetricsBar: React.FC<ChartMetricsBarProps> = ({
  metrics,
  hoveredCandle,
  latestCandle,
  onSimulateEvent,
  isLivePulseActive,
  onToggleLivePulse,
}) => {
  const activeCandle = hoveredCandle || latestCandle;
  const isPositive = metrics.priceChangePercent24h >= 0;

  return (
    <div className="space-y-3 pb-3 border-b border-zinc-800/80">
      {/* Top Row: Primary Financial Ticker & Live Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Token Symbol, Price & 24h change */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-base sm:text-lg font-black text-white font-mono tracking-tight">
              MBTTC / USD
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/35 text-emerald-400 text-[10px] font-mono font-bold tracking-wider">
              {metrics.modeLabel}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              ${activeCandle ? activeCandle.close.toFixed(4) : metrics.currentPrice.toFixed(4)}
            </span>
            <span
              className={`text-xs font-mono font-bold flex items-center gap-0.5 px-2 py-0.5 rounded ${
                isPositive 
                  ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/25' 
                  : 'text-red-400 bg-red-950/60 border border-red-500/25'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? '+' : ''}{metrics.priceChangePercent24h}%
            </span>
          </div>
        </div>

        {/* Right: Quick Real-Time Simulator Triggers & Pulse Toggle */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Live pulse toggle */}
          <button
            type="button"
            onClick={onToggleLivePulse}
            title={isLivePulseActive ? 'Pause real-time activity pulse' : 'Resume real-time activity pulse'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
              isLivePulseActive
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Radio className={`w-3 h-3 ${isLivePulseActive ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
            <span>{isLivePulseActive ? 'Live Stream: ON' : 'Live Stream: PAUSED'}</span>
          </button>

          {/* Simulate Action Drops */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => onSimulateEvent('Claim')}
              title="Simulate Reward Claim (−Red Candle)"
              className="px-2 py-0.5 rounded text-[10px] font-mono font-medium text-red-300 hover:bg-red-950/60 hover:text-red-200 border border-transparent hover:border-red-500/30 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>− Claim</span>
            </button>
            <button
              type="button"
              onClick={() => onSimulateEvent('Referral')}
              title="Simulate Referral Event (+Green Candle)"
              className="px-2 py-0.5 rounded text-[10px] font-mono font-medium text-emerald-300 hover:bg-emerald-950/60 hover:text-emerald-200 border border-transparent hover:border-emerald-500/30 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Users className="w-2.5 h-2.5 text-emerald-400" />
              <span>+ Ref</span>
            </button>
            <button
              type="button"
              onClick={() => onSimulateEvent('Package Activation')}
              title="Simulate Package Activation (+Strong Green Candle)"
              className="px-2 py-0.5 rounded text-[10px] font-mono font-medium text-emerald-300 hover:bg-emerald-950/60 hover:text-emerald-200 border border-transparent hover:border-emerald-500/30 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Layers className="w-2.5 h-2.5 text-emerald-400" />
              <span>+ Node</span>
            </button>
            <button
              type="button"
              onClick={() => onSimulateEvent('Matrix Income')}
              title="Simulate S4 Matrix Income"
              className="px-2 py-0.5 rounded text-[10px] font-mono font-medium text-cyan-300 hover:bg-cyan-950/60 hover:text-cyan-200 border border-transparent hover:border-cyan-500/30 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-2.5 h-2.5 text-cyan-400" />
              <span>+ Matrix</span>
            </button>
            <button
              type="button"
              onClick={() => onSimulateEvent('Recycle')}
              title="Simulate Matrix Cycle Recycle"
              className="px-2 py-0.5 rounded text-[10px] font-mono font-medium text-purple-300 hover:bg-purple-950/60 hover:text-purple-200 border border-transparent hover:border-purple-500/30 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Repeat className="w-2.5 h-2.5 text-purple-400" />
              <span>Recycle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Detailed Candlestick OHLC + Volume & Events Bar */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-[11px] font-mono bg-zinc-950/60 p-2 sm:px-3 sm:py-1.5 rounded-xl border border-zinc-800/80">
        {/* OHLC Readings */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1 text-zinc-400">
            <span className="text-zinc-500 font-bold">TIME:</span>
            <span className="text-zinc-200 font-semibold">{activeCandle?.time || 'Live'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 font-bold">O:</span>
            <span className="text-zinc-300">{activeCandle?.open.toFixed(4) || '—'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 font-bold">H:</span>
            <span className="text-emerald-400 font-semibold">{activeCandle?.high.toFixed(4) || '—'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 font-bold">L:</span>
            <span className="text-red-400 font-semibold">{activeCandle?.low.toFixed(4) || '—'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 font-bold">C:</span>
            <span className={activeCandle?.isGreen ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {activeCandle?.close.toFixed(4) || '—'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 font-bold">VOL:</span>
            <span className="text-zinc-300">
              {activeCandle ? `${(activeCandle.volume / 1000).toFixed(1)}k MBTTC` : '—'}
            </span>
          </div>
        </div>

        {/* Right side stats: 24h Vol & Active Events count */}
        <div className="flex items-center gap-3 sm:gap-4 text-zinc-400">
          <div className="hidden md:flex items-center gap-1">
            <span className="text-zinc-500">24H VOL:</span>
            <span className="text-zinc-200">{metrics.volume24h.toLocaleString()} MBTTC</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-semibold">{metrics.activeEventsCount} Events Marked</span>
          </div>
        </div>
      </div>
    </div>
  );
};
