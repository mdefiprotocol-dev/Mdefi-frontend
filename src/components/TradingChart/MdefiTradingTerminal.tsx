import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Activity, 
  Layers, 
  Users, 
  Zap, 
  Repeat, 
  Gift,
  ShieldCheck,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  Clock,
  ChevronDown
} from 'lucide-react';
import { 
  TradingChartType, 
  TradingTimeframe, 
  TradingCandle, 
  ChartIndicatorSettings, 
  TickerMetrics, 
  ChartEcosystemEvent, 
  EcosystemEventType 
} from './types';
import { 
  generateCandlesForTimeframe, 
  appendEcosystemEventToCandles, 
  createChartEvent 
} from './chartDataGenerator';
import { ChartMetricsBar } from './ChartMetricsBar';
import { ChartControls } from './ChartControls';
import { ChartTooltip } from './ChartTooltip';
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
  totalRewardsMbttc = '1,284.50',
  totalRewardsUsd = '2,595.00',
  activities = [],
  onOpenClaimModal,
  onOpenMatrixModal,
  onNavigateHub,
}) => {
  // Chart state
  const [chartType, setChartType] = useState<TradingChartType>('Candlestick');
  const [timeframe, setTimeframe] = useState<TradingTimeframe>('1D');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLivePulseActive, setIsLivePulseActive] = useState<boolean>(true);

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

  // Regenerate when timeframe changes
  useEffect(() => {
    setCandles(generateCandlesForTimeframe(timeframe, activities));
    setHoveredCandle(null);
  }, [timeframe]);

  // Real-time activity pulse simulator (gives genuine trading terminal feel)
  useEffect(() => {
    if (!isLivePulseActive) return;

    const interval = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const lastIdx = prev.length - 1;
        const last = prev[lastIdx];
        // Micro fluctuation (+- 0.0008)
        const delta = (Math.random() - 0.48) * 0.0016;
        const newClose = Number((last.close + delta).toFixed(4));
        const newHigh = Number(Math.max(last.high, newClose).toFixed(4));
        const newLow = Number(Math.min(last.low, newClose).toFixed(4));
        const newIsGreen = newClose >= last.open;
        const newVolume = last.volume + Math.floor(Math.random() * 45);

        const updated = [...prev];
        updated[lastIdx] = {
          ...last,
          close: newClose,
          high: newHigh,
          low: newLow,
          isGreen: newIsGreen,
          volume: newVolume,
          volumeUsd: Math.round(newVolume * newClose),
        };
        return updated;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isLivePulseActive]);

  // Interaction state
  const [hoveredCandle, setHoveredCandle] = useState<TradingCandle | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setHoveredCandle(null);
    setMousePos(null);
  };

  const handleToggleIndicator = (key: keyof ChartIndicatorSettings) => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Quick simulation trigger for testing and visual reaction
  const handleSimulateEvent = useCallback((type: EcosystemEventType) => {
    let title = 'Ecosystem Event';
    let amount = '+25.00 MBTTC';
    let details = 'Simulated node activity event';

    if (type === 'Claim') {
      title = 'Reward Claim';
      amount = '−85.00 MBTTC';
      details = 'Simulated reward withdrawal to connected wallet';
    } else if (type === 'Referral') {
      title = 'Direct Referral Bonus';
      amount = '+45.00 MBTTC';
      details = 'Frontline referral partner registered';
    } else if (type === 'Package Activation') {
      title = 'Package Activation';
      amount = '+$120.00 USDT';
      details = 'Package: Nexus Prime (Simulated Node)';
    } else if (type === 'Matrix Income') {
      title = 'S4 Matrix Spillover';
      amount = '+30.00 MBTTC';
      details = 'Senior Node 2x2 matrix level 2 cycle yield';
    } else if (type === 'Recycle') {
      title = 'Cycle Recycle';
      amount = 'Cycle Complete';
      details = 'Matrix position completed & recycled';
    }

    const newEvent = createChartEvent(type, title, amount, details);
    setCandles((prev) => appendEcosystemEventToCandles(prev, newEvent));
  }, []);

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
      priceChangePercent24h: isNaN(priceChangePercent24h) ? 14.8 : priceChangePercent24h,
      high24h,
      low24h,
      volume24h,
      totalRewardsMbttc,
      totalRewardsUsd,
      activeEventsCount: totalEvents,
      modeLabel: 'SIMULATED ENGINE',
      isSimulated: true,
    };
  }, [candles, latestCandle, firstCandle, totalRewardsMbttc, totalRewardsUsd]);

  // Coordinate geometry & scales
  const svgWidth = 900;
  const svgHeight = 400;
  const padLeft = 20;
  const padRight = 65; // Price scale
  const padTop = 30;
  const padBottom = 55; // Timeline and volume scale

  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;
  const volumeHeight = 65;
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
  const getY = useCallback((price: number) => {
    return padTop + pricePlotHeight - ((price - minPrice) / priceRange) * pricePlotHeight;
  }, [padTop, pricePlotHeight, minPrice, priceRange]);

  const candleSpacing = plotWidth / (candles.length || 1);
  const candleBodyWidth = Math.max(3, Math.min(candleSpacing * 0.65 * zoomLevel, 24));

  const getX = useCallback((index: number) => {
    return padLeft + index * candleSpacing + candleSpacing / 2;
  }, [padLeft, candleSpacing]);

  // Handle pointer tracking
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouseX to nearest candle index
    const scaleFactor = rect.width / svgWidth;
    const scaledX = mouseX / scaleFactor;

    const relativeX = scaledX - padLeft;
    const idx = Math.floor(relativeX / candleSpacing);

    if (idx >= 0 && idx < candles.length) {
      setHoveredCandle(candles[idx]);
      setMousePos({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCandle(null);
    setMousePos(null);
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
  }, [minPrice, priceRange, getY]);

  // SVG Paths for Line, Area, and Baseline
  const linePath = useMemo(() => {
    if (candles.length === 0) return '';
    return candles.reduce((acc, c, i) => {
      const x = getX(i);
      const y = getY(chartType === 'Heikin Ashi' ? c.haClose : c.close);
      return i === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  }, [candles, getX, getY, chartType]);

  const areaPath = useMemo(() => {
    if (!linePath || candles.length === 0) return '';
    const bottomY = padTop + pricePlotHeight;
    const firstX = getX(0);
    const lastX = getX(candles.length - 1);
    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  }, [linePath, candles, getX, padTop, pricePlotHeight]);

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

      {/* TOP SECTION: Financial Overview & Total Rewards */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-4">
        <div>
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
              TOTAL MDEFI REWARDS & ACTIVITY TERMINAL
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/35 text-emerald-400 text-[10px] font-mono font-semibold">
              DEMO SIMULATION
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {totalRewardsMbttc} <span className="text-2xl sm:text-3xl text-emerald-400 font-bold">MBTTC</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-base text-zinc-300 font-mono font-semibold">
              ≈ ${totalRewardsUsd} USD
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
              <TrendingUp className="w-3 h-3" />
              +14.8% this cycle
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              PRO TRADING TERMINAL · SIMULATED ENGINE
            </span>
          </div>
        </div>

        {/* Claim & Quick Hub Links */}
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenClaimModal && (
            <button
              type="button"
              onClick={() => onOpenClaimModal('Referral')}
              className="px-4 py-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Gift className="w-3.5 h-3.5 text-emerald-400" />
              <span>Claim Yields</span>
            </button>
          )}
          {onOpenMatrixModal && (
            <button
              type="button"
              onClick={onOpenMatrixModal}
              className="px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>S4 Matrix</span>
            </button>
          )}
        </div>
      </div>

      {/* PROFESSIONAL METRICS BAR (OHLC, Ticker, Quick Simulators) */}
      <ChartMetricsBar
        metrics={tickerMetrics}
        hoveredCandle={hoveredCandle}
        latestCandle={latestCandle}
        onSimulateEvent={handleSimulateEvent}
        isLivePulseActive={isLivePulseActive}
        onToggleLivePulse={() => setIsLivePulseActive((p) => !p)}
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

      {/* MAIN TRADING VIEWPORT CONTAINER */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-2xl bg-[#040907]/90 border border-emerald-500/20 overflow-hidden shadow-inner cursor-crosshair select-none my-2"
        style={{ minHeight: isFullscreen ? '520px' : '380px' }}
      >
        {/* Floating Tooltip */}
        {hoveredCandle && mousePos && (
          <ChartTooltip
            candle={hoveredCandle}
            x={mousePos.x}
            y={mousePos.y}
            containerWidth={containerRef.current ? containerRef.current.clientWidth : 800}
          />
        )}

        {/* SVG Drawing Canvas */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Area Gradient */}
            <linearGradient id="terminalAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Baseline positive gradient */}
            <linearGradient id="baselineGreenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Baseline negative gradient */}
            <linearGradient id="baselineRedGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>

            {/* Candle glow filter */}
            <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Subtle Grid Lines */}
          {indicators.grid && (
            <g className="grid-lines opacity-40">
              {/* Horizontal grid lines */}
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

              {/* Vertical timeline grid lines */}
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

          {/* 2. Baseline reference line (when Baseline chart type is active) */}
          {chartType === 'Baseline' && (
            <g>
              <line
                x1={padLeft}
                y1={getY(baselinePrice)}
                x2={svgWidth - padRight}
                y2={getY(baselinePrice)}
                stroke="#6ee7b7"
                strokeWidth="1.2"
                strokeDasharray="4 2"
                opacity="0.6"
              />
              <text
                x={padLeft + 5}
                y={getY(baselinePrice) - 4}
                fill="#6ee7b7"
                fontSize="10"
                fontFamily="monospace"
                opacity="0.8"
              >
                Baseline: ${baselinePrice.toFixed(4)}
              </text>
            </g>
          )}

          {/* 3. Volume Histogram (Bottom 20%) */}
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
                const volHeight = Math.max(3, (c.volume / maxVolume) * (volumeHeight - 12));
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
                    opacity={hoveredCandle?.id === c.id ? 0.85 : 0.35}
                    rx="1"
                  />
                );
              })}
            </g>
          )}

          {/* 4. Chart Content by Selected Type */}

          {/* A. Area Chart */}
          {chartType === 'Area' && (
            <g>
              <path d={areaPath} fill="url(#terminalAreaGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#emeraldGlow)"
              />
            </g>
          )}

          {/* B. Line Chart */}
          {chartType === 'Line' && (
            <g>
              <path
                d={linePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#emeraldGlow)"
              />
            </g>
          )}

          {/* C. Baseline Chart */}
          {chartType === 'Baseline' && (
            <g>
              <path d={areaPath} fill="url(#terminalAreaGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke="#34d399"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* D. Bar & OHLC Chart */}
          {(chartType === 'Bar' || chartType === 'OHLC') && (
            <g className="ohlc-bars">
              {candles.map((c, i) => {
                const x = getX(i);
                const yHigh = getY(c.high);
                const yLow = getY(c.low);
                const yOpen = getY(c.open);
                const yClose = getY(c.close);
                const tickLen = Math.max(3, candleBodyWidth / 2);
                const color = c.isGreen ? '#10b981' : '#ef4444';

                return (
                  <g key={`bar-${i}`}>
                    {/* Vertical spine (High to Low) */}
                    <line
                      x1={x}
                      y1={yHigh}
                      x2={x}
                      y2={yLow}
                      stroke={color}
                      strokeWidth="1.8"
                    />
                    {/* Left tick: Open */}
                    <line
                      x1={x - tickLen}
                      y1={yOpen}
                      x2={x}
                      y2={yOpen}
                      stroke={color}
                      strokeWidth="1.8"
                    />
                    {/* Right tick: Close */}
                    <line
                      x1={x}
                      y1={yClose}
                      x2={x + tickLen}
                      y2={yClose}
                      stroke={color}
                      strokeWidth="1.8"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* E. Candlestick, Heikin Ashi, and Hollow Candles */}
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

                const isHollow = chartType === 'Hollow Candles';
                const candleColor = isGreen ? '#10b981' : '#ef4444';
                const fillColor = isHollow 
                  ? (isGreen ? 'transparent' : candleColor) 
                  : candleColor;

                const isHovered = hoveredCandle?.id === c.id;

                return (
                  <g key={`candle-${i}`} className="transition-opacity">
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
                      fill={fillColor}
                      stroke={candleColor}
                      strokeWidth={isHollow && isGreen ? 1.8 : 1}
                      rx="1"
                      className="transition-all"
                      filter={isHovered ? 'url(#emeraldGlow)' : undefined}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* 5. Moving Averages Curves */}
          {indicators.ma && (
            <g className="moving-averages">
              {ma7Path && (
                <path
                  d={ma7Path}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.6"
                  strokeDasharray="none"
                  opacity="0.85"
                />
              )}
              {ma25Path && (
                <path
                  d={ma25Path}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.6"
                  strokeDasharray="none"
                  opacity="0.85"
                />
              )}
            </g>
          )}

          {/* 6. CANDLE EVENT SYSTEM (Visual Markers on Candles) */}
          {indicators.events && (
            <g className="ecosystem-events">
              {candles.map((c, i) => {
                if (!c.events || c.events.length === 0) return null;
                const x = getX(i);
                const hasClaim = c.events.some((e) => e.type === 'Claim');
                const hasPackage = c.events.some((e) => e.type === 'Package Activation');
                const hasReferral = c.events.some((e) => e.type === 'Referral');
                const hasMatrix = c.events.some((e) => e.type === 'Matrix Income');
                const hasRecycle = c.events.some((e) => e.type === 'Recycle');

                // Determine position: Claims below candle low, Earnings/Packages above candle high
                const yHigh = getY(c.high);
                const yLow = getY(c.low);

                return (
                  <g key={`evt-marker-${i}`} className="cursor-pointer">
                    {/* Outgoing Claim marker below candle */}
                    {hasClaim && (
                      <g transform={`translate(${x}, ${yLow + 14})`}>
                        <circle
                          r="7.5"
                          fill="#ef4444"
                          stroke="#7f1d1d"
                          strokeWidth="1.5"
                          className="animate-pulse"
                        />
                        <text
                          y="3"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          −
                        </text>
                        {/* Connecting dotted stem */}
                        <line
                          x1="0"
                          y1="-14"
                          x2="0"
                          y2="-7.5"
                          stroke="#ef4444"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                      </g>
                    )}

                    {/* Package Activation marker above candle (Strong node badge) */}
                    {hasPackage && (
                      <g transform={`translate(${x}, ${yHigh - 16})`}>
                        <rect
                          x="-14"
                          y="-9"
                          width="28"
                          height="18"
                          rx="4"
                          fill="#064e3b"
                          stroke="#34d399"
                          strokeWidth="1.6"
                          filter="url(#emeraldGlow)"
                        />
                        <text
                          y="3"
                          textAnchor="middle"
                          fill="#a7f3d0"
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          NODE
                        </text>
                        <line
                          x1="0"
                          y1="9"
                          x2="0"
                          y2="16"
                          stroke="#34d399"
                          strokeWidth="1.2"
                        />
                      </g>
                    )}

                    {/* Referral bonus marker above candle */}
                    {hasReferral && !hasPackage && (
                      <g transform={`translate(${x}, ${yHigh - 14})`}>
                        <circle
                          r="7.5"
                          fill="#10b981"
                          stroke="#064e3b"
                          strokeWidth="1.5"
                        />
                        <text
                          y="3"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          +
                        </text>
                        <line
                          x1="0"
                          y1="7.5"
                          x2="0"
                          y2="14"
                          stroke="#10b981"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                      </g>
                    )}

                    {/* Matrix / Recycle marker */}
                    {(hasMatrix || hasRecycle) && !hasPackage && !hasReferral && (
                      <g transform={`translate(${x}, ${yHigh - 14})`}>
                        <circle
                          r="7"
                          fill={hasMatrix ? '#0891b2' : '#9333ea'}
                          stroke={hasMatrix ? '#164e63' : '#581c87'}
                          strokeWidth="1.5"
                        />
                        <text
                          y="3"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {hasMatrix ? 'M' : 'R'}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 7. Interactive Crosshair Lines (when hovering) */}
          {hoveredCandle && (
            <g className="crosshair-guides pointer-events-none">
              {/* Vertical Crosshair Line */}
              <line
                x1={getX(candles.indexOf(hoveredCandle))}
                y1={padTop}
                x2={getX(candles.indexOf(hoveredCandle))}
                y2={padTop + plotHeight}
                stroke="#6ee7b7"
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.75"
              />
              {/* Horizontal Crosshair Line */}
              <line
                x1={padLeft}
                y1={getY(hoveredCandle.close)}
                x2={svgWidth - padRight}
                y2={getY(hoveredCandle.close)}
                stroke="#6ee7b7"
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.75"
              />

              {/* Price badge on Y-Axis */}
              <g transform={`translate(${svgWidth - padRight + 2}, ${getY(hoveredCandle.close) - 9})`}>
                <rect
                  width="58"
                  height="18"
                  rx="3"
                  fill="#064e3b"
                  stroke="#34d399"
                  strokeWidth="1"
                />
                <text
                  x="29"
                  y="12"
                  textAnchor="middle"
                  fill="#a7f3d0"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  ${hoveredCandle.close.toFixed(4)}
                </text>
              </g>

              {/* Time badge on X-Axis */}
              <g transform={`translate(${getX(candles.indexOf(hoveredCandle)) - 32}, ${padTop + plotHeight + 4})`}>
                <rect
                  width="64"
                  height="16"
                  rx="3"
                  fill="#18181b"
                  stroke="#3f3f46"
                  strokeWidth="1"
                />
                <text
                  x="32"
                  y="11"
                  textAnchor="middle"
                  fill="#e4e4e7"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {hoveredCandle.time}
                </text>
              </g>
            </g>
          )}

          {/* 8. Right Y-Axis Price Scale */}
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

          {/* 9. Bottom X-Axis Timeline Labels */}
          <g className="x-axis-labels">
            {candles.map((c, i) => {
              if (i % 6 !== 0 && i !== candles.length - 1) return null;
              const x = getX(i);
              return (
                <text
                  key={`time-lbl-${i}`}
                  x={x}
                  y={padTop + plotHeight + 18}
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

      {/* FOOTER BAR: Legend, Indicators & Ecosystem Status */}
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Referral / Node</span>
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>Claim</span>
            </span>
          </div>
        </div>

        {/* Right: Sandbox Telemetry Status */}
        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Simulated Activity Engine</span>
          <span className="text-zinc-400">·</span>
          <span className="text-zinc-400">BSC Latency: 24ms</span>
        </div>
      </div>
    </div>
  );
};
