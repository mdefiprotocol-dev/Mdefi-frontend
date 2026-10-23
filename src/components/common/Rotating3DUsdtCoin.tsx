import React, { useId } from 'react';

export interface Rotating3DUsdtCoinProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const Rotating3DUsdtCoin: React.FC<Rotating3DUsdtCoinProps> = ({ 
  size = 54, 
  className = '',
  glow = true
}) => {
  const uniqueId = useId().replace(/:/g, '');

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
      <style>{`
        @keyframes usdtAlwaysSpin {
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
        @keyframes usdtSheenSweep {
          0% { transform: translateX(-180%) skewX(-25deg); opacity: 0; }
          25% { opacity: 0.85; }
          50% { transform: translateX(180%) skewX(-25deg); opacity: 0; }
          100% { transform: translateX(180%) skewX(-25deg); opacity: 0; }
        }
      `}</style>

      {/* Dynamic Ambient Teal Glow */}
      {glow && (
        <div 
          className="absolute inset-0 rounded-full blur-[6px] pointer-events-none transition-opacity duration-300"
          style={{ 
            backgroundColor: 'rgba(38, 161, 123, 0.45)',
            transform: 'scale(0.92)'
          }} 
        />
      )}

      {/* 3D Spin Body - Guaranteed Non-Stop 60FPS Spin */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ 
          transformStyle: 'preserve-3d',
          animation: 'usdtAlwaysSpin 5s linear infinite',
          WebkitAnimation: 'usdtAlwaysSpin 5s linear infinite',
          willChange: 'transform'
        }}
      >
        {/* Layered Cylindrical Metallic Rim (Teal / Emerald Depth) */}
        {rimSlices.map((zOffset) => (
          <div 
            key={zOffset}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${Math.max(10, size - 1)}px`,
              height: `${Math.max(10, size - 1)}px`,
              transform: `translateZ(${zOffset}px)`,
              background: 'radial-gradient(circle, #064e3b 30%, #047857 65%, #10b981 90%, #6ee7b7 100%)',
              border: '0.5px solid #065f46',
              opacity: zOffset === 0 ? 0.95 : 0.65,
            }}
          />
        ))}

        {/* ================= FRONT COIN FACE ================= */}
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
            aria-label="Official 3D USDT Front"
          >
            <defs>
              <radialGradient id={`usdtBevelGrad_${uniqueId}`} cx="32%" cy="28%" r="72%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="18%" stopColor="#6ee7b7" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="82%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064e3b" />
              </radialGradient>

              <radialGradient id={`usdtFloorGrad_${uniqueId}`} cx="35%" cy="30%" r="68%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="35%" stopColor="#26a17b" />
                <stop offset="70%" stopColor="#1f7d61" />
                <stop offset="100%" stopColor="#064e3b" />
              </radialGradient>

              <filter id={`usdtEmboss_${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.2" stdDeviation="0.8" floodColor="#022c22" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Outer Beveled Rim */}
            <circle cx="32" cy="32" r="30.5" fill={`url(#usdtBevelGrad_${uniqueId})`} stroke="#a7f3d0" strokeWidth="1" />

            {/* Milled Ridge Border */}
            <circle cx="32" cy="32" r="27" fill="none" stroke="#064e3b" strokeWidth="1.2" strokeDasharray="2 1.5" opacity="0.65" />

            {/* Official Tether Teal Inner Floor */}
            <circle cx="32" cy="32" r="24" fill={`url(#usdtFloorGrad_${uniqueId})`} stroke="#6ee7b7" strokeWidth="0.8" />

            {/* Inner Precision Ring */}
            <circle cx="32" cy="32" r="20.5" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />

            {/* Official USDT Emblem Geometry */}
            <g transform="translate(14, 14) scale(0.5625)" filter={`url(#usdtEmboss_${uniqueId})`}>
              {/* Outer Oval Ring */}
              <path 
                d="M32 15 C14.33 15 0 20.37 0 27 C0 32.55 10.05 37.16 23.5 38.64 L23.5 32.88 C13.72 31.62 6.5 28.53 6.5 27 C6.5 24.3 17.5 21.5 32 21.5 C46.5 21.5 57.5 24.3 57.5 27 C57.5 28.53 50.28 31.62 40.5 32.88 L40.5 38.64 C53.95 37.16 64 32.55 64 27 C64 20.37 49.67 15 32 15 Z" 
                fill="#ffffff" 
              />
              {/* Center "T" Symbol */}
              <path 
                d="M7 2.5 L57 2.5 L57 12.5 L36.5 12.5 L36.5 61.5 L27.5 61.5 L27.5 12.5 L7 12.5 Z" 
                fill="#ffffff" 
              />
            </g>

            {/* Cardinal Micro Specular Accent Dots */}
            <circle cx="32" cy="9.5" r="1.3" fill="#ffffff" />
            <circle cx="32" cy="54.5" r="1.3" fill="#ffffff" />
            <circle cx="9.5" cy="32" r="1.3" fill="#ffffff" />
            <circle cx="54.5" cy="32" r="1.3" fill="#ffffff" />
          </svg>

          {/* Sweeping Specular Light Reflection */}
          <div 
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/50 to-transparent" 
            style={{ animation: 'usdtSheenSweep 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
          />
        </div>

        {/* ================= BACK COIN FACE ================= */}
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
            aria-label="Official 3D USDT Back"
          >
            {/* Outer Beveled Rim */}
            <circle cx="32" cy="32" r="30.5" fill={`url(#usdtBevelGrad_${uniqueId})`} stroke="#a7f3d0" strokeWidth="1" />

            {/* Milled Ridge Border */}
            <circle cx="32" cy="32" r="27" fill="none" stroke="#064e3b" strokeWidth="1.2" strokeDasharray="2 1.5" opacity="0.65" />

            {/* Center Core Floor */}
            <circle cx="32" cy="32" r="24" fill={`url(#usdtFloorGrad_${uniqueId})`} stroke="#6ee7b7" strokeWidth="0.8" />

            {/* Monogram USDT */}
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
                filter: 'drop-shadow(0 1px 2px #064e3b)'
              }}
            >
              USDT
            </text>

            <text x="32" y="23.5" textAnchor="middle" fontSize="7.5" fill="#a7f3d0" fontWeight="bold">✦ ✦ ✦</text>
            <text x="32" y="47.5" textAnchor="middle" fontSize="6" fontFamily="monospace" fontWeight="bold" fill="#6ee7b7" letterSpacing="0.5">TETHER</text>
          </svg>

          {/* Sweeping Specular Light Reflection */}
          <div 
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/50 to-transparent" 
            style={{ animation: 'usdtSheenSweep 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Rotating3DUsdtCoin;