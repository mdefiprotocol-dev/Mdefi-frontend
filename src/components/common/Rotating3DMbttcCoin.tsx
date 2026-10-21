import React from 'react';

export interface Rotating3DMbttcCoinProps {
  size?: number;
  accent?: 'emerald' | 'rose' | 'sapphire' | 'amber';
  className?: string;
}

export const Rotating3DMbttcCoin: React.FC<Rotating3DMbttcCoinProps> = ({ 
  size = 54, 
  accent = 'emerald',
  className = '' 
}) => {
  // Glow accent styling
  const glowColor = accent === 'emerald'
    ? 'rgba(16, 185, 129, 0.35)'
    : accent === 'rose'
      ? 'rgba(244, 63, 94, 0.35)'
      : accent === 'sapphire'
        ? 'rgba(59, 130, 246, 0.35)'
        : 'rgba(245, 158, 11, 0.35)';

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        perspective: '800px',
      }}
    >
      {/* Component-scoped 3D Spin and Sheen Animations */}
      <style>{`
        @keyframes coin3dSpinLoop {
          0% {
            transform: rotateY(0deg) rotateX(8deg);
          }
          50% {
            transform: rotateY(180deg) rotateX(-8deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(8deg);
          }
        }
        @keyframes coin-sheen {
          0% {
            transform: translateX(-160%) skewX(-20deg);
            opacity: 0;
          }
          30% {
            opacity: 0.75;
          }
          60% {
            transform: translateX(160%) skewX(-20deg);
            opacity: 0;
          }
          100% {
            transform: translateX(160%) skewX(-20deg);
            opacity: 0;
          }
        }
        .mdefi-coin-3d-spin {
          animation: coin3dSpinLoop 6s linear infinite !important;
          transform-style: preserve-3d !important;
        }
        .animate-coin-sheen {
          animation: coin-sheen 3.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .mdefi-coin-3d-spin,
          .animate-coin-sheen {
            animation: none !important;
          }
        }
      `}</style>

      {/* Ambient soft backlight */}
      <div 
        className="absolute inset-0 rounded-full blur-md pointer-events-none transition-all duration-300"
        style={{ backgroundColor: glowColor }}
      />

      {/* 3D Coin Body (Continuously Rotating) */}
      <div 
        className="relative w-full h-full flex items-center justify-center mdefi-coin-3d-spin"
        style={{ 
          transformStyle: 'preserve-3d',
          animation: 'coin3dSpinLoop 6s linear infinite'
        }}
      >
        {/* ================= THICK METALLIC RIM SLICES (Z-Depth) ================= */}
        {[-3, -2, -1, 0, 1, 2, 3].map((zOffset) => (
          <div 
            key={zOffset}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${size - 2}px`,
              height: `${size - 2}px`,
              transform: `translateZ(${zOffset}px)`,
              background: 'radial-gradient(circle, #78350f 40%, #b45309 70%, #d97706 95%, #f59e0b 100%)',
              border: '1px solid #92400e',
              opacity: zOffset === 0 ? 0.9 : 0.6,
            }}
          />
        ))}

        {/* ================= FRONT COIN FACE (translateZ: +4px) ================= */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden"
          style={{
            transform: 'translateZ(4px)',
            backfaceVisibility: 'visible',
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
          }}
        >
          <svg 
            width={size} 
            height={size} 
            viewBox="0 0 64 64" 
            className="w-full h-full"
            aria-label="3D MBTTC Token Front"
          >
            <defs>
              <radialGradient id="mbttcGoldBevelGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="20%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="85%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>

              <radialGradient id="mbttcGoldInnerFloor" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="35%" stopColor="#fbbf24" />
                <stop offset="75%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#451a03" />
              </radialGradient>

              <linearGradient id="mbttcEmblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* Outer Rim Ring */}
            <circle cx="32" cy="32" r="30" fill="url(#mbttcGoldBevelGrad)" stroke="#fef08a" strokeWidth="1.2" />

            {/* Milled Gear Ridges */}
            <circle cx="32" cy="32" r="26.5" fill="none" stroke="#78350f" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.65" />

            {/* Recessed Face Floor */}
            <circle cx="32" cy="32" r="23.5" fill="url(#mbttcGoldInnerFloor)" stroke="#fde68a" strokeWidth="1" />

            {/* Precision Micro-Ring */}
            <circle cx="32" cy="32" r="20" fill="none" stroke="#fef3c7" strokeWidth="0.8" opacity="0.5" />

            {/* MDeFi / MBTTC Geometric Diamond Shield Emblem */}
            <g transform="translate(16, 16) scale(0.5)">
              <path 
                d="M 12 48 L 12 16 L 32 34 L 52 16 L 52 48 L 42 48 L 42 28 L 32 38 L 22 28 L 22 48 Z" 
                fill="url(#mbttcEmblemGrad)" 
                stroke="#fffbeb" 
                strokeWidth="1.5"
                filter="drop-shadow(0 2px 3px rgba(0,0,0,0.6))"
              />
              <polygon points="32,20 37,27 32,34 27,27" fill="#ffffff" />
            </g>

            {/* Micro Star Points around Rim */}
            <circle cx="32" cy="10" r="1.2" fill="#fffbeb" />
            <circle cx="32" cy="54" r="1.2" fill="#fffbeb" />
            <circle cx="10" cy="32" r="1.2" fill="#fffbeb" />
            <circle cx="54" cy="32" r="1.2" fill="#fffbeb" />
          </svg>

          {/* Sweeping Specular Light Sheen */}
          <div className="absolute inset-0 pointer-events-none animate-coin-sheen bg-gradient-to-tr from-transparent via-white/50 to-transparent" />
        </div>

        {/* ================= BACK COIN FACE (rotateY: 180deg, translateZ: -4px) ================= */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden"
          style={{
            transform: 'rotateY(180deg) translateZ(4px)',
            backfaceVisibility: 'visible',
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
          }}
        >
          <svg 
            width={size} 
            height={size} 
            viewBox="0 0 64 64" 
            className="w-full h-full"
            aria-label="3D MBTTC Token Back"
          >
            {/* Outer Rim Ring */}
            <circle cx="32" cy="32" r="30" fill="url(#mbttcGoldBevelGrad)" stroke="#fef08a" strokeWidth="1.2" />

            {/* Milled Ridges */}
            <circle cx="32" cy="32" r="26.5" fill="none" stroke="#78350f" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.65" />

            {/* Recessed Face Floor */}
            <circle cx="32" cy="32" r="23.5" fill="url(#mbttcGoldInnerFloor)" stroke="#fde68a" strokeWidth="1" />

            {/* Reverse Protocol Monogram "MBTTC" */}
            <text
              x="32"
              y="37"
              textAnchor="middle"
              fontSize="12"
              fontWeight="900"
              fontFamily="JetBrains Mono, monospace, sans-serif"
              fill="#ffffff"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.7)',
                filter: 'drop-shadow(0 1px 2px #78350f)'
              }}
            >
              MBTTC
            </text>

            {/* Protocol Stars */}
            <text x="32" y="24" textAnchor="middle" fontSize="8" fill="#fef08a">✦ ✦ ✦</text>
            <text x="32" y="47" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="#fde68a" opacity="0.8">ON-CHAIN</text>
          </svg>

          {/* Sweeping Specular Light Sheen */}
          <div className="absolute inset-0 pointer-events-none animate-coin-sheen bg-gradient-to-tr from-transparent via-white/50 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default Rotating3DMbttcCoin;