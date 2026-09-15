import React, { useState, useMemo, useRef } from 'react';
import { TrendingUp, BarChart2, Activity, Calendar, Award } from 'lucide-react';
import { ClaimChartPoint } from '../../types/rewards';
import { AnimatedDollarCoin } from '../common/AnimatedDollarCoin';

interface RewardClaimChartProps {
  data: ClaimChartPoint[];
  title?: string;
  tokenSymbol?: string;
  themeColor?: 'emerald' | 'cyan' | 'purple';
}

type ChartType = 'line' | 'area' | 'bar';
type TimeFilter = '7D' | '30D' | '3M' | '6M' | '1Y' | 'ALL';

export const RewardClaimChart: React.FC<RewardClaimChartProps> = ({
  data,
  title = 'REWARD CLAIM HISTORY',
  tokenSymbol = '',
  themeColor = 'emerald',
}) => {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL');
  const [hoveredPoint, setHoveredPoint] = useState<ClaimChartPoint | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Filter data based on timeFilter
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (timeFilter === 'ALL') return data;

    const now = Date.now();
    let days = 365;
    if (timeFilter === '7D') days = 7;
    else if (timeFilter === '30D') days = 30;
    else if (timeFilter === '3M') days = 90;
    else if (timeFilter === '6M') days = 180;
    else if (timeFilter === '1Y') days = 365;

    const cutoff = now - days * 86400000;
    const filtered = data.filter((d) => d.timestamp >= cutoff);
    return filtered.length > 0 ? filtered : data.slice(-3);
  }, [data, timeFilter]);

  // Chart dimensions & math
  const width = 680;
  const height = 220;
  const padding = { top: 24, right: 28, bottom: 32, left: 48 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const { maxAmount, maxCumulative, points } = useMemo(() => {
    if (filteredData.length === 0) {
      return { maxAmount: 100, maxCumulative: 100, points: [] };
    }

    const maxAmt = Math.max(...filteredData.map((d) => d.amount), 50);
    const maxCum = Math.max(...filteredData.map((d) => d.cumulative), 100);

    // Compute coordinate points
    const pts = filteredData.map((d, index) => {
      const x =
        filteredData.length === 1
          ? padding.left + innerWidth / 2
          : padding.left + (index / (filteredData.length - 1)) * innerWidth;
      const yAmount = padding.top + innerHeight - (d.amount / maxAmt) * innerHeight;
      const yCumulative = padding.top + innerHeight - (d.cumulative / maxCum) * innerHeight;
      return { ...d, x, yAmount, yCumulative };
    });

    return { maxAmount: maxAmt, maxCumulative: maxCum, points: pts };
  }, [filteredData, innerWidth, innerHeight, padding.left, padding.top]);

  // SVG Paths
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.yAmount}` : `${acc} L ${p.x} ${p.yAmount}`;
    }, '');
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const bottomY = padding.top + innerHeight;
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [linePath, points, padding.top, innerHeight]);

  const cumulativeLinePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.yCumulative}` : `${acc} L ${p.x} ${p.yCumulative}`;
    }, '');
  }, [points]);

  // Handle touch / mouse move for tooltip
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const svgX = ((clientX - rect.left) / rect.width) * width;

    // Find closest point by X
    let closest = points[0];
    let minDiff = Math.abs(points[0].x - svgX);
    for (const p of points) {
      const diff = Math.abs(p.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = p;
      }
    }
    setHoveredPoint(closest);
    setHoverCoords({ x: closest.x, y: closest.yAmount });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setHoverCoords(null);
  };

  const colorPalette = {
    emerald: {
      primary: '#10b981',
      glow: 'rgba(16, 185, 129, 0.4)',
      bgGradStart: 'rgba(16, 185, 129, 0.35)',
      bgGradEnd: 'rgba(16, 185, 129, 0.0)',
      accent: '#34d399',
    },
    cyan: {
      primary: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.4)',
      bgGradStart: 'rgba(6, 182, 212, 0.35)',
      bgGradEnd: 'rgba(6, 182, 212, 0.0)',
      accent: '#22d3ee',
    },
    purple: {
      primary: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.4)',
      bgGradStart: 'rgba(168, 85, 247, 0.35)',
      bgGradEnd: 'rgba(168, 85, 247, 0.0)',
      accent: '#c084fc',
    },
  }[themeColor];

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#090e0b]/90 border border-emerald-500/20 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-1/4 w-72 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono tracking-wider text-zinc-200 uppercase">
              {title}
            </h3>
            <p className="text-[11px] text-zinc-400">
              Verified on-chain claim velocity & historical reward distribution
            </p>
          </div>
        </div>

        {/* View toggles & Timeframe filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart mode */}
          <div className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                chartType === 'area'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                chartType === 'line'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                chartType === 'bar'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Bar
            </button>
          </div>

          {/* Timeframe filters */}
          <div className="inline-flex p-0.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
            {(['7D', '30D', '3M', '6M', '1Y', 'ALL'] as TimeFilter[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-2 py-1 rounded-md text-[10px] font-mono transition-all ${
                  timeFilter === tf
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart Area */}
      <div className="relative mt-4 w-full h-[220px]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair select-none"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchEnd={handleMouseLeave}
        >
          <defs>
            <linearGradient id="claimAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorPalette.bgGradStart} />
              <stop offset="100%" stopColor={colorPalette.bgGradEnd} />
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorPalette.accent} />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.2)" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={colorPalette.glow} />
            </filter>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + innerHeight * ratio;
            const val = Math.round(maxAmount * (1 - ratio));
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(16, 185, 129, 0.08)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-zinc-400"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Cumulative comparison dashed line */}
          {chartType !== 'bar' && (
            <path
              d={cumulativeLinePath}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.6"
            />
          )}

          {/* Area Chart Mode */}
          {chartType === 'area' && (
            <>
              <path d={areaPath} fill="url(#claimAreaGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke={colorPalette.primary}
                strokeWidth="2.5"
                filter="url(#glowFilter)"
              />
            </>
          )}

          {/* Line Chart Mode */}
          {chartType === 'line' && (
            <path
              d={linePath}
              fill="none"
              stroke={colorPalette.primary}
              strokeWidth="2.5"
              filter="url(#glowFilter)"
            />
          )}

          {/* Bar Chart Mode */}
          {chartType === 'bar' &&
            points.map((p, i) => {
              const barWidth = Math.min(28, (innerWidth / points.length) * 0.55);
              const barHeight = padding.top + innerHeight - p.yAmount;
              return (
                <rect
                  key={i}
                  x={p.x - barWidth / 2}
                  y={p.yAmount}
                  width={barWidth}
                  height={Math.max(2, barHeight)}
                  rx="4"
                  fill="url(#barGradient)"
                  className="transition-all hover:opacity-100"
                  opacity={hoveredPoint?.id === p.id ? 1 : 0.85}
                />
              );
            })}

          {/* Point markers */}
          {chartType !== 'bar' &&
            points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.yAmount}
                r={hoveredPoint?.id === p.id ? 6 : 3.5}
                fill={hoveredPoint?.id === p.id ? '#ffffff' : colorPalette.primary}
                stroke={colorPalette.primary}
                strokeWidth="2"
                className="transition-all duration-150"
              />
            ))}

          {/* X Axis Labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              className="text-[10px] font-mono fill-zinc-400"
            >
              {p.weekLabel}
            </text>
          ))}

          {/* Active Hover Crosshair Line */}
          {hoverCoords && (
            <line
              x1={hoverCoords.x}
              y1={padding.top}
              x2={hoverCoords.x}
              y2={padding.top + innerHeight}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
          )}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && hoverCoords && (
          <div
            className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-xl bg-zinc-950/95 border border-emerald-500/40 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.8)] text-left min-w-[170px]"
            style={{
              left: `${(hoverCoords.x / width) * 100}%`,
              top: `${(hoverCoords.y / height) * 100}%`,
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-1 mb-1.5">
              <span className="text-[11px] font-bold text-emerald-400 font-mono">
                {hoveredPoint.weekLabel}
              </span>
              <span className="text-[10px] text-zinc-400">{hoveredPoint.date}</span>
            </div>
            <div className="space-y-0.5 text-[11px]">
              <div className="flex justify-between items-center gap-2">
                <span className="text-zinc-400">Claim Amount:</span>
                <span className="font-mono font-bold text-zinc-100 inline-flex items-center gap-1">
                  <AnimatedDollarCoin size="xs" />
                  <span>{hoveredPoint.amount}</span>
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-sky-400">Cumulative Total:</span>
                <span className="font-mono font-semibold text-sky-300 inline-flex items-center gap-1">
                  <AnimatedDollarCoin size="xs" />
                  <span>{hoveredPoint.cumulative}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend & quick summary footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-1 border-t border-emerald-500/10 text-xs">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Claim Reward
          </span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2.5 h-0.5 bg-sky-400 border-t border-dashed border-sky-400" />
            Cumulative Growth
          </span>
        </div>
        <div className="text-[11px] font-mono text-zinc-400">
          Total Claims Recorded: <span className="text-emerald-400 font-bold">{data.length}</span>
        </div>
      </div>
    </div>
  );
};
