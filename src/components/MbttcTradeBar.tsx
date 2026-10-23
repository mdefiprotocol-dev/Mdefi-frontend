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
      {/* Left: Status Badge & Router Information */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ● PHASE 7 DEX ROUTER
          </span>

          <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline-block">
            PancakeSwap V2 / BSC
          </span>
        </div>
      </div>

      {/* Middle Notice: Target Launch Valuation Standard */}
      <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Target Launch Price: $3.50 USDT &bull; AMM Liquidity Pairing in Phase 7</span>
        </span>
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
