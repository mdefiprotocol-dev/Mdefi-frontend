import React, { useId } from 'react';

export interface Rotating3DMbttcCoinProps {
  size?: number;
  accent?: 'emerald' | 'rose' | 'sapphire' | 'amber';
  className?: string;
}

export const Rotating3DMbttcCoin: React.FC<Rotating3DMbttcCoinProps> = ({ 
  size = 54, 
  accent = 'amber',
  className = '' 
}) => {
  const uniqueId = useId().replace(/:/g, '');

  const glowColor = accent === 'emerald'
    ? 'rgba(16, 185, 129, 0.45)'
    : accent === 'rose'
      ? 'rgba(244, 63, 94, 0.45)'
      : accent === 'sapphire'
        ? 'rgba(59, 130, 246, 0.45)'
        : 'rgba(245, 158, 11, 0.45)';

  const isSmall = size <= 28;
  const zDepth = isSmall ? 2 : 4;
  const rimSlices = isSmall ? [-1, 0, 1] : [-3, -2, -1, 0, 1, 2, 3];

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        perspective: '1000px',
      }}
    >
      {/* Universal 3D Keyframe Injection */}
      <style>{`
        @keyframes mbttcAlwaysSpin {
          0% {
            transform: rotateY(0deg) rotateX(6deg);
          }
          50% {
            transform: rotateY(180deg) rotateX(-6deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(6deg);
          }
        }
        @keyframes mbttcSheenLight {
          0% { transform: translateX(-180%) skewX(-25deg); opacity: 0; }
          25% { opacity: 0.85; }
          50% { transform: translateX(180%) skewX(-25deg); opacity: 0; }
          100% { transform: translateX(180%) skewX(-25deg); opacity: 0; }
        }
      `}</style>

      {/* Dynamic Ambient Neon Core Glow */}
      <div 
        className="absolute inset-0 rounded-full blur-[6px] pointer-events-none"
        style={{ 
          backgroundColor: glowColor,
          transform: 'scale(0.92)'
        }} 
      />

      {/* 3D Spin Body - Guaranteed Non-Stop 60FPS Spin */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ 
          transformStyle: 'preserve-3d',
          animation: 'mbttcAlwaysSpin 5s linear infinite',
          WebkitAnimation: 'mbttcAlwaysSpin 5s linear infinite',
          willChange: 'transform'
        }}
      >
        {/* Layered Cylindrical Metallic Rim */}
        {rimSlices.map((zOffset) => (
          <div 
            key={zOffset}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${Math.max(10, size - 1)}px`,
              height: `${Math.max(10, size - 1)}px`,
              transform: `translateZ(${zOffset}px)`,
              background: 'radial-gradient(circle, #5e2806 30%, #9a3412 65%, #d97706 90%, #fef08a 100%)',
              border: '0.5px solid #78350f',
              opacity: zOffset === 0 ? 0.95 : 0.65,
            }}
          />
        ))}

        {/* FRONT COIN FACE */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden"
          style={{
            transform: `translateZ(${zDepth}px)`,
            backfaceVisibility: 'visible',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
          }}
        >
          <svg 
            width={size} 
            height={size} 
            viewBox="0 0 64 64" 
            className="w-full h-full block"
            shapeRendering="geometricPrecision"
            aria-label="3D MBTTC Front"
          >
            <defs>
              <radialGradient id={`bevelGrad_${uniqueId}`} cx="32%" cy="28%" r="72%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="15%" stopColor="#fef08a" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="80%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#451a03" />
              </radialGradient>

              <radialGradient id={`innerFloor_${uniqueId}`} cx="35%" cy="30%" r="68%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="25%" stopColor="#fde047" />
                <stop offset="60%" stopColor="#d97706" />
                <stop offset="92%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#270e02" />
              </radialGradient>

              <linearGradient id={`emblemGrad_${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>

              <filter id={`embossGlow_${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#000000" floodOpacity="0.75" />
              </filter>
            </defs>

            {/* Outer Beveled Rim */}
            <circle cx="32" cy="32" r="30.5" fill={`url(#bevelGrad_${uniqueId})`} stroke="#fef9c3" strokeWidth="1" />

            {/* Milled Notched Track */}
            <circle cx="32" cy="32" r="27" fill="none" stroke="#78350f" strokeWidth="1.2" strokeDasharray="2 1.5" opacity="0.7" />

            {/* Recessed Center Core */}
            <circle cx="32" cy="32" r="24" fill={`url(#innerFloor_${uniqueId})`} stroke="#fef08a" strokeWidth="0.8" />

            {/* Inner Precision Halo */}
            <circle cx="32" cy="32" r="20.5" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.55" />

            {/* MDeFi Emblem (Sharp Diamond Shield Logo) */}
            <g transform="translate(16, 16) scale(0.5)" filter={`url(#embossGlow_${uniqueId})`}>
              <path 
                d="M 12 48 L 12 16 L 32 34 L 52 16 L 52 48 L 42 48 L 42 28 L 32 38 L 22 28 L 22 48 Z" 
                fill={`url(#emblemGrad_${uniqueId})`} 
                stroke="#fffbeb" 
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <polygon points="32,20 37,27 32,34 27,27" fill="#ffffff" />
            </g>

            {/* Cardinal Micro Stars */}
            <circle cx="32" cy="9.5" r="1.3" fill="#ffffff" />
            <circle cx="32" cy="54.5" r="1.3" fill="#ffffff" />
            <circle cx="9.5" cy="32" r="1.3" fill="#ffffff" />
            <circle cx="54.5" cy="32" r="1.3" fill="#ffffff" />
          </svg>

          {/* Dynamic Light Reflection Sweep */}
          <div 
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/55 to-transparent" 
            style={{ animation: 'mbttcSheenLight 3s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
          />
        </div>

        {/* BACK COIN FACE */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden"
          style={{
            transform: `rotateY(180deg) translateZ(${zDepth}px)`,
            backfaceVisibility: 'visible',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
          }}
        >
          <svg 
            width={size} 
            height={size} 
            viewBox="0 0 64 64" 
            className="w-full h-full block"
            shapeRendering="geometricPrecision"
            aria-label="3D MBTTC Back"
          >
            {/* Outer Beveled Rim */}
            <circle cx="32" cy="32" r="30.5" fill={`url(#bevelGrad_${uniqueId})`} stroke="#fef9c3" strokeWidth="1" />

            {/* Milled Track */}
            <circle cx="32" cy="32" r="27" fill="none" stroke="#78350f" strokeWidth="1.2" strokeDasharray="2 1.5" opacity="0.7" />

            {/* Recessed Center */}
            <circle cx="32" cy="32" r="24" fill={`url(#innerFloor_${uniqueId})`} stroke="#fef08a" strokeWidth="0.8" />

            {/* Monogram MBTTC */}
            <text
              x="32"
              y="37"
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="900"
              fontFamily="monospace"
              fill="#ffffff"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.85)',
                filter: 'drop-shadow(0 1px 2px #451a03)'
              }}
            >
              MBTTC
            </text>

            <text x="32" y="23.5" textAnchor="middle" fontSize="7.5" fill="#fef08a" fontWeight="bold">✦ ✦ ✦</text>
            <text x="32" y="47.5" textAnchor="middle" fontSize="6" fontFamily="monospace" fontWeight="bold" fill="#fde68a" letterSpacing="0.5">ON-CHAIN</text>
          </svg>

          {/* Dynamic Light Reflection Sweep */}
          <div 
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/55 to-transparent" 
            style={{ animation: 'mbttcSheenLight 3s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Rotating3DMbttcCoin;