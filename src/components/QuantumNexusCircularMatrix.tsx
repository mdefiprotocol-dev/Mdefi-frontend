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
  Filter
} from 'lucide-react';
import { 
  NexusMatrixPosition, 
  NexusTreeData, 
  NexusPositionType 
} from '../types/nexusMatrix';
import { nexusPositionColors } from '../data/nexusMatrixData';

interface QuantumNexusCircularMatrixProps {
  treeData: NexusTreeData;
  onSelectPosition: (pos: NexusMatrixPosition) => void;
  onSelectRoot: () => void;
}

export const QuantumNexusCircularMatrix: React.FC<QuantumNexusCircularMatrixProps> = ({
  treeData,
  onSelectPosition,
  onSelectRoot,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<NexusPositionType | 'all'>('all');
  const [hoveredNode, setHoveredNode] = useState<NexusMatrixPosition | 'root' | null>(null);

  const { rootUser, positions, packageName, priceUSD, recycleCount, currentMatrixNumber } = treeData;

  const CX = 460;
  const CY = 460;

  // Ring Radii
  const RINGS = {
    r1: 125, // Level 1 (2 nodes)
    r2: 220, // Level 2 (4 nodes)
    r3: 315, // Level 3 (8 nodes)
    r4: 405, // Level 4 (16 nodes)
  };

  // Helper to convert polar to Cartesian coordinates
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Precompute exact angles and coordinates for all 30 positions
  const nodeLayout = useMemo(() => {
    const map = new Map<number, { x: number; y: number; angle: number; parentPos?: number; nodeRadius: number }>();

    // Ring 1 (L1, 2 positions)
    map.set(1, { ...polarToCartesian(CX, CY, RINGS.r1, -90), angle: -90, parentPos: 0, nodeRadius: 26 });
    map.set(2, { ...polarToCartesian(CX, CY, RINGS.r1, 90), angle: 90, parentPos: 0, nodeRadius: 26 });

    // Ring 2 (L2, 4 positions)
    map.set(3, { ...polarToCartesian(CX, CY, RINGS.r2, -140), angle: -140, parentPos: 1, nodeRadius: 22 });
    map.set(4, { ...polarToCartesian(CX, CY, RINGS.r2, -40), angle: -40, parentPos: 1, nodeRadius: 22 });
    map.set(5, { ...polarToCartesian(CX, CY, RINGS.r2, 40), angle: 40, parentPos: 2, nodeRadius: 22 });
    map.set(6, { ...polarToCartesian(CX, CY, RINGS.r2, 140), angle: 140, parentPos: 2, nodeRadius: 22 });

    // Ring 3 (L3, 8 positions)
    const l3Angles = [-162.5, -117.5, -62.5, -17.5, 17.5, 62.5, 117.5, 162.5];
    for (let i = 0; i < 8; i++) {
      const posNum = 7 + i;
      const angle = l3Angles[i];
      const parentPos = 3 + Math.floor(i / 2);
      map.set(posNum, { ...polarToCartesian(CX, CY, RINGS.r3, angle), angle, parentPos, nodeRadius: 18 });
    }

    // Ring 4 (L4, 16 positions evenly distributed)
    for (let i = 0; i < 16; i++) {
      const posNum = 15 + i;
      // Spread across 360 degrees, offset starting at -174.375°
      const angle = -174.375 + i * 22.5;
      const parentPos = 7 + Math.floor(i / 2);
      map.set(posNum, { ...polarToCartesian(CX, CY, RINGS.r4, angle), angle, parentPos, nodeRadius: 15 });
    }

    return map;
  }, []);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(0.8, prev + delta), 1.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setLevelFilter('all');
    setTypeFilter('all');
  };

  // Color mapping helper for SVG circles
  const getNodeSvgColors = (type: NexusPositionType, isHovered: boolean) => {
    switch (type) {
      case 'self':
        return {
          fill: 'url(#goldGradient)',
          stroke: '#fbbf24',
          glow: 'filter-gold-glow',
          textFill: '#fef08a',
        };
      case 'direct':
        return {
          fill: 'url(#directGradient)',
          stroke: isHovered ? '#34d399' : '#10b981',
          glow: 'filter-emerald-glow',
          textFill: '#a7f3d0',
        };
      case 'spill':
        return {
          fill: 'url(#spillGradient)',
          stroke: isHovered ? '#f472b6' : '#ec4899',
          glow: 'filter-pink-glow',
          textFill: '#fbcfe8',
        };
      case 'recycle':
        return {
          fill: 'url(#recycleGradient)',
          stroke: isHovered ? '#fb7185' : '#f43f5e',
          glow: 'filter-red-glow',
          textFill: '#fecdd3',
        };
      case 'empty':
      default:
        return {
          fill: 'url(#emptyGradient)',
          stroke: isHovered ? '#71717a' : '#3f3f46',
          glow: '',
          textFill: '#a1a1aa',
        };
    }
  };

  // Check if a position passes current filters
  const matchesFilter = (pos: NexusMatrixPosition) => {
    if (levelFilter !== 'all' && pos.level !== levelFilter) return false;
    if (typeFilter !== 'all' && pos.type !== typeFilter) return false;
    return true;
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#09100c]/90 via-[#060907]/95 to-[#040605] border border-emerald-500/20 p-4 sm:p-6 lg:p-8 shadow-2xl relative backdrop-blur-xl overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-emerald-500/15">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">
              X6 Circular Radial Matrix
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Concentric 4-Ring Topology (30 Positions)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight flex items-center gap-2">
            <span>{packageName}</span>
            <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
              ${priceUSD} USD
            </span>
          </h2>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center rounded-xl bg-zinc-900/90 border border-zinc-800 p-1">
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-[11px] font-mono text-zinc-300 min-w-[3.5rem] text-center">
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
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-1 cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Ring / Level Filter Tabs */}
      <div className="relative z-10 flex items-center justify-between gap-2 pt-4 pb-2 flex-wrap text-xs font-mono">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-400 text-[11px] mr-1 hidden sm:inline">Filter Ring:</span>
          {(['all', 1, 2, 3, 4] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                levelFilter === lvl
                  ? 'bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
              }`}
            >
              {lvl === 'all' ? 'All Rings (30)' : `Ring ${lvl} (${lvl === 1 ? 2 : lvl === 2 ? 4 : lvl === 3 ? 8 : 16})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-400 text-[11px] mr-1 hidden sm:inline">Status:</span>
          {(['all', 'direct', 'spill', 'recycle', 'empty'] as const).map((tp) => (
            <button
              key={tp}
              onClick={() => setTypeFilter(tp)}
              className={`px-2 py-0.5 rounded-md text-[11px] transition-all cursor-pointer ${
                typeFilter === tp
                  ? 'bg-zinc-200 text-black font-bold'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800/60'
              }`}
            >
              {tp === 'all' ? 'All Types' : tp === 'direct' ? 'Direct' : tp === 'spill' ? 'Spillover' : tp === 'recycle' ? 'Recycle' : 'Available'}
            </button>
          ))}
        </div>
      </div>

      {/* Concentric SVG Canvas */}
      <div className="relative flex items-center justify-center my-4 overflow-hidden select-none">
        <div 
          className="w-full max-w-[840px] aspect-square flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 920 920"
            className="w-full h-full max-w-full drop-shadow-2xl overflow-visible"
          >
            <defs>
              {/* SVG Gradient Definitions */}
              {/* Center YOU Gold Gradient */}
              <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="85%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#451a03" />
              </radialGradient>

              {/* Direct Green Gradient */}
              <radialGradient id="directGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="45%" stopColor="#10b981" />
                <stop offset="85%" stopColor="#047857" />
                <stop offset="100%" stopColor="#022c22" />
              </radialGradient>

              {/* Spillover Pink/Magenta Gradient */}
              <radialGradient id="spillGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#f9a8d4" />
                <stop offset="45%" stopColor="#ec4899" />
                <stop offset="85%" stopColor="#be185d" />
                <stop offset="100%" stopColor="#500724" />
              </radialGradient>

              {/* Recycle Red/Crimson Gradient */}
              <radialGradient id="recycleGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="45%" stopColor="#f43f5e" />
                <stop offset="85%" stopColor="#be123c" />
                <stop offset="100%" stopColor="#4c0519" />
              </radialGradient>

              {/* Empty Neutral Gradient */}
              <radialGradient id="emptyGradient" cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="70%" stopColor="#18181b" />
                <stop offset="100%" stopColor="#09090b" />
              </radialGradient>

              {/* Glow Filters */}
              <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="emeraldGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="pinkGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. Concentric Guide Circles with Subtle Cyber Dash */}
            {/* Ring 4 Orbital Guide */}
            <circle
              cx={CX}
              cy={CY}
              r={RINGS.r4}
              fill="none"
              stroke="rgba(16, 185, 129, 0.12)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
            {/* Ring 3 Orbital Guide */}
            <circle
              cx={CX}
              cy={CY}
              r={RINGS.r3}
              fill="none"
              stroke="rgba(16, 185, 129, 0.16)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
            {/* Ring 2 Orbital Guide */}
            <circle
              cx={CX}
              cy={CY}
              r={RINGS.r2}
              fill="none"
              stroke="rgba(16, 185, 129, 0.22)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Ring 1 Orbital Guide */}
            <circle
              cx={CX}
              cy={CY}
              r={RINGS.r1}
              fill="none"
              stroke="rgba(245, 158, 11, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />

            {/* Orbital Label Badges */}
            <text x={CX} y={CY - RINGS.r4 - 8} textAnchor="middle" fill="#059669" fontSize="10" fontFamily="monospace" fontWeight="bold">
              RING 4 • LEVEL 4 (16 POSITIONS)
            </text>
            <text x={CX} y={CY - RINGS.r3 - 6} textAnchor="middle" fill="#059669" fontSize="9" fontFamily="monospace" fontWeight="bold">
              RING 3 • LEVEL 3 (8 POSITIONS)
            </text>
            <text x={CX} y={CY - RINGS.r2 - 6} textAnchor="middle" fill="#059669" fontSize="9" fontFamily="monospace" fontWeight="bold">
              RING 2 • LEVEL 2 (4 POSITIONS)
            </text>
            <text x={CX} y={CY - RINGS.r1 - 6} textAnchor="middle" fill="#d97706" fontSize="9" fontFamily="monospace" fontWeight="bold">
              RING 1 • LEVEL 1 (2 POSITIONS)
            </text>

            {/* 2. Radial Connecting Lines between Nodes */}
            {positions.map((pos) => {
              const currentCoords = nodeLayout.get(pos.positionNumber);
              if (!currentCoords) return null;

              let parentCoords: { x: number; y: number } | undefined;
              if (pos.level === 1) {
                parentCoords = { x: CX, y: CY };
              } else if (currentCoords.parentPos && nodeLayout.has(currentCoords.parentPos)) {
                parentCoords = nodeLayout.get(currentCoords.parentPos);
              }

              if (!parentCoords) return null;

              const isFilled = pos.status === 'Filled';
              let strokeColor = 'rgba(63, 63, 70, 0.35)'; // neutral line for empty
              let strokeWidth = 1.2;

              if (isFilled) {
                if (pos.type === 'direct') strokeColor = 'rgba(16, 185, 129, 0.45)';
                else if (pos.type === 'spill') strokeColor = 'rgba(236, 72, 153, 0.45)';
                else if (pos.type === 'recycle') strokeColor = 'rgba(244, 63, 94, 0.55)';
                strokeWidth = 1.6;
              }

              return (
                <line
                  key={`line-${pos.positionNumber}`}
                  x1={parentCoords.x}
                  y1={parentCoords.y}
                  x2={currentCoords.x}
                  y2={currentCoords.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isFilled ? undefined : '3 3'}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* 3. Center "YOU" Node */}
            <g
              onClick={onSelectRoot}
              onMouseEnter={() => setHoveredNode('root')}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer group"
            >
              {/* Outer Pulsing Aura */}
              <circle
                cx={CX}
                cy={CY}
                r="44"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeOpacity="0.4"
                className="animate-ping origin-center"
                style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: '3s' }}
              />
              <circle
                cx={CX}
                cy={CY}
                r="36"
                fill="url(#goldGradient)"
                stroke="#fbbf24"
                strokeWidth="3"
                filter="url(#goldGlow)"
                className="transition-transform duration-300 group-hover:scale-110"
                style={{ transformOrigin: `${CX}px ${CY}px` }}
              />
              <text
                x={CX}
                y={CY - 4}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="12"
                fontWeight="900"
                fontFamily="monospace"
                letterSpacing="1"
              >
                YOU
              </text>
              <text
                x={CX}
                y={CY + 11}
                textAnchor="middle"
                fill="#fef08a"
                fontSize="8"
                fontWeight="bold"
                fontFamily="monospace"
              >
                ROOT
              </text>
            </g>

            {/* 4. The 30 Matrix Position Nodes */}
            {positions.map((pos) => {
              const coords = nodeLayout.get(pos.positionNumber);
              if (!coords) return null;

              const isVisible = matchesFilter(pos);
              const isHovered = hoveredNode !== null && hoveredNode !== 'root' && hoveredNode.positionNumber === pos.positionNumber;
              const { fill, stroke, textFill } = getNodeSvgColors(pos.type, isHovered);
              const isFilled = pos.status === 'Filled';

              const filterId = pos.type === 'direct' 
                ? 'url(#emeraldGlow)' 
                : pos.type === 'spill' 
                ? 'url(#pinkGlow)' 
                : pos.type === 'recycle' 
                ? 'url(#redGlow)' 
                : undefined;

              return (
                <g
                  key={`node-${pos.positionNumber}`}
                  onClick={() => onSelectPosition(pos)}
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
                      r={coords.nodeRadius + 6}
                      fill="none"
                      stroke={stroke}
                      strokeWidth="2"
                      strokeOpacity="0.7"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={coords.nodeRadius}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isFilled ? '2.5' : '1.5'}
                    strokeDasharray={isFilled ? undefined : '2 2'}
                    filter={isFilled ? filterId : undefined}
                    className="transition-all duration-200"
                  />

                  {/* Node Slot Number */}
                  <text
                    x={coords.x}
                    y={coords.y + (coords.nodeRadius > 20 ? 4 : 3.5)}
                    textAnchor="middle"
                    fill={textFill}
                    fontSize={coords.nodeRadius > 20 ? '11' : coords.nodeRadius > 16 ? '9' : '8'}
                    fontWeight="800"
                    fontFamily="monospace"
                  >
                    #{pos.positionNumber}
                  </text>

                  {/* Level Ring Dot Indicator for Larger Nodes */}
                  {coords.nodeRadius >= 22 && (
                    <text
                      x={coords.x}
                      y={coords.y - 11}
                      textAnchor="middle"
                      fill="#e4e4e7"
                      fontSize="7"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      L{pos.level}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Floating / Active Hovered Node Quick Tooltip Indicator */}
      {hoveredNode && (
        <div className="relative z-20 mt-3 p-3 rounded-2xl bg-zinc-950/90 border border-emerald-500/30 backdrop-blur-md flex items-center justify-between gap-4 text-xs font-mono">
          {hoveredNode === 'root' ? (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                <span className="text-white font-bold">Center Root (YOU): {rootUser.userId}</span>
                <span className="text-amber-300 text-[11px]">({rootUser.walletAddress})</span>
              </div>
              <span className="text-zinc-400">Click to view root account telemetry</span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`w-2.5 h-2.5 rounded-full ${nexusPositionColors[hoveredNode.type].dotColor}`} />
                <span className="text-white font-bold">Slot #{hoveredNode.positionNumber} (Ring {hoveredNode.level}):</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${nexusPositionColors[hoveredNode.type].badgeBg} ${nexusPositionColors[hoveredNode.type].badgeText}`}>
                  {nexusPositionColors[hoveredNode.type].label}
                </span>
                <span className="text-zinc-300">
                  {hoveredNode.status === 'Filled' ? hoveredNode.userId : 'Available Slot'}
                </span>
              </div>
              <span className="text-emerald-400 font-semibold cursor-pointer">
                Click to inspect slot &rarr;
              </span>
            </>
          )}
        </div>
      )}

      {/* Instructions bottom bar */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400 flex-wrap gap-2">
        <span className="flex items-center gap-1.5 text-zinc-400">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          Click on any node in Ring 1, 2, 3, or 4 to inspect occupant details and contract parameters.
        </span>
        <span className="text-zinc-500">
          Scale: L1 (2) &bull; L2 (4) &bull; L3 (8) &bull; L4 (16) = 30 Slots
        </span>
      </div>
    </div>
  );
};
