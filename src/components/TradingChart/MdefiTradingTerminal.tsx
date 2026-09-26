import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  Gift
} from 'lucide-react';
import { 
  TradingChartType, 
  TradingTimeframe, 
  TradingCandle, 
  ChartIndicatorSettings, 
  TickerMetrics 
} from './types';
import { 
  generateCandlesForTimeframe 
} from './chartDataGenerator';
import { ChartMetricsBar } from './ChartMetricsBar';
import { ChartControls } from './ChartControls';
import { ActivityItem } from '../../types';

interface MdefiTradingTerminalChartProps {
  totalRewardsMbttc?: string;
  totalRewardsUsd?: string;
  activities?: ActivityItem[];
  onOpenClaimModal?: (type: 'Registration' | 'Referral' | 'Package') => void;
  onOpenMatrixModal?: () => void;
  onNavigateHub?: () => void;
}

export const MdefiTradingTerminalChart: React.FC<MdefiTradingTerminalChartProps> = ({
  totalRewardsMbttc = '0.00',
  totalRewardsUsd = '0.00',
  activities = [],
  onOpenClaimModal,
}) => {
  // Chart state
  const [chartType, setChartType] = useState<TradingChartType>('Candlestick');
  const [timeframe, setTimeframe] = useState<TradingTimeframe>('1D');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Indicators toggle
  const [indicators, setIndicators] = useState<ChartIndicatorSettings>({
    ma: true,
    volume: true,
    events: true,
    intensity: false,
    grid: true,
  });

  // Candles data
  const [candles, setCandles] = useState<TradingCandle[]>(() => 
    generateCandlesForTimeframe('1D', activities)
  );

  // Regenerate when timeframe or activities changes
  useEffect(() => {
    setCandles(generateCandlesForTimeframe(timeframe, activities));
  }, [timeframe, activities]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleToggleIndicator = (key: keyof ChartIndicatorSettings) => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Compute metrics
  const latestCandle = candles[candles.length - 1] || null;
  const firstCandle = candles[0] || null;

  const tickerMetrics: TickerMetrics = useMemo(() => {
    const currentPrice = latestCandle ? latestCandle.close : 1.50;
    const baseOpen = firstCandle ? firstCandle.open : 1.48;
    const priceChange24h = Number((currentPrice - baseOpen).toFixed(4));
    const priceChangePercent24h = Number(((priceChange24h / baseOpen) * 100).toFixed(2));
    
    const high24h = candles.length > 0 ? Math.max(...candles.map((c) => c.high)) : 1.528;
    const low24h = candles.length > 0 ? Math.min(...candles.map((c) => c.low)) : 1.478;
    const volume24h = candles.reduce((sum, c) => sum + c.volume, 0);
    const totalEvents = candles.reduce((count, c) => count + (c.events?.length || 0), 0);

    return {
      currentPrice,
      priceChange24h,
      priceChangePercent24h: isNaN(priceChangePercent24h) ? 0 : priceChangePercent24h,
      high24h,
      low24h,
      volume24h,
      totalRewardsMbttc,
      totalRewardsUsd,
      activeEventsCount: totalEvents,
      modeLabel: 'LIVE TELEMETRY',
      isSimulated: false,
    };
  }, [candles, latestCandle, firstCandle, totalRewardsMbttc, totalRewardsUsd]);

  // Coordinate geometry & scales
  const svgWidth = 900;
  const svgHeight = 360;
  const padLeft = 20;
  const padRight = 65; // Price scale
  const padTop = 20;
  const padBottom = 40; // Timeline and volume scale

  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;
  const volumeHeight = 55;
  const pricePlotHeight = plotHeight - (indicators.volume ? volumeHeight : 0);

  // Min and Max prices for scaling
  const { minPrice, maxPrice, maxVolume, baselinePrice } = useMemo(() => {
    if (candles.length === 0) {
      return { minPrice: 1.45, maxPrice: 1.55, maxVolume: 50000, baselinePrice: 1.50 };
    }
    const highs = candles.map((c) => chartType === 'Heikin Ashi' ? c.haHigh : c.high);
    const lows = candles.map((c) => chartType === 'Heikin Ashi' ? c.haLow : c.low);
    const vols = candles.map((c) => c.volume);

    const minP = Math.min(...lows) * 0.996;
    const maxP = Math.max(...highs) * 1.004;
    const maxV = Math.max(...vols, 1000);
    const baseP = (minP + maxP) / 2;

    return { minPrice: minP, maxPrice: maxP, maxVolume: maxV, baselinePrice: baseP };
  }, [candles, chartType]);

  const priceRange = maxPrice - minPrice || 0.01;

  // Coordinate mapping functions
  const getY = (price: number) => {
    return padTop + pricePlotHeight - ((price - minPrice) / priceRange) * pricePlotHeight;
  };

  const candleSpacing = plotWidth / (candles.length || 1);
  const candleBodyWidth = Math.max(6, Math.min(candleSpacing * 0.75 * zoomLevel, 22));

  const getX = (index: number) => {
    return padLeft + index * candleSpacing + candleSpacing / 2;
  };

  // Price axis tick levels
  const priceTicks = useMemo(() => {
    const ticks = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      const price = minPrice + (priceRange / (count - 1)) * i;
      ticks.push({ price, y: getY(price) });
    }
    return ticks;
  }, [minPrice, priceRange]);

  // SVG Paths for Line, Area, and Baseline
  const linePath = useMemo(() => {
    if (candles.length === 0) return '';
    return candles.reduce((acc, c, i) => {
      const x = getX(i);
      const y = getY(chartType === 'Heikin Ashi' ? c.haClose : c.close);
      return i === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  }, [candles, chartType]);

  const areaPath = useMemo(() => {
    if (!linePath || candles.length === 0) return '';
    const bottomY = padTop + pricePlotHeight;
    const firstX = getX(0);
    const lastX = getX(candles.length - 1);
    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  }, [linePath, candles]);

  // MA lines paths
  const ma7Path = useMemo(() => {
    if (!indicators.ma || candles.length < 7) return '';
    let path = '';
    candles.forEach((c, i) => {
      if (c.ma7 !== undefined) {
        const x = getX(i);
        const y = getY(c.ma7);
        path = path === '' ? `M ${x},${y}` : `${path} L ${x},${y}`;
      }
    });
    return path;
  }, [indicators.ma, candles]);

  const ma25Path = useMemo(() => {
    if (!indicators.ma || candles.length < 25) return '';
    let path = '';
    candles.forEach((c, i) => {
      if (c.ma25 !== undefined) {
        const x = getX(i);
        const y = getY(c.ma25);
        path = path === '' ? `M ${x},${y}` : `${path} L ${x},${y}`;
      }
    });
    return path;
  }, [indicators.ma, candles]);

  return (
    <div
      className={`relative rounded-3xl bg-gradient-to-b from-[#0c1611] via-[#08120d] to-[#060a08] border border-emerald-500/30 p-4 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.12)] overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto bg-[#070d0a]' : ''
      }`}
    >
      {/* Background glow ambiance */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[110px]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/8 rounded-full blur-[90px]" 
      />

      {/* TOP SECTION: Clean Header & Live Total Rewards */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2 text-zinc-400 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
              TOTAL MDEFI REWARDS & ACTIVITY TERMINAL
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {totalRewardsMbttc} <span className="text-2xl sm:text-3xl text-emerald-400 font-bold">MBTTC</span>
            </h1>
          </div>
        </div>

        {/* Claim Yields Button Only */}
        <div className="flex items-center gap-2">
          {onOpenClaimModal && (
            <button
              type="button"
              onClick={() => onOpenClaimModal('Referral')}
              className="px-5 py-2.5 rounded-xl bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Gift className="w-4 h-4 text-emerald-400" />
              <span>Claim Yields</span>
            </button>
          )}
        </div>
      </div>

      {/* PROFESSIONAL METRICS BAR (OHLC & Telemetry) */}
      <ChartMetricsBar
        metrics={tickerMetrics}
        hoveredCandle={null}
        latestCandle={latestCandle}
        onSimulateEvent={() => {}}
        isLivePulseActive={false}
        onToggleLivePulse={() => {}}
      />

      {/* CHART CONTROLS (Chart Type, Timeframes, Indicators, Zoom) */}
      <ChartControls
        chartType={chartType}
        onChangeChartType={setChartType}
        timeframe={timeframe}
        onChangeTimeframe={setTimeframe}
        indicators={indicators}
        onToggleIndicator={handleToggleIndicator}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
      />

      {/* MAIN TRADING VIEWPORT CONTAINER (Fixed Compact Height - Zero Extra Black Space) */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-2xl bg-[#040907]/90 border border-emerald-500/20 overflow-hidden shadow-inner select-none my-2 h-[260px] sm:h-[320px]"
      >
        {/* SVG Drawing Canvas */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full block"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Area Gradient */}
            <linearGradient id="terminalAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Candle glow filter */}
            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Grid Lines */}
          {indicators.grid && (
            <g className="grid-lines opacity-30">
              {priceTicks.map((tick, i) => (
                <line
                  key={`h-grid-${i}`}
                  x1={padLeft}
                  y1={tick.y}
                  x2={svgWidth - padRight}
                  y2={tick.y}
                  stroke="#10b981"
                  strokeWidth="0.75"
                  strokeDasharray="3 3"
                  strokeOpacity="0.15"
                />
              ))}

              {candles.map((c, i) => {
                if (i % 6 !== 0) return null;
                const x = getX(i);
                return (
                  <line
                    key={`v-grid-${i}`}
                    x1={x}
                    y1={padTop}
                    x2={x}
                    y2={padTop + pricePlotHeight}
                    stroke="#10b981"
                    strokeWidth="0.75"
                    strokeDasharray="3 3"
                    strokeOpacity="0.12"
                  />
                );
              })}
            </g>
          )}

          {/* 2. Volume Histogram */}
          {indicators.volume && (
            <g className="volume-bars">
              <line
                x1={padLeft}
                y1={padTop + pricePlotHeight}
                x2={svgWidth - padRight}
                y2={padTop + pricePlotHeight}
                stroke="#27272a"
                strokeWidth="1"
              />
              {candles.map((c, i) => {
                const x = getX(i);
                const volHeight = Math.max(3, (c.volume / maxVolume) * (volumeHeight - 10));
                const y = padTop + plotHeight - volHeight;
                const barWidth = Math.max(2, candleBodyWidth * 0.85);

                return (
                  <rect
                    key={`vol-${i}`}
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={volHeight}
                    fill={c.isGreen ? '#10b981' : '#ef4444'}
                    opacity={0.4}
                    rx="1"
                  />
                );
              })}
            </g>
          )}

          {/* 3. Candlesticks */}
          {(chartType === 'Candlestick' || chartType === 'Heikin Ashi' || chartType === 'Hollow Candles') && (
            <g className="candles">
              {candles.map((c, i) => {
                const isHA = chartType === 'Heikin Ashi';
                const openVal = isHA ? c.haOpen : c.open;
                const closeVal = isHA ? c.haClose : c.close;
                const highVal = isHA ? c.haHigh : c.high;
                const lowVal = isHA ? c.haLow : c.low;
                const isGreen = isHA ? c.haIsGreen : c.isGreen;

                const x = getX(i);
                const yHigh = getY(highVal);
                const yLow = getY(lowVal);
                const yOpen = getY(openVal);
                const yClose = getY(closeVal);

                const bodyTop = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

                const candleColor = isGreen ? '#10b981' : '#ef4444';

                return (
                  <g key={`candle-${i}`}>
                    {/* Upper Wick */}
                    <line
                      x1={x}
                      y1={yHigh}
                      x2={x}
                      y2={bodyTop}
                      stroke={candleColor}
                      strokeWidth="1.5"
                    />
                    {/* Lower Wick */}
                    <line
                      x1={x}
                      y1={bodyTop + bodyHeight}
                      x2={x}
                      y2={yLow}
                      stroke={candleColor}
                      strokeWidth="1.5"
                    />
                    {/* Candle Body */}
                    <rect
                      x={x - candleBodyWidth / 2}
                      y={bodyTop}
                      width={candleBodyWidth}
                      height={bodyHeight}
                      fill={candleColor}
                      stroke={candleColor}
                      strokeWidth={1}
                      rx="1"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* 4. Moving Averages Curves */}
          {indicators.ma && (
            <g className="moving-averages">
              {ma7Path && (
                <path
                  d={ma7Path}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.6"
                  opacity="0.85"
                />
              )}
              {ma25Path && (
                <path
                  d={ma25Path}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.6"
                  opacity="0.85"
                />
              )}
            </g>
          )}

          {/* 5. Minimal Event Markers (Above/Below Candles) */}
          {indicators.events && (
            <g className="ecosystem-events">
              {candles.map((c, i) => {
                if (!c.events || c.events.length === 0) return null;
                const x = getX(i);
                const hasClaim = c.events.some((e) => e.type === 'Claim');
                const hasPackageOrRef = c.events.some((e) => e.type === 'Package Activation' || e.type === 'Referral');

                const yHigh = getY(c.high);
                const yLow = getY(c.low);

                return (
                  <g key={`evt-marker-${i}`}>
                    {hasClaim && (
                      <circle
                        cx={x}
                        cy={yLow + 10}
                        r="3.5"
                        fill="#ef4444"
                        stroke="#7f1d1d"
                        strokeWidth="1"
                      />
                    )}
                    {hasPackageOrRef && (
                      <circle
                        cx={x}
                        cy={yHigh - 10}
                        r="3.5"
                        fill="#10b981"
                        stroke="#064e3b"
                        strokeWidth="1"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 6. Right Y-Axis Price Scale */}
          <g className="y-axis-labels">
            {priceTicks.map((tick, i) => (
              <text
                key={`tick-${i}`}
                x={svgWidth - padRight + 6}
                y={tick.y + 3.5}
                fill="#71717a"
                fontSize="10"
                fontFamily="monospace"
              >
                ${tick.price.toFixed(4)}
              </text>
            ))}
          </g>

          {/* 7. Bottom X-Axis Timeline Labels */}
          <g className="x-axis-labels">
            {candles.map((c, i) => {
              if (i % 6 !== 0 && i !== candles.length - 1) return null;
              const x = getX(i);
              return (
                <text
                  key={`time-lbl-${i}`}
                  x={x}
                  y={padTop + plotHeight + 16}
                  textAnchor="middle"
                  fill="#71717a"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {c.time}
                </text>
              );
            })}
          </g>
        </svg>
      </div>

      {/* FOOTER BAR: Clean Indicators & Ecosystem Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-900/90 text-xs font-mono">
        {/* Left: MA & Events Legend */}
        <div className="flex items-center gap-4 flex-wrap text-[11px] text-zinc-400">
          {indicators.ma && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-sky-400 rounded-full" />
                <span className="text-zinc-300">MA(7): ${latestCandle?.ma7?.toFixed(4) || '—'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-amber-400 rounded-full" />
                <span className="text-zinc-300">MA(25): ${latestCandle?.ma25?.toFixed(4) || '—'}</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Mint (Referral / Node)</span>
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>Claim</span>
            </span>
          </div>
        </div>

        {/* Right: Real Protocol Status */}
        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>MDeFi Activity Engine · BSC Connected</span>
        </div>
      </div>
    </div>
  );
};