import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Gift } from 'lucide-react';
import { 
  TradingChartType, 
  TradingTimeframe, 
  TradingCandle, 
  ChartIndicatorSettings, 
  TickerMetrics,
  ChartEcosystemEvent
} from './types';
import { 
  generateCandlesForTimeframe,
  DEFAULT_TARGET_LAUNCH_PRICE,
  createChartEvent,
  mapActivityToEventType
} from './chartDataGenerator';
import { ChartMetricsBar } from './ChartMetricsBar';
import { ChartControls } from './ChartControls';
import { chartHubEventService } from '../../services/chartHubEventService';
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
  // Chart Controls State
  const [chartType, setChartType] = useState<TradingChartType>('Candlestick');
  const [timeframe, setTimeframe] = useState<TradingTimeframe>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hoveredCandle, setHoveredCandle] = useState<TradingCandle | null>(null);

  // Indicators State
  const [indicators, setIndicators] = useState<ChartIndicatorSettings>({
    ma: true,
    volume: true,
    events: true,
    intensity: false,
    grid: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Real On-Chain Hub Contract Events Live Sync
  const [onChainHubEvents, setOnChainHubEvents] = useState<ChartEcosystemEvent[]>([]);

  useEffect(() => {
    let isMounted = true;

    // Fetch full on-chain history across chunks
    chartHubEventService.fetchHistoricalHubEvents().then((events: ChartEcosystemEvent[]) => {
      if (isMounted && Array.isArray(events) && events.length > 0) {
        setOnChainHubEvents(events);
      }
    });

    // Real-time listener for live block mints/claims
    const unsubscribe = chartHubEventService.subscribeToRealtimeHubEvents((newEvent: ChartEcosystemEvent) => {
      if (!isMounted) return;
      setOnChainHubEvents((prev) => {
        if (prev.some((e) => e.txHash === newEvent.txHash)) return prev;
        return [...prev, newEvent];
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 2. Event Deduplication & Master Aggregator
  const allRawActivities = useMemo<any[]>(() => {
    const combined: any[] = [
      ...activities,
      ...onChainHubEvents.map((evt) => ({
        id: evt.id,
        type: evt.type,
        title: evt.title,
        amount: evt.amount,
        details: evt.details,
        timestamp: evt.timestamp,
        txHash: evt.txHash,
      })),
    ];

    const seen = new Set<string>();
    const deduplicated: any[] = [];

    combined.forEach((act) => {
      const key = act.txHash && act.txHash !== '0x...' 
        ? act.txHash 
        : `${act.type}-${act.timestamp}`;
      if (seen.has(key)) return;
      seen.add(key);
      deduplicated.push(act);
    });

    return deduplicated;
  }, [activities, onChainHubEvents]);

  // 3. CANDLE ENGINE (Pure On-Chain Event Driven)
  const candles = useMemo<TradingCandle[]>(() => {
    return generateCandlesForTimeframe(timeframe, allRawActivities, DEFAULT_TARGET_LAUNCH_PRICE);
  }, [timeframe, allRawActivities]);

  // Reset hover state when timeframe changes
  useEffect(() => {
    setHoveredCandle(null);
  }, [timeframe]);

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const handleToggleIndicator = (key: keyof ChartIndicatorSettings) => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Metrics computation
  const latestCandle = candles[candles.length - 1] || null;
  const firstCandle = candles[0] || null;

  const tickerMetrics: TickerMetrics = useMemo(() => {
    const currentPrice = latestCandle ? latestCandle.close : DEFAULT_TARGET_LAUNCH_PRICE;
    const baseOpen = firstCandle ? firstCandle.open : DEFAULT_TARGET_LAUNCH_PRICE;
    const priceChange24h = Number((currentPrice - baseOpen).toFixed(4));
    const priceChangePercent24h = Number(((priceChange24h / baseOpen) * 100).toFixed(2));
    
    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);
    const high24h = highs.length > 0 ? Math.max(...highs) : DEFAULT_TARGET_LAUNCH_PRICE + 0.02;
    const low24h = lows.length > 0 ? Math.min(...lows) : DEFAULT_TARGET_LAUNCH_PRICE - 0.02;

    // Total minted/claimed tokens across the entire history
    const totalCirculatingVolume = allRawActivities.reduce((acc, act) => {
      const cleaned = (act.amount || '').replace(/[^0-9.]/g, '');
      const parsed = parseFloat(cleaned);
      return acc + (isNaN(parsed) ? 0 : parsed);
    }, 0);

    return {
      currentPrice,
      priceChange24h,
      priceChangePercent24h: isNaN(priceChangePercent24h) ? 0 : priceChangePercent24h,
      high24h,
      low24h,
      volume24h: totalCirculatingVolume,
      totalRewardsMbttc,
      totalRewardsUsd,
      activeEventsCount: allRawActivities.length,
      modeLabel: 'LIVE TELEMETRY',
      isSimulated: false,
    };
  }, [candles, latestCandle, firstCandle, totalRewardsMbttc, totalRewardsUsd, allRawActivities]);

  // Coordinate Geometry & Scales
  const svgWidth = 900;
  const svgHeight = 360;
  const padLeft = 20;
  const padRight = 65;
  const padTop = 20;
  const padBottom = 40;

  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;
  const volumeHeight = 55;
  const pricePlotHeight = plotHeight - (indicators.volume ? volumeHeight : 0);

  // Dynamic Scale bounds around Launch Target ($3.50)
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    const baseP = DEFAULT_TARGET_LAUNCH_PRICE;
    if (candles.length === 0) {
      return { 
        minPrice: Number((baseP * 0.98).toFixed(4)), 
        maxPrice: Number((baseP * 1.02).toFixed(4)), 
        maxVolume: 50000 
      };
    }
    const highs = candles.map((c) => chartType === 'Heikin Ashi' ? c.haHigh : c.high);
    const lows = candles.map((c) => chartType === 'Heikin Ashi' ? c.haLow : c.low);
    const vols = candles.map((c) => c.volume);

    const trueMin = Math.min(...lows);
    const trueMax = Math.max(...highs);
    const spread = Math.max(trueMax - trueMin, 0.015);
    // Binance standard: 18% top/bottom headroom prevents steep artificial staircase
    const minP = trueMin - (spread * 0.18);
    const maxP = trueMax + (spread * 0.18);
    const maxV = Math.max(...vols, 100);

    return { minPrice: minP, maxPrice: maxP, maxVolume: maxV };
  }, [candles, chartType]);

  const priceRange = maxPrice - minPrice || 0.01;

  const getY = (price: number) => {
    return padTop + pricePlotHeight - ((price - minPrice) / priceRange) * pricePlotHeight;
  };

  const candleSpacing = plotWidth / (candles.length || 1);
  const candleBodyWidth = Math.max(5, Math.min(candleSpacing * 0.52 * zoomLevel, 12));

  const getX = (index: number) => {
    return padLeft + index * candleSpacing + candleSpacing / 2;
  };

  // Price axis ticks
  const priceTicks = useMemo(() => {
    const ticks = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      const price = minPrice + (priceRange / (count - 1)) * i;
      ticks.push({ price, y: getY(price) });
    }
    return ticks;
  }, [minPrice, priceRange, getY]);

  // SVG Line & Area Paths
  const linePath = useMemo(() => {
    if (candles.length === 0) return '';
    return candles.reduce((acc, c, i) => {
      const x = getX(i);
      const y = getY(chartType === 'Heikin Ashi' ? c.haClose : c.close);
      return i === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  }, [candles, chartType, getX, getY]);

  const areaPath = useMemo(() => {
    if (!linePath || candles.length === 0) return '';
    const bottomY = padTop + pricePlotHeight;
    const firstX = getX(0);
    const lastX = getX(candles.length - 1);
    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  }, [linePath, candles, getX, padTop, pricePlotHeight]);

  // Moving Averages Paths
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
  }, [indicators.ma, candles, getX, getY]);

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
  }, [indicators.ma, candles, getX, getY]);

  // 3-Color Candle Engine Helper
  const getCandleColor = (c: TradingCandle, isHA: boolean = false) => {
    const isGold = isHA ? c.haIsGold : c.isGold;
    const isGreen = isHA ? c.haIsGreen : c.isGreen;
    if (isGold) return '#f59e0b'; // Gold: User Registration
    if (isGreen) return '#10b981'; // Green: Package Buy / Mint
    return '#ef4444'; // Red: Reward Claim
  };

  return (
    <div
      className={`relative rounded-3xl bg-gradient-to-b from-[#0c1611] via-[#08120d] to-[#060a08] border border-emerald-500/30 p-4 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.12)] overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto bg-[#070d0a]' : ''
      }`}
    >
      {/* Background glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[110px]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/8 rounded-full blur-[90px]" 
      />

      {/* Header & Total Rewards */}
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

        {/* Claim Button */}
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

      {/* Professional Metrics Bar */}
      <ChartMetricsBar
        metrics={tickerMetrics}
        hoveredCandle={hoveredCandle}
        latestCandle={latestCandle}
      />

      {/* Chart Controls */}
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

      {/* Viewport Container */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-2xl bg-[#040907]/90 border border-emerald-500/20 overflow-hidden shadow-inner select-none my-2 h-[260px] sm:h-[320px]"
        onMouseLeave={() => setHoveredCandle(null)}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full block"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="terminalAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

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

              {candles.map((_, i) => {
                if (i % 6 !== 0) return null;
                const x = getX(i);
                return (
                  <line
                    key={`v-grid-${i}`}
                    x1={x}
                    y1={padTop}
                    x2={x}
                    y2={padTop + pricePlotHeight}
                    stroke="#1e2329"
                    strokeWidth="0.75"
                    strokeDasharray="none"
                    strokeOpacity="0.12"
                  />
                );
              })}
            </g>
          )}

          {/* 2. Volume Histogram (3-Color Aligned) */}
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
                if (c.volume <= 0) return null;
                const x = getX(i);
                const volHeight = Math.max(3, (c.volume / maxVolume) * (volumeHeight - 10));
                const y = padTop + plotHeight - volHeight;
                const barWidth = Math.max(2, candleBodyWidth * 0.85);
                const barColor = getCandleColor(c);

                return (
                  <rect
                    key={`vol-${i}`}
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={volHeight}
                    fill={barColor}
                    opacity={0.6}
                    rx="1"
                  />
                );
              })}
            </g>
          )}

          {/* 3. Line & Area Chart */}
          {chartType === 'Line' && (
            <path
              d={linePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#emeraldGlow)"
            />
          )}

          {(chartType === 'Area' || chartType === 'Baseline') && (
            <g>
              <path d={areaPath} fill="url(#terminalAreaGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* 4. Bar & OHLC Chart */}
          {(chartType === 'Bar' || chartType === 'OHLC') && (
            <g className="ohlc-bars">
              {candles.map((c, i) => {
                const x = getX(i);
                const yHigh = getY(c.high);
                const yLow = getY(c.low);
                const yOpen = getY(c.open);
                const yClose = getY(c.close);
                const tickLen = Math.max(3, candleBodyWidth / 2);
                const color = getCandleColor(c);

                return (
                  <g 
                    key={`bar-${i}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredCandle(c)}
                  >
                    <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="2" />
                    <line x1={x - tickLen} y1={yOpen} x2={x} y2={yOpen} stroke={color} strokeWidth="2" />
                    <line x1={x} y1={yClose} x2={x + tickLen} y2={yClose} stroke={color} strokeWidth="2" />
                  </g>
                );
              })}
            </g>
          )}

          {/* 5. Candlesticks, Heikin Ashi, & Hollow Candles */}
          {(chartType === 'Candlestick' || chartType === 'Heikin Ashi' || chartType === 'Hollow Candles') && (
            <g className="candles">
              {candles.map((c, i) => {
                const isHA = chartType === 'Heikin Ashi';
                const openVal = isHA ? c.haOpen : c.open;
                const closeVal = isHA ? c.haClose : c.close;
                const highVal = isHA ? c.haHigh : c.high;
                const lowVal = isHA ? c.haLow : c.low;

                const x = getX(i);
                const yHigh = getY(highVal);
                const yLow = getY(lowVal);
                const yOpen = getY(openVal);
                const yClose = getY(closeVal);

                const bodyTop = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

                const isHollow = chartType === 'Hollow Candles';
                const candleColor = getCandleColor(c, isHA);
                const isGreenOrGold = (isHA ? c.haIsGreen : c.isGreen) || (isHA ? c.haIsGold : c.isGold);
                const fillColor = isHollow ? (isGreenOrGold ? 'transparent' : candleColor) : candleColor;

                return (
                  <g 
                    key={`candle-${i}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredCandle(c)}
                  >
                    {/* Upper Wick - Hairline Sharp */}
                    <line
                      x1={x}
                      y1={yHigh}
                      x2={x}
                      y2={bodyTop}
                      stroke={candleColor}
                      strokeWidth="1"
                      opacity="0.9"
                    />
                    {/* Lower Wick - Hairline Sharp */}
                    <line
                      x1={x}
                      y1={bodyTop + bodyHeight}
                      x2={x}
                      y2={yLow}
                      stroke={candleColor}
                      strokeWidth="1"
                      opacity="0.9"
                    />
                    {/* Candle Body - Crisp Pro Box */}
                    <rect
                      x={x - candleBodyWidth / 2}
                      y={bodyTop}
                      width={candleBodyWidth}
                      height={Math.max(bodyHeight, 1.5)}
                      fill={fillColor}
                      stroke={candleColor}
                      strokeWidth="0.8"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* 6. Moving Averages Curves */}
          {indicators.ma && (
            <g className="moving-averages pointer-events-none">
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

          {/* 7. Minimal On-Chain Event Markers */}
          {indicators.events && (
            <g className="ecosystem-events pointer-events-none">
              {candles.map((c, i) => {
                if (!c.events || c.events.length === 0) return null;
                const x = getX(i);
                const hasClaim = c.events.some((e) => e.type === 'Claim');
                const hasReg = c.events.some((e) => e.type === 'Registration');
                const hasPkg = c.events.some((e) => e.type === 'Package Activation' || e.type === 'Referral');

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
                    {hasReg && (
                      <circle
                        cx={x}
                        cy={yHigh - 10}
                        r="3.5"
                        fill="#f59e0b"
                        stroke="#78350f"
                        strokeWidth="1"
                      />
                    )}
                    {hasPkg && !hasReg && (
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

          {/* 8. Right Y-Axis Price Scale */}
          <g className="y-axis-labels pointer-events-none">
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

          {/* 9. Bottom X-Axis Timeline Labels */}
          <g className="x-axis-labels pointer-events-none">
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

      {/* FOOTER BAR: Clean Indicators & 3-Color Ecosystem Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-900/90 text-xs font-mono">
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

          {/* 3-Color Legend */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Registration (Gold)</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Package Buy (Green)</span>
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>Claim (Red)</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>MDeFi Activity Engine · BSC Connected</span>
        </div>
      </div>
    </div>
  );
};