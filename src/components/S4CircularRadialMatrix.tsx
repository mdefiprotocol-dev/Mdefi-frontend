import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Sparkles, 
  Info,
  Maximize2,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  RotateCw
} from 'lucide-react';
import { 
  S4MatrixPosition, 
  S4PackageData, 
  S4PlacementType 
} from '../types/s4Matrix';
import { placementColors } from '../data/s4MatrixData';
import { S4PositionModal } from './S4PositionModal';

interface S4CircularRadialMatrixProps {
  packageData: S4PackageData;
}

export const S4CircularRadialMatrix: React.FC<S4CircularRadialMatrixProps> = ({
  packageData,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [ringFilter, setRingFilter] = useState<'all' | 1 | 2>('all');
  const [typeFilter, setTypeFilter] = useState<S4PlacementType | 'all'>('all');
  const [hoveredNode, setHoveredNode] = useState<S4MatrixPosition | 'root' | null>(null);

  // Modal inspection states
  const [selectedPosition, setSelectedPosition] = useState<S4MatrixPosition | null>(null);
  const [isRootSelected, setIsRootSelected] = useState<boolean>(false);

  const { 
    rootUser, 
    positions, 
    name, 
    priceDisplay, 
    recycleCount, 
    currentMatrixNumber, 
    filledPositions, 
    totalPositions,
    priceUSD 
  } = packageData;

  const CX = 380;
  const CY = 380;

  // Concentric Ring Radii
  const RINGS = {
    r1: 155, // Level 1 (2 nodes)
    r2: 275, // Level 2 (4 nodes)
  };

  // Helper to convert polar to Cartesian coordinates
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Precompute radial coordinates for S4's 6 positions
  // Slot 1 & 2 on Ring 1, Slot 3, 4, 5, 6 on Ring 2
  const nodeLayout = useMemo(() => {
    const map = new Map<number, { 
      x: number; 
      y: number; 
      angle: number; 
      parentPos: number; 
      nodeRadius: number; 
      ring: number;
    }>();

    // Ring 1 (Level 1, 2 positions)
    // Slot #1 at top (-90°), connected to Root
    map.set(1, { ...polarToCartesian(CX, CY, RINGS.r1, -90), angle: -90, parentPos: 0, nodeRadius: 30, ring: 1 });
    // Slot #2 at bottom (90°), connected to Root
    map.set(2, { ...polarToCartesian(CX, CY, RINGS.r1, 90), angle: 90, parentPos: 0, nodeRadius: 30, ring: 1 });

    // Ring 2 (Level 2, 4 positions)
    // Slot #3 (-140°, top-left), child of Slot #1
    map.set(3, { ...polarToCartesian(CX, CY, RINGS.r2, -140), angle: -140, parentPos: 1, nodeRadius: 26, ring: 2 });
    // Slot #4 (-40°, top-right), child of Slot #1
    map.set(4, { ...polarToCartesian(CX, CY, RINGS.r2, -40), angle: -40, parentPos: 1, nodeRadius: 26, ring: 2 });
    // Slot #5 (40°, bottom-right), child of Slot #2
    map.set(5, { ...polarToCartesian(CX, CY, RINGS.r2, 40), angle: 40, parentPos: 2, nodeRadius: 26, ring: 2 });
    // Slot #6 (140°, bottom-left), child of Slot #2
    map.set(6, { ...polarToCartesian(CX, CY, RINGS.r2, 140), angle: 140, parentPos: 2, nodeRadius: 26, ring: 2 });

    return map;
  }, []);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(0.75, prev + delta), 1.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setRingFilter('all');
    setTypeFilter('all');
  };

  // Color mapping helper for SVG circles
  const getNodeSvgColors = (type: S4PlacementType, isHovered: boolean, isFilled: boolean) => {
    if (!isFilled || type === 'empty') {
      return {
        fill: 'url(#s4EmptyGradient)',
        stroke: isHovered ? '#10b981' : '#52525b',
        glow: '',
        textFill: '#a1a1aa',
        badgeBg: 'rgba(39, 39, 42, 0.8)',
      };
    }

    switch (type) {
      case 'direct':
        return {
          fill: 'url(#s4DirectGradient)',
          stroke: isHovered ? '#34d399' : '#10b981',
          glow: 'filter-emerald-glow',
          textFill: '#a7f3d0',
          badgeBg: 'rgba(6, 78, 59, 0.8)',
        };
      case 'spillover':
        return {
          fill: 'url(#s4SpillGradient)',
          stroke: isHovered ? '#f472b6' : '#ec4899',
          glow: 'filter-pink-glow',
          textFill: '#fbcfe8',
          badgeBg: 'rgba(131, 24, 67, 0.8)',
        };
      case 'recycle':
        return {
          fill: 'url(#s4RecycleGradient)',
          stroke: isHovered ? '#fb7185' : '#f43f5e',
          glow: 'filter-red-glow',
          textFill: '#fecdd3',
          badgeBg: 'rgba(159, 18, 57, 0.8)',
        };
      case 'self':
        return {
          fill: 'url(#s4SelfGradient)',
          stroke: isHovered ? '#22d3ee' : '#06b6d4',
          glow: 'filter-cyan-glow',
          textFill: '#cffafe',
          badgeBg: 'rgba(21, 94, 117, 0.8)',
        };
      default:
        return {
          fill: 'url(#s4EmptyGradient)',
          stroke: isHovered ? '#71717a' : '#3f3f46',
          glow: '',
          textFill: '#a1a1aa',
          badgeBg: 'rgba(39, 39, 42, 0.8)',
        };
    }
  };

  // Check if position passes current filters
  const matchesFilter = (pos: S4MatrixPosition) => {
    if (ringFilter !== 'all' && pos.level !== ringFilter) return false;
    if (typeFilter !== 'all') {
      if (typeFilter === 'empty' && pos.status !== 'Available') return false;
      if (typeFilter !== 'empty' && (pos.status === 'Available' || pos.placementType !== typeFilter)) return false;
    }
    return true;
  };

  const handleOpenPositionModal = (pos: S4MatrixPosition) => {
    setSelectedPosition(pos);
    setIsRootSelected(false);
  };

  const handleOpenRootModal = () => {
    setSelectedPosition(null);
    setIsRootSelected(true);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#09120c]/90 via-[#060b08]/95 to-[#040605] border-2 border-emerald-500/25 p-4 sm:p-6 lg:p-8 shadow-2xl relative backdrop-blur-xl overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Controls: Title, Badges & Zoom */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              S4 CIRCULAR RADIAL MATRIX
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
              2 Rings • 6 Positions
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{name}</span>
            <span className="text-emerald-400 font-mono text-base font-bold">
              ({priceDisplay})
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Radial 2x2 topology: Center Root &bull; Ring 1 (2 Slots) &bull; Ring 2 (4 Slots). Completed cycles auto-recycle.
          </p>
        </div>

        {/* Matrix Metrics & Zoom Controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {/* Progress Indicator */}
          <div className="px-3 py-1.5 rounded-xl bg-zinc-950/90 border border-emerald-500/30 font-mono text-xs flex items-center gap-2">
            <span className="text-zinc-400">Filled:</span>
            <span className="text-emerald-400 font-extrabold">{filledPositions}/{totalPositions}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-rose-400 font-bold">Cycle #{currentMatrixNumber}</span>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-950/90 border border-zinc-800">
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-zinc-300 px-1 font-semibold min-w-10 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.15)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-0.5 cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Ring / Level Filter Tabs & Status Filters */}
      <div className="relative z-10 flex items-center justify-between gap-2 pt-4 pb-2 flex-wrap text-xs font-mono">
        {/* Ring Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-400 text-[11px] mr-1 hidden sm:inline">Concentric Rings:</span>
          {(['all', 1, 2] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRingFilter(r)}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                ringFilter === r
                  ? 'bg-emerald-500 text-black font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {r === 'all' ? 'All Rings (6)' : r === 1 ? 'Ring 1 (2)' : 'Ring 2 (4)'}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-400 text-[11px] mr-1 hidden sm:inline">Status:</span>
          {(['all', 'direct', 'spillover', 'recycle', 'empty'] as const).map((tp) => (
            <button
              key={tp}
              onClick={() => setTypeFilter(tp)}
              className={`px-2.5 py-1 rounded-xl text-[11px] transition-all cursor-pointer ${
                typeFilter === tp
                  ? 'bg-zinc-200 text-black font-bold shadow-md'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800/60'
              }`}
            >
              {tp === 'all' ? 'All Types' : tp === 'direct' ? 'Direct' : tp === 'spillover' ? 'Spillover' : tp === 'recycle' ? 'Recycle' : 'Available'}
            </button>
          ))}
        </div>
      </div>

      {/* Concentric SVG Canvas */}
      <div className="relative flex items-center justify-center my-4 overflow-hidden select-none">
        <div 
          className="w-full max-w-[720px] aspect-square flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 760 760"
            className="w-full h-full max-w-full drop-shadow-2xl overflow-visible"
          >
            <defs>
              {/* Center YOU Gold Gradient */}
              <radialGradient id="s4GoldGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="85%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#451a03" />
              </radialGradient>

              {/* Direct Green Gradient */}
              <radialGradient id="s4DirectGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="45%" stopColor="#10b981" />
                <stop offset="85%" stopColor="#047857" />
                <stop offset="100%" stopColor="#022c22" />
              </radialGradient>

              {/* Spillover Pink/Magenta Gradient */}
              <radialGradient id="s4SpillGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#f9a8d4" />
                <stop offset="45%" stopColor="#ec4899" />
                <stop offset="85%" stopColor="#be185d" />
                <stop offset="100%" stopColor="#500724" />
              </radialGradient>

              {/* Recycle Red/Crimson Gradient */}
              <radialGradient id="s4RecycleGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="45%" stopColor="#f43f5e" />
                <stop offset="85%" stopColor="#be123c" />
                <stop offset="100%" stopColor="#4c0519" />
              </radialGradient>

              {/* Self Blue/Teal Gradient */}
              <radialGradient id="s4SelfGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#a5f3fc" />
                <stop offset="45%" stopColor="#06b6d4" />
                <stop offset="85%" stopColor="#0e7490" />
                <stop offset="100%" stopColor="#083344" />
              </radialGradient>

              {/* Empty Neutral Gradient */}
              <radialGradient id="s4EmptyGradient" cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="70%" stopColor="#18181b" />
                <stop offset="100%" stopColor="#09090b" />
              </radialGradient>

              {/* Glow Filters */}
              <filter id="s4GoldGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="s4EmeraldGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="s4PinkGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="s4RedGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="s4CyanGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. Concentric Orbital Guide Rings */}
            {/* Ring 2 Orbital Guide (Level 2) */}
            <circle
              cx={CX}
              cy={CY}
              r={RINGS.r2}
              fill="none"
              stroke="rgba(16, 185, 129, 0.22)"
              strokeWidth="1.8"
              strokeDasharray="5 5"
            />
            {/* Ring 1 Orbital Guide (Level 1) */}
            <circle
              cx={CX}
              cy={CY}
              r={RINGS.r1}
              fill="none"
              stroke="rgba(245, 158, 11, 0.3)"
              strokeWidth="1.8"
              strokeDasharray="4 4"
            />

            {/* Ring Labels */}
            <text 
              x={CX} 
              y={CY - RINGS.r2 - 12} 
              textAnchor="middle" 
              fill="#10b981" 
              fontSize="10" 
              fontFamily="monospace" 
              fontWeight="bold"
              letterSpacing="1"
            >
              RING 2 • LEVEL 2 • 4 POSITIONS
            </text>
            <text 
              x={CX} 
              y={CY - RINGS.r1 - 10} 
              textAnchor="middle" 
              fill="#f59e0b" 
              fontSize="9.5" 
              fontFamily="monospace" 
              fontWeight="bold"
              letterSpacing="0.8"
            >
              RING 1 • LEVEL 1 • 2 POSITIONS
            </text>

            {/* 2. Radial Animated Connection Lines between Nodes */}
            {positions.map((pos) => {
              const currentCoords = nodeLayout.get(pos.slot);
              if (!currentCoords) return null;

              let parentCoords: { x: number; y: number } = { x: CX, y: CY };
              if (pos.level === 2 && currentCoords.parentPos) {
                const p = nodeLayout.get(currentCoords.parentPos);
                if (p) parentCoords = { x: p.x, y: p.y };
              }

              const isFilled = pos.status === 'Filled';
              let strokeColor = 'rgba(82, 82, 91, 0.4)'; // neutral for empty
              let strokeWidth = 1.8;

              if (isFilled) {
                if (pos.placementType === 'direct') strokeColor = 'rgba(16, 185, 129, 0.65)';
                else if (pos.placementType === 'spillover') strokeColor = 'rgba(236, 72, 153, 0.65)';
                else if (pos.placementType === 'recycle') strokeColor = 'rgba(244, 63, 94, 0.75)';
                else if (pos.placementType === 'self') strokeColor = 'rgba(6, 182, 212, 0.65)';
                strokeWidth = 2.4;
              }

              return (
                <g key={`connection-line-${pos.slot}`}>
                  {/* Subtle Background Glow Line for Filled Slots */}
                  {isFilled && (
                    <line
                      x1={parentCoords.x}
                      y1={parentCoords.y}
                      x2={currentCoords.x}
                      y2={currentCoords.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth + 4}
                      strokeOpacity="0.25"
                      className="transition-all duration-300"
                    />
                  )}
                  <line
                    x1={parentCoords.x}
                    y1={parentCoords.y}
                    x2={currentCoords.x}
                    y2={currentCoords.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isFilled ? undefined : '4 4'}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}

            {/* 3. Center "YOU" Root Node */}
            <g
              onClick={handleOpenRootModal}
              onMouseEnter={() => setHoveredNode('root')}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer group"
            >
              {/* Outer Pulsing Aura */}
              <circle
                cx={CX}
                cy={CY}
                r="48"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeOpacity="0.35"
                className="animate-ping origin-center"
                style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: '3s' }}
              />
              {/* Inner Glowing Ring */}
              <circle
                cx={CX}
                cy={CY}
                r="42"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                className="animate-spin-slow origin-center"
                style={{ transformOrigin: `${CX}px ${CY}px` }}
              />
              {/* Center Root Circle */}
              <circle
                cx={CX}
                cy={CY}
                r="36"
                fill="url(#s4GoldGradient)"
                stroke="#fbbf24"
                strokeWidth="3.5"
                filter="url(#s4GoldGlow)"
                className="transition-transform duration-300 group-hover:scale-110"
                style={{ transformOrigin: `${CX}px ${CY}px` }}
              />
              <text
                x={CX}
                y={CY - 5}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="13"
                fontWeight="900"
                fontFamily="monospace"
                letterSpacing="1"
              >
                YOU
              </text>
              <text
                x={CX}
                y={CY + 9}
                textAnchor="middle"
                fill="#fef08a"
                fontSize="8.5"
                fontWeight="bold"
                fontFamily="monospace"
              >
                ROOT
              </text>
              <text
                x={CX}
                y={CY + 19}
                textAnchor="middle"
                fill="#fde047"
                fontSize="7.5"
                fontFamily="monospace"
              >
                M#{currentMatrixNumber}
              </text>
            </g>

            {/* 4. The 6 S4 Matrix Position Nodes */}
            {positions.map((pos) => {
              const coords = nodeLayout.get(pos.slot);
              if (!coords) return null;

              const isVisible = matchesFilter(pos);
              const isHovered = hoveredNode !== null && hoveredNode !== 'root' && hoveredNode.slot === pos.slot;
              const isFilled = pos.status === 'Filled';
              const { fill, stroke, textFill } = getNodeSvgColors(pos.placementType, isHovered, isFilled);

              const filterId = !isFilled
                ? undefined
                : pos.placementType === 'direct'
                ? 'url(#s4EmeraldGlow)'
                : pos.placementType === 'spillover'
                ? 'url(#s4PinkGlow)'
                : pos.placementType === 'recycle'
                ? 'url(#s4RedGlow)'
                : pos.placementType === 'self'
                ? 'url(#s4CyanGlow)'
                : undefined;

              return (
                <g
                  key={`s4-node-${pos.slot}`}
                  onClick={() => handleOpenPositionModal(pos)}
                  onMouseEnter={() => setHoveredNode(pos)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`cursor-pointer transition-opacity duration-300 ${
                    isVisible ? 'opacity-100' : 'opacity-25'
                  }`}
                >
                  {/* Subtle Node Hover Glow Ring */}
                  {isHovered && (
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={coords.nodeRadius + 7}
                      fill="none"
                      stroke={stroke}
                      strokeWidth="2.5"
                      strokeOpacity="0.8"
                    />
                  )}

                  {/* Active Pulse Animation Ring for Occupied Nodes */}
                  {isFilled && (
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={coords.nodeRadius + 3}
                      fill="none"
                      stroke={stroke}
                      strokeWidth="1"
                      strokeOpacity="0.4"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={coords.nodeRadius}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isFilled ? '3' : '2'}
                    strokeDasharray={isFilled ? undefined : '3 3'}
                    filter={isFilled ? filterId : undefined}
                    className="transition-all duration-200"
                  />

                  {/* Slot Number Label inside node */}
                  <text
                    x={coords.x}
                    y={coords.y + 1}
                    textAnchor="middle"
                    fill={textFill}
                    fontSize={coords.nodeRadius > 28 ? '11' : '10'}
                    fontWeight="900"
                    fontFamily="monospace"
                  >
                    Slot #{pos.slot}
                  </text>

                  {/* Level Tag inside node */}
                  <text
                    x={coords.x}
                    y={coords.y + 12}
                    textAnchor="middle"
                    fill={isFilled ? '#e4e4e7' : '#71717a'}
                    fontSize="8"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    L{pos.level}
                  </text>

                  {/* Exterior Occupant / Placement Badge below the node */}
                  <g transform={`translate(${coords.x}, ${coords.y + coords.nodeRadius + 14})`}>
                    <rect
                      x="-38"
                      y="-8"
                      width="76"
                      height="16"
                      rx="4"
                      fill="#090d0b"
                      stroke={isFilled ? stroke : '#3f3f46'}
                      strokeWidth="1"
                      strokeOpacity="0.7"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={isFilled ? '#ffffff' : '#71717a'}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {isFilled ? pos.userId : 'Empty Slot'}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Floating / Active Hovered Node Quick Tooltip Indicator */}
      {hoveredNode && (
        <div className="relative z-20 mt-3 p-3.5 rounded-2xl bg-zinc-950/95 border border-emerald-500/35 backdrop-blur-md flex items-center justify-between gap-4 text-xs font-mono shadow-xl animate-in fade-in duration-150">
          {hoveredNode === 'root' ? (
            <>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                <span className="text-white font-bold">Center Root (YOU): {rootUser.userId}</span>
                <span className="text-amber-300 text-[11px]">({rootUser.walletAddress})</span>
                <span className="text-zinc-500">•</span>
                <span className="text-rose-400 font-bold">{recycleCount} Auto-Recycles</span>
              </div>
              <button
                onClick={handleOpenRootModal}
                className="text-amber-400 hover:text-amber-300 font-extrabold cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>Inspect Root</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`w-2.5 h-2.5 rounded-full ${placementColors[hoveredNode.placementType]?.dotColor || 'bg-zinc-500'}`} />
                <span className="text-white font-bold">Slot #{hoveredNode.slot} (Ring {hoveredNode.level}):</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${placementColors[hoveredNode.placementType]?.badgeBg} ${placementColors[hoveredNode.placementType]?.badgeText}`}>
                  {placementColors[hoveredNode.placementType]?.label || 'Empty'}
                </span>
                <span className="text-zinc-300">
                  {hoveredNode.status === 'Filled' ? `${hoveredNode.userId} (${hoveredNode.walletAddress})` : 'Awaiting Member Placement'}
                </span>
              </div>
              <button
                onClick={() => handleOpenPositionModal(hoveredNode)}
                className="text-emerald-400 hover:text-emerald-300 font-extrabold cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>Inspect Slot</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      )}

      {/* S4 Matrix Legend */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-zinc-400 text-[11px]">Matrix Placement:</span>
          {/* YOU */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
            <span className="text-amber-300 text-[11px]">YOU (Root)</span>
          </div>
          {/* Direct */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
            <span className="text-emerald-300 text-[11px]">Direct Member (Green)</span>
          </div>
          {/* Spillover */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_6px_rgba(244,114,182,0.6)]" />
            <span className="text-pink-300 text-[11px]">Spillover (Pink)</span>
          </div>
          {/* Recycle / Re-entry */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
            <span className="text-rose-300 text-[11px]">Recycle / Re-entry (Red)</span>
          </div>
          {/* Empty */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-zinc-500 bg-zinc-800" />
            <span className="text-zinc-400 text-[11px]">Available Slot (Dashed)</span>
          </div>
        </div>

        <div className="text-[11px] text-zinc-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Click any node to open position telemetry</span>
        </div>
      </div>

      {/* S4-Specific Position & Root Details Modal */}
      <S4PositionModal
        isOpen={selectedPosition !== null || isRootSelected}
        onClose={() => {
          setSelectedPosition(null);
          setIsRootSelected(false);
        }}
        position={selectedPosition}
        isRoot={isRootSelected}
        packageData={packageData}
      />
    </div>
  );
};
