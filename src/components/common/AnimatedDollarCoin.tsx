import React, { useState, useRef } from 'react';

export interface AnimatedDollarCoinProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  glow?: boolean;
  interactive?: boolean;
}

export const AnimatedDollarCoin: React.FC<AnimatedDollarCoinProps> = ({
  size = 'md',
  className = '',
  glow = true,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Dimension mapping in pixels
  const sizePixels = {
    xs: 16,
    sm: 20,
    md: 26,
    lg: 34,
    xl: 46,
    hero: 64,
  }[size];

  // Coin thickness based on size (3D edge thickness)
  const thickness = {
    xs: 2.5,
    sm: 3.5,
    md: 4.8,
    lg: 6.5,
    xl: 8.5,
    hero: 12,
  }[size];

  const halfThickness = thickness / 2;
  const radius = sizePixels / 2;
  const numFacets = size === 'xs' ? 10 : size === 'sm' ? 14 : size === 'md' ? 18 : 22;
  const facetWidth = ((2 * Math.PI * radius) / numFacets) * 1.08;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      className={`relative inline-flex items-center justify-center select-none shrink-0 align-middle ${className}`}
      style={{
        width: sizePixels,
        height: sizePixels,
        perspective: 600,
      }}
      title="Dollar Value Benchmark"
    >
      {/* 1. Luminous Emerald-Gold Ambient Aura */}
      {glow && (
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
            isHovered ? 'opacity-100 scale-150' : 'opacity-75 scale-125'
          }`}
          style={{
            background: isHovered
              ? 'radial-gradient(circle, rgba(234,179,8,0.5) 0%, rgba(16,185,129,0.35) 45%, transparent 75%)'
              : 'radial-gradient(circle, rgba(234,179,8,0.3) 0%, rgba(16,185,129,0.18) 45%, transparent 75%)',
            filter: isHovered ? 'blur(6px)' : 'blur(4px)',
          }}
        />
      )}

      {/* 2. Floating Micro Particles (subtle Web3 space finance sheen) */}
      {size !== 'xs' && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          <span
            className="absolute -top-1 -right-0.5 w-1 h-1 rounded-full bg-amber-300 opacity-70 animate-ping motion-reduce:animate-none"
            style={{ animationDuration: '3.5s' }}
          />
          <span
            className="absolute -bottom-1 -left-0.5 w-1 h-1 rounded-full bg-emerald-300 opacity-60 animate-pulse motion-reduce:animate-none"
            style={{ animationDuration: '2.5s' }}
          />
        </div>
      )}

      {/* 3. 3D Spinning Coin Container */}
      <div
        className={`w-full h-full relative ${
          isHovered ? 'animate-coin-spin-fast' : 'animate-coin-spin'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* ============================================================
            A. 3D CYLINDRICAL RIM FACETS (Real Milled Edge)
            ============================================================ */}
        {Array.from({ length: numFacets }).map((_, i) => {
          const angle = (i * 360) / numFacets;
          return (
            <div
              key={`rim-facet-${i}`}
              className="absolute pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                width: `${facetWidth}px`,
                height: `${thickness}px`,
                transform: `translate(-50%, -50%) rotateZ(${angle}deg) translateY(-${radius - 0.15}px) rotateX(90deg)`,
                background:
                  'linear-gradient(to bottom, #fde047 0%, #ca8a04 35%, #15803d 70%, #047857 100%)',
                backgroundImage:
                  'repeating-linear-gradient(90deg, #eab308 0px, #fef08a 1px, #a16207 2px, #166534 3px)',
                borderTop: '0.5px solid rgba(254, 240, 138, 0.7)',
                borderBottom: '0.5px solid rgba(110, 231, 183, 0.6)',
                backfaceVisibility: 'visible',
              }}
            />
          );
        })}

        {/* ============================================================
            B. FRONT FACE (Obverse - Large Engraved '$' Sign)
            ============================================================ */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            transform: `translateZ(${halfThickness}px)`,
            backfaceVisibility: 'hidden',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
          >
            <defs>
              {/* Outer Golden/Emerald Metallic Bevel */}
              <radialGradient id={`dollarCoinRim_${size}`} cx="30%" cy="25%" r="75%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="25%" stopColor="#eab308" />
                <stop offset="55%" stopColor="#ca8a04" />
                <stop offset="85%" stopColor="#065f46" />
                <stop offset="100%" stopColor="#047857" />
              </radialGradient>

              {/* Inner Luxury Brushed Metal Plate */}
              <linearGradient id={`dollarInnerPlate_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a2e1d" />
                <stop offset="35%" stopColor="#0a180e" />
                <stop offset="65%" stopColor="#06120a" />
                <stop offset="100%" stopColor="#153620" />
              </linearGradient>

              {/* Engraved Metallic 3D Dollar Symbol Gradient */}
              <linearGradient id={`dollarSignGold_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="20%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="80%" stopColor="#ca8a04" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>

              {/* Neon Green Inset Ring Filter */}
              <filter id={`dollarNeonGlow_${size}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer Rim */}
            <circle
              cx="50"
              cy="50"
              r="47"
              fill={`url(#dollarCoinRim_${size})`}
              stroke="#fef08a"
              strokeWidth="1.5"
            />

            {/* Perimeter milled notch ring */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const rad = (angle * Math.PI) / 180;
              const x1 = 50 + 44.5 * Math.cos(rad);
              const y1 = 50 + 44.5 * Math.sin(rad);
              const x2 = 50 + 47 * Math.cos(rad);
              const y2 = 50 + 47 * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(254, 240, 138, 0.75)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Inner Plate */}
            <circle cx="50" cy="50" r="42" fill="#064e3b" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="50" cy="50" r="40" fill={`url(#dollarInnerPlate_${size})`} />

            {/* Glowing Emerald Inset Ring */}
            <circle
              cx="50"
              cy="50"
              r="34"
              fill="none"
              stroke="#34d399"
              strokeWidth="1.4"
              filter={`url(#dollarNeonGlow_${size})`}
              opacity="0.85"
            />

            {/* Center Engraved Dollar Symbol ($) */}
            <g>
              {/* Dollar Vertical Core Spine */}
              <line
                x1="50"
                y1="23"
                x2="50"
                y2="77"
                stroke={`url(#dollarSignGold_${size})`}
                strokeWidth="4.2"
                strokeLinecap="round"
              />
              {/* Large Engraved '$' Typography */}
              <text
                x="50"
                y="63"
                textAnchor="middle"
                fontSize="46"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, sans-serif"
                fill={`url(#dollarSignGold_${size})`}
                stroke="#713f12"
                strokeWidth="1.2"
                style={{
                  filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.8))',
                  paintOrder: 'stroke fill',
                }}
              >
                $
              </text>
            </g>

            {/* Specular Diagonal Sheen Reflection */}
            <path
              d="M 16 50 A 34 34 0 0 1 84 50 A 34 30 0 0 0 16 50 Z"
              fill="rgba(255,255,255,0.22)"
              style={{ pointerEvents: 'none' }}
            />
          </svg>
        </div>

        {/* ============================================================
            C. BACK FACE (Reverse - MDefi Geometric Financial Emblem)
            ============================================================ */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            transform: `translateZ(-${halfThickness}px) rotateY(180deg)`,
            backfaceVisibility: 'hidden',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
          >
            {/* Outer Rim */}
            <circle
              cx="50"
              cy="50"
              r="47"
              fill={`url(#dollarCoinRim_${size})`}
              stroke="#34d399"
              strokeWidth="1.5"
            />

            {/* Inner Plate */}
            <circle cx="50" cy="50" r="42" fill="#064e3b" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="50" cy="50" r="40" fill={`url(#dollarInnerPlate_${size})`} />

            {/* Glowing Ring */}
            <circle
              cx="50"
              cy="50"
              r="34"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.4"
              opacity="0.9"
            />

            {/* Geometric Financial Lattice Emblem */}
            <polygon
              points="50,28 69,39 69,61 50,72 31,61 31,39"
              fill="none"
              stroke={`url(#dollarSignGold_${size})`}
              strokeWidth="2"
              opacity="0.9"
            />
            {/* Inner Diamond */}
            <polygon
              points="50,37 60,50 50,63 40,50"
              fill={`url(#dollarSignGold_${size})`}
              stroke="#065f46"
              strokeWidth="0.8"
            />
            {/* Center Core Spark */}
            <circle cx="50" cy="50" r="3" fill="#ffffff" />

            {/* Corner Nodes */}
            <circle cx="50" cy="28" r="2" fill="#fde047" />
            <circle cx="69" cy="39" r="2" fill="#fde047" />
            <circle cx="69" cy="61" r="2" fill="#fde047" />
            <circle cx="50" cy="72" r="2" fill="#fde047" />
            <circle cx="31" cy="61" r="2" fill="#fde047" />
            <circle cx="31" cy="39" r="2" fill="#fde047" />

            {/* Sheen */}
            <path
              d="M 16 50 A 34 34 0 0 1 84 50 A 34 30 0 0 0 16 50 Z"
              fill="rgba(255,255,255,0.18)"
              style={{ pointerEvents: 'none' }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AnimatedDollarCoin;
