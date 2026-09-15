import React, { useState, useRef, useEffect } from 'react';

export interface MbttcCoin3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  interactive?: boolean;
  autoRotate?: boolean;
  className?: string;
  glow?: boolean;
}

export const MbttcCoin3D: React.FC<MbttcCoin3DProps> = ({
  size = 'md',
  interactive = true,
  autoRotate = true,
  className = '',
  glow = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateZ: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sizePixels = {
    sm: 32,
    md: 48,
    lg: 74,
    xl: 112,
    hero: 160,
  }[size];

  // Coin thickness based on size
  const thickness = {
    sm: 4.5,
    md: 7,
    lg: 10,
    xl: 14,
    hero: 18,
  }[size];

  const halfThickness = thickness / 2;
  const radius = sizePixels / 2;
  const numFacets = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const facetWidth = ((2 * Math.PI * radius) / numFacets) * 1.06;

  // Generate intermediate edge depth slices for deep realistic 3D substance
  const edgeSlicesCount = size === 'sm' ? 3 : size === 'md' ? 5 : 7;
  const edgeOffsets = Array.from({ length: edgeSlicesCount }, (_, i) => {
    return -halfThickness + (thickness * (i + 1)) / (edgeSlicesCount + 1);
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || isMobile) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -20;
    const rotateZ = ((x - centerX) / centerX) * 12;
    setTilt({ rotateX, rotateZ });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateZ: 0 });
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: sizePixels,
        height: sizePixels,
        perspective: 900,
      }}
    >
      {/* Luminous emerald ambient glow behind coin */}
      {glow && (
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
            isHovered ? 'opacity-100 scale-150' : 'opacity-75 scale-125'
          }`}
          style={{
            background: isHovered
              ? 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, rgba(52,211,153,0.2) 45%, transparent 75%)'
              : 'radial-gradient(circle, rgba(16,185,129,0.28) 0%, rgba(5,150,105,0.1) 45%, transparent 75%)',
            filter: isHovered ? 'blur(10px)' : 'blur(7px)',
          }}
        />
      )}

      {/* Tilt Container with 3D Preservation */}
      <div
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.rotateX}deg) rotateZ(${tilt.rotateZ}deg) scale(${
            isHovered ? 1.06 : 1
          })`,
          transition: isHovered ? 'transform 120ms ease-out' : 'transform 450ms ease-out',
        }}
      >
        {/* Continuous 3D Spinning Coin Container */}
        <div
          className={`w-full h-full relative ${
            autoRotate
              ? isHovered
                ? 'animate-coin-spin-fast'
                : 'animate-coin-spin'
              : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* ============================================================
              1. 3D CYLINDRICAL RIM FACETS (Real Tangible Edge Thickness)
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
                  transform: `translate(-50%, -50%) rotateZ(${angle}deg) translateY(-${radius - 0.2}px) rotateX(90deg)`,
                  background: 'linear-gradient(to bottom, #34d399 0%, #059669 28%, #022c22 62%, #047857 100%)',
                  backgroundImage: 'repeating-linear-gradient(90deg, #10b981 0px, #34d399 1.2px, #044e3b 2.6px, #022c22 4.2px)',
                  borderTop: '0.6px solid rgba(110, 231, 183, 0.65)',
                  borderBottom: '0.6px solid rgba(110, 231, 183, 0.65)',
                  boxShadow: 'inset 0 0 2px rgba(5, 150, 105, 0.6)',
                  backfaceVisibility: 'visible',
                }}
              />
            );
          })}

          {/* Core Density Slices (Double-Sided Solid Substance) */}
          {edgeOffsets.map((offsetZ, idx) => (
            <div
              key={`slice-${idx}`}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                transform: `translateZ(${offsetZ}px)`,
                backfaceVisibility: 'visible',
              }}
            >
              <svg viewBox="0 0 160 160" className="w-full h-full">
                <circle
                  cx="80"
                  cy="80"
                  r="78"
                  fill="#03251a"
                  stroke="#059669"
                  strokeWidth="2.4"
                />
              </svg>
            </div>
          ))}

          {/* ============================================================
              2. FRONT FACE (Obverse - translateZ(+halfThickness))
              ============================================================ */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              transform: `translateZ(${halfThickness}px)`,
              backfaceVisibility: 'hidden',
            }}
          >
            <svg
              viewBox="0 0 160 160"
              className="w-full h-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)]"
            >
              <defs>
                {/* Outer Rim Metallic Emerald Gradient */}
                <radialGradient id={`outerRimGradFront_${size}`} cx="32%" cy="28%" r="72%">
                  <stop offset="0%" stopColor="#6ee7b7" />
                  <stop offset="25%" stopColor="#34d399" />
                  <stop offset="55%" stopColor="#059669" />
                  <stop offset="85%" stopColor="#022c22" />
                  <stop offset="100%" stopColor="#064e3b" />
                </radialGradient>

                {/* Inner Plate Brushed Obsidian-Green Metal */}
                <linearGradient id={`innerPlateGradFront_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#143424" />
                  <stop offset="30%" stopColor="#081a11" />
                  <stop offset="50%" stopColor="#04110b" />
                  <stop offset="70%" stopColor="#0c2518" />
                  <stop offset="100%" stopColor="#133624" />
                </linearGradient>

                {/* Specular Diagonal Gleam */}
                <linearGradient id={`specularSheen_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
                  <stop offset="42%" stopColor="rgba(255,255,255,0.0)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.75)" />
                  <stop offset="58%" stopColor="rgba(255,255,255,0.0)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
                </linearGradient>

                {/* Luminous Neon Ring Glow Filter */}
                <filter id={`luminousGlow_${size}`} x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Embossed Monogram Metallic Gradient */}
                <linearGradient id={`monogramGoldFront_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ecfdf5" />
                  <stop offset="25%" stopColor="#a7f3d0" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="85%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>

                {/* Coin Depth Shadow */}
                <filter id={`coinDepthFront_${size}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
                </filter>
              </defs>

              {/* 1. Outer Coin Rim */}
              <circle
                cx="80"
                cy="80"
                r="76"
                fill={`url(#outerRimGradFront_${size})`}
                stroke="#34d399"
                strokeWidth="2.6"
              />

              {/* 2. Detailed Engraved Edge Ridges (36 perimeter milled lines) */}
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = (i * 360) / 36;
                const rad = (angle * Math.PI) / 180;
                const x1 = 80 + 71.5 * Math.cos(rad);
                const y1 = 80 + 71.5 * Math.sin(rad);
                const x2 = 80 + 75.5 * Math.cos(rad);
                const y2 = 80 + 75.5 * Math.sin(rad);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(167, 243, 208, 0.6)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* 3. Beveled Inner Chamfer & Inner Plate */}
              <circle cx="80" cy="80" r="68" fill="none" stroke="#047857" strokeWidth="1.8" />
              <circle cx="80" cy="80" r="66" fill={`url(#innerPlateGradFront_${size})`} />

              {/* 4. EMERALD GREEN LUMINOUS RING (Engraved & Glowing) */}
              <circle
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.2"
                filter={`url(#luminousGlow_${size})`}
                opacity="0.9"
              />
              <circle
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke="#a7f3d0"
                strokeWidth="1"
                strokeDasharray="4,2"
                opacity="0.8"
              />

              {/* 5. Circular Embossed Typography */}
              <path id={`coinTextTop_${size}`} d="M 31,80 A 49,49 0 0,1 129,80" fill="none" />
              <text
                fontSize="7"
                fill="#6ee7b7"
                fontWeight="800"
                letterSpacing="2.2"
                opacity="0.95"
              >
                <textPath href={`#coinTextTop_${size}`} startOffset="50%" textAnchor="middle">
                  ★ MDefi PROTOCOL ★
                </textPath>
              </text>

              <path id={`coinTextBottom_${size}`} d="M 129,80 A 49,49 0 0,1 31,80" fill="none" />
              <text
                fontSize="7"
                fill="#34d399"
                fontWeight="800"
                letterSpacing="2.2"
                opacity="0.95"
              >
                <textPath href={`#coinTextBottom_${size}`} startOffset="50%" textAnchor="middle">
                  MAGNET BITCOIN TOKEN
                </textPath>
              </text>

              {/* 6. Central Emblem: Magnet Bitcoin Monogram ("M" + Bitcoin stems) */}
              <g filter={`url(#coinDepthFront_${size})`}>
                {/* Central Medallion Background */}
                <circle
                  cx="80"
                  cy="80"
                  r="35"
                  fill="#031b11"
                  stroke="#34d399"
                  strokeWidth="1.6"
                  opacity="0.95"
                />

                {/* Top & Bottom Bitcoin Double Vertical Stems */}
                <line x1="74" y1="51" x2="74" y2="57" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="86" y1="51" x2="86" y2="57" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="74" y1="103" x2="74" y2="109" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="86" y1="103" x2="86" y2="109" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />

                {/* Geometric Magnet Monogram "M" */}
                <path
                  d="M 64 99 L 64 61 L 74 61 L 80 77 L 86 61 L 96 61 L 96 99 L 88 99 L 88 74 L 82 89 L 78 89 L 72 74 L 72 99 Z"
                  fill={`url(#monogramGoldFront_${size})`}
                  stroke="#047857"
                  strokeWidth="0.8"
                />

                {/* Center Spark/Core */}
                <circle cx="80" cy="78" r="2.8" fill="#ffffff" opacity="0.9" />
              </g>

              {/* 7. Realistic Metallic Sheen Reflection */}
              <circle
                cx="80"
                cy="80"
                r="66"
                fill={`url(#specularSheen_${size})`}
                opacity={isHovered ? '0.55' : '0.3'}
                style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
              />

              {/* 8. Top Convex Light Crescent Curve */}
              <path
                d="M 20 80 A 62 62 0 0 1 140 80 A 60 56 0 0 0 20 80 Z"
                fill="rgba(255,255,255,0.22)"
                style={{ pointerEvents: 'none' }}
              />
            </svg>
          </div>

          {/* ============================================================
              3. BACK FACE (Reverse - translateZ(-halfThickness) rotateY(180deg))
              ============================================================ */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              transform: `translateZ(-${halfThickness}px) rotateY(180deg)`,
              backfaceVisibility: 'hidden',
            }}
          >
            <svg
              viewBox="0 0 160 160"
              className="w-full h-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)]"
            >
              <defs>
                <radialGradient id={`outerRimGradBack_${size}`} cx="32%" cy="28%" r="72%">
                  <stop offset="0%" stopColor="#6ee7b7" />
                  <stop offset="25%" stopColor="#34d399" />
                  <stop offset="55%" stopColor="#059669" />
                  <stop offset="85%" stopColor="#022c22" />
                  <stop offset="100%" stopColor="#064e3b" />
                </radialGradient>

                <linearGradient id={`innerPlateGradBack_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#143424" />
                  <stop offset="30%" stopColor="#081a11" />
                  <stop offset="50%" stopColor="#04110b" />
                  <stop offset="70%" stopColor="#0c2518" />
                  <stop offset="100%" stopColor="#133624" />
                </linearGradient>
              </defs>

              {/* Outer Rim */}
              <circle
                cx="80"
                cy="80"
                r="76"
                fill={`url(#outerRimGradBack_${size})`}
                stroke="#34d399"
                strokeWidth="2.6"
              />

              {/* Edge serrations */}
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = (i * 360) / 36;
                const rad = (angle * Math.PI) / 180;
                const x1 = 80 + 71.5 * Math.cos(rad);
                const y1 = 80 + 71.5 * Math.sin(rad);
                const x2 = 80 + 75.5 * Math.cos(rad);
                const y2 = 80 + 75.5 * Math.sin(rad);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(167, 243, 208, 0.6)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                );
              })}

              <circle cx="80" cy="80" r="68" fill="none" stroke="#047857" strokeWidth="1.8" />
              <circle cx="80" cy="80" r="66" fill={`url(#innerPlateGradBack_${size})`} />

              {/* Luminous Ring Back */}
              <circle
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.2"
                filter={`url(#luminousGlow_${size})`}
                opacity="0.9"
              />

              {/* Back Circular Text */}
              <path id={`coinTextTopBack_${size}`} d="M 31,80 A 49,49 0 0,1 129,80" fill="none" />
              <text
                fontSize="6.8"
                fill="#6ee7b7"
                fontWeight="800"
                letterSpacing="1.8"
                opacity="0.95"
              >
                <textPath href={`#coinTextTopBack_${size}`} startOffset="50%" textAnchor="middle">
                  ★ DECENTRALIZED PROTOCOL ★
                </textPath>
              </text>

              <path id={`coinTextBottomBack_${size}`} d="M 129,80 A 49,49 0 0,1 31,80" fill="none" />
              <text
                fontSize="6.8"
                fill="#34d399"
                fontWeight="800"
                letterSpacing="1.8"
                opacity="0.95"
              >
                <textPath href={`#coinTextBottomBack_${size}`} startOffset="50%" textAnchor="middle">
                  MBTTC — 21M DEMO SUPPLY
                </textPath>
              </text>

              {/* Reverse Central Web3 Network Matrix Nodes */}
              <g filter={`url(#coinDepthFront_${size})`}>
                <circle cx="80" cy="80" r="35" fill="#031b11" stroke="#34d399" strokeWidth="1.6" />

                {/* Hexagonal Node Mesh */}
                <polygon
                  points="80,57 100,68 100,92 80,103 60,92 60,68"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.6"
                  opacity="0.8"
                />
                <circle cx="80" cy="57" r="3" fill="#a7f3d0" />
                <circle cx="100" cy="68" r="3" fill="#a7f3d0" />
                <circle cx="100" cy="92" r="3" fill="#a7f3d0" />
                <circle cx="80" cy="103" r="3" fill="#a7f3d0" />
                <circle cx="60" cy="92" r="3" fill="#a7f3d0" />
                <circle cx="60" cy="68" r="3" fill="#a7f3d0" />

                {/* Inner Core */}
                <circle cx="80" cy="80" r="7" fill="#34d399" />
                <circle cx="80" cy="80" r="3" fill="#ffffff" />

                {/* Connecting Rays */}
                <line x1="80" y1="80" x2="80" y2="57" stroke="#34d399" strokeWidth="1.2" />
                <line x1="80" y1="80" x2="100" y2="68" stroke="#34d399" strokeWidth="1.2" />
                <line x1="80" y1="80" x2="100" y2="92" stroke="#34d399" strokeWidth="1.2" />
                <line x1="80" y1="80" x2="80" y2="103" stroke="#34d399" strokeWidth="1.2" />
                <line x1="80" y1="80" x2="60" y2="92" stroke="#34d399" strokeWidth="1.2" />
                <line x1="80" y1="80" x2="60" y2="68" stroke="#34d399" strokeWidth="1.2" />
              </g>

              {/* Specular sheen on reverse */}
              <circle
                cx="80"
                cy="80"
                r="66"
                fill={`url(#specularSheen_${size})`}
                opacity="0.3"
                style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
