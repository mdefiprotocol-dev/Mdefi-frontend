import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertCircle, 
  ShieldCheck, 
  Activity,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { MarketStats, mbttcMarketService } from '../services/mbttcMarketService';

interface MbttcTradeBarProps {
  stats: MarketStats;
  onSelectAction: (action: 'BUY' | 'SELL') => void;
  onToggleMode?: (newMode: 'demo' | 'live') => void;
}

export const MbttcTradeBar: React.FC<MbttcTradeBarProps> = ({
  stats,
  onSelectAction,
  onToggleMode,
}) => {
  const isLive = stats.isLive;

  return (
    <div className="rounded-2xl bg-zinc-950/90 border border-zinc-800/90 p-3 sm:p-4 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left: Status Badge & Information */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        {/* Market Status Badge */}
        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-[11px] font-mono text-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.35)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              ● LIVE MARKET DATA
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-[11px] font-mono text-amber-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              ● DEMO MARKET DATA
            </span>
          )}

          <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline-block">
            {isLive ? 'BSC DEX AMM' : 'DEMO / SIMULATED'}
          </span>
        </div>

        {/* Interactive Mode Switcher for Testing Transition */}
        {onToggleMode && (
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-mono">
            <button
              type="button"
              onClick={() => onToggleMode('demo')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                !isLive 
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="View Simulated Demo Data"
            >
              Demo
            </button>
            <button
              type="button"
              onClick={() => onToggleMode('live')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                isLive 
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="View Live On-Chain Data"
            >
              Live
            </button>
          </div>
        )}
      </div>

      {/* Middle Notice */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400 font-sans">
        {!isLive ? (
          <span className="flex items-center gap-1.5 text-zinc-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Trading in preview mode. Live execution connects with on-chain DEX deployment.</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Direct contract routing active. Orders settle on BNB Smart Chain.</span>
          </span>
        )}
      </div>

      {/* Right: Binance-inspired [BUY MBTTC] & [SELL MBTTC] Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* BUY BUTTON (Binance Green) */}
        <button
          type="button"
          onClick={() => onSelectAction('BUY')}
          className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider text-black bg-[#0ECB81] hover:bg-[#0bb875] active:scale-95 transition-all shadow-[0_0_20px_rgba(14,203,129,0.3)] cursor-pointer"
        >
          <ArrowDownLeft className="w-4 h-4 stroke-[3]" />
          <span>BUY MBTTC</span>
        </button>

        {/* SELL BUTTON (Binance Red) */}
        <button
          type="button"
          onClick={() => onSelectAction('SELL')}
          className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider text-white bg-[#F6465D] hover:bg-[#e03d52] active:scale-95 transition-all shadow-[0_0_20px_rgba(246,70,93,0.3)] cursor-pointer"
        >
          <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          <span>SELL MBTTC</span>
        </button>
      </div>
    </div>
  );
};
