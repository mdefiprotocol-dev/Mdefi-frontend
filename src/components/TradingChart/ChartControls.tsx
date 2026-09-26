import React, { useState, useRef, useEffect } from 'react';
import { 
  CandlestickChart, 
  TrendingUp, 
  BarChart2, 
  Sliders, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  ChevronDown,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  TradingChartType, 
  TradingTimeframe, 
  ChartIndicatorSettings 
} from './types';

interface ChartControlsProps {
  chartType: TradingChartType;
  onChangeChartType: (type: TradingChartType) => void;
  timeframe: TradingTimeframe;
  onChangeTimeframe: (tf: TradingTimeframe) => void;
  indicators: ChartIndicatorSettings;
  onToggleIndicator: (key: keyof ChartIndicatorSettings) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const CHART_TYPES: { id: TradingChartType; label: string; icon: string }[] = [
  { id: 'Candlestick', label: 'Candlestick', icon: '🕯' },
  { id: 'Line', label: 'Line', icon: '📈' },
  { id: 'Area', label: 'Area', icon: '⛰' },
  { id: 'Bar', label: 'Bar', icon: '📊' },
  { id: 'OHLC', label: 'OHLC', icon: '┼' },
  { id: 'Heikin Ashi', label: 'Heikin Ashi', icon: '⛩' },
  { id: 'Baseline', label: 'Baseline', icon: '⚖' },
  { id: 'Hollow Candles', label: 'Hollow Candles', icon: '▯' },
];

const TIMEFRAMES: TradingTimeframe[] = ['1m', '5m', '15m', '1H', '4H', '1D', '1W', 'ALL'];

export const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  onChangeChartType,
  timeframe,
  onChangeTimeframe,
  indicators,
  onToggleIndicator,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeChartTypeObj = CHART_TYPES.find((ct) => ct.id === chartType) || CHART_TYPES[0];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 py-2.5">
      {/* Left: Chart Type Selector + Timeframes */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Chart Type Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsTypeDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-emerald-500/30 text-xs font-mono font-bold text-white transition-all shadow-sm cursor-pointer"
          >
            <span className="text-emerald-400 text-sm leading-none">{activeChartTypeObj.icon}</span>
            <span>{activeChartTypeObj.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isTypeDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-48 rounded-xl bg-zinc-950 border border-emerald-500/35 shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-zinc-400 font-bold border-b border-zinc-800 mb-1">
                Chart Style
              </div>
              <div className="space-y-0.5">
                {CHART_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      onChangeChartType(type.id);
                      setIsTypeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      chartType === type.id
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">{type.icon}</span>
                      <span>{type.label}</span>
                    </span>
                    {chartType === type.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timeframe Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-zinc-950/90 border border-zinc-800/90">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => onChangeTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Technical Indicators & View Tools */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Indicators Pill Group */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
          <button
            type="button"
            onClick={() => onToggleIndicator('ma')}
            title="Toggle Moving Averages (MA 7 / MA 25)"
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              indicators.ma
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            MA
          </button>
          <button
            type="button"
            onClick={() => onToggleIndicator('volume')}
            title="Toggle Volume Histogram"
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              indicators.volume
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            VOL
          </button>
          <button
            type="button"
            onClick={() => onToggleIndicator('events')}
            title="Toggle Ecosystem Activity Markers (Claims, Referrals, Nodes)"
            className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              indicators.events
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            EVENTS
          </button>
        </div>

        {/* Zoom & View Actions */}
        <div className="flex items-center gap-1 bg-zinc-950/80 p-0.5 rounded-xl border border-zinc-800 text-zinc-400">
          <button
            type="button"
            onClick={onZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onResetZoom}
            title="Reset Zoom & View"
            className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Expanded View' : 'Expand Terminal'}
            className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
