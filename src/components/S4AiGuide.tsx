import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Bot, ArrowRight, Zap, X, HelpCircle, MessageSquare } from 'lucide-react';

interface S4AiGuideProps {
  packageName?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'header';
  customTip?: string;
  pointingDirection?: 'down' | 'right';
  className?: string;
}

export const S4AiGuide: React.FC<S4AiGuideProps> = ({
  packageName = 'Junior Node',
  onClick,
  size = 'md',
  customTip,
  pointingDirection = 'down',
  className = '',
}) => {
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isJunior = packageName.toLowerCase().includes('junior');

  const tips = customTip ? [customTip] : [
    `Click me for ${packageName} tips 💡`,
    `Cycle 2x2 binary slots to earn`,
    `Slot #6 triggers auto-recycle`,
    `Direct & spillover rewards active`,
  ];

  useEffect(() => {
    if (customTip) return;
    const interval = setInterval(() => {
      setBubbleIndex((prev) => (prev + 1) % tips.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [customTip, tips.length]);

  // Click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsTooltipOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSpeech = customTip || tips[bubbleIndex];

  const handleCharacterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTooltipOpen((prev) => !prev);
    if (onClick) onClick();
  };

  return (
    <div 
      ref={containerRef}
      className={`relative inline-flex flex-col items-center select-none ${className}`}
    >
      {/* Interactive Expanded Help Tooltip (on click) */}
      {isTooltipOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 sm:w-72 p-3.5 rounded-2xl bg-zinc-950/95 border border-emerald-500/50 backdrop-blur-2xl shadow-[0_0_25px_rgba(16,185,129,0.3)] z-40 text-xs font-mono text-zinc-200 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-zinc-800">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{packageName} AI Guide</span>
            </div>
            <button 
              onClick={() => setIsTooltipOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            {isJunior ? (
              <>
                <strong className="text-white">Junior Node ($10):</strong> Fast-cycling 2x2 community matrix with 6 slots. Generates <strong className="text-emerald-400">$4 Direct</strong> + <strong className="text-emerald-400">$4 Matrix</strong> income. Slot #6 auto-recycles into a fresh matrix!
              </>
            ) : (
              <>
                <strong className="text-white">Senior Node ($25):</strong> High-yield matrix generating <strong className="text-teal-400">$8 Direct</strong> + <strong className="text-teal-400">$8 Matrix</strong> income. Requires Junior Node active first to ensure structured community progression.
              </>
            )}
          </p>

          <div className="mt-2.5 pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Demo Strategy Engine
            </span>
            <span className="text-zinc-400">Click avatar to close</span>
          </div>

          {/* Pointer triangle */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-950" />
        </div>
      )}

      {/* Speech Bubble Pill / Click Indicator */}
      <button 
        type="button"
        onClick={handleCharacterClick}
        className={`mb-1.5 px-3 py-1 rounded-full bg-zinc-950/90 border border-emerald-400/40 backdrop-blur-xl shadow-[0_2px_15px_rgba(16,185,129,0.2)] flex items-center gap-1.5 max-w-[220px] transition-all duration-300 cursor-pointer hover:border-emerald-300 hover:scale-105 active:scale-95 ${
          isTooltipOpen ? 'border-emerald-400 ring-2 ring-emerald-500/20' : ''
        }`}
        title="Click to view AI package guidance"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_6px_#34d399]" />
        <span className="text-[10px] font-mono font-bold text-zinc-200 leading-tight truncate">
          {currentSpeech}
        </span>
        <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
      </button>

      {/* Floating AI Robot Avatar Container */}
      <div 
        onClick={handleCharacterClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center cursor-pointer group"
        title="AI Assistant: Click for package tips"
      >
        {/* Ambient Soft Glow Behind AI */}
        <div 
          className={`absolute w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500/25 to-teal-500/20 blur-xl pointer-events-none transition-transform duration-500 ${
            isHovered || isTooltipOpen ? 'scale-125 bg-emerald-400/35' : 'animate-pulse'
          }`}
        />

        {/* Floating Animation Wrapper */}
        <div 
          className="relative transition-transform duration-300 group-hover:scale-110"
          style={{
            animation: 'aiFloat 3.2s ease-in-out infinite',
          }}
        >
          {/* Cybernetic AI Bot Vector Graphics */}
          <svg 
            width={size === 'sm' ? 42 : size === 'header' ? 48 : 50} 
            height={size === 'sm' ? 42 : size === 'header' ? 48 : 50} 
            viewBox="0 0 72 72" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
          >
            {/* Outer Orbital Gyro Ring */}
            <ellipse 
              cx="36" 
              cy="36" 
              rx="32" 
              ry="11" 
              stroke="url(#aiRingGrad)" 
              strokeWidth="1.8" 
              strokeDasharray="4 2"
              className="opacity-70"
              transform="rotate(-22 36 36)"
            />

            {/* Inner Orbital Fast Ring */}
            <ellipse 
              cx="36" 
              cy="36" 
              rx="24" 
              ry="8" 
              stroke="url(#aiRingGrad2)" 
              strokeWidth="1.4" 
              transform="rotate(32 36 36)"
              className="opacity-80"
            />

            {/* Core Orb Body */}
            <circle 
              cx="36" 
              cy="36" 
              r="19" 
              fill="url(#aiBodyGrad)" 
              stroke="#10b981" 
              strokeWidth="2"
            />

            {/* Metallic Head Crest / Antenna */}
            <path 
              d="M36 17V11M36 11L33 13M36 11L39 13" 
              stroke="#34d399" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <circle cx="36" cy="9" r="2" fill="#6ee7b7" className="animate-ping" />
            <circle cx="36" cy="9" r="2" fill="#34d399" />

            {/* Glowing Visor Screen */}
            <rect 
              x="22" 
              y="28" 
              width="28" 
              height="15" 
              rx="7.5" 
              fill="#03160e" 
              stroke="#059669" 
              strokeWidth="1.2" 
            />

            {/* Cyber Eyes / Optic Lenses */}
            <g className="transition-all duration-300">
              {/* Left Eye */}
              <circle cx="29" cy="35" r="3.2" fill="#34d399" className="shadow-[0_0_8px_#34d399]" />
              <circle cx="29.8" cy="34.2" r="1.1" fill="#ecfdf5" />
              {/* Right Eye */}
              <circle cx="43" cy="35" r="3.2" fill="#34d399" className="shadow-[0_0_8px_#34d399]" />
              <circle cx="43.8" cy="34.2" r="1.1" fill="#ecfdf5" />
              {/* Intelligent Wave Connection between eyes */}
              <path 
                d="M33 35H39" 
                stroke="#6ee7b7" 
                strokeWidth="1.2" 
                strokeLinecap="round" 
                strokeDasharray="1.5 1.5"
                className="opacity-75"
              />
            </g>

            {/* Articulated Holographic Pointer Arm (Gestures toward button) */}
            <g 
              style={{
                transformOrigin: '50px 42px',
                animation: 'aiPointerGesture 2.4s ease-in-out infinite',
              }}
            >
              {/* Arm Connector */}
              <path 
                d="M51 40L58 48L64 52" 
                stroke="#34d399" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* Pointer Finger / Laser Pointer Tip */}
              <circle cx="64" cy="52" r="2.5" fill="#10b981" />
              <circle cx="64" cy="52" r="5" fill="#34d399" opacity="0.3" className="animate-ping" />
              {/* Subtle directional beacon beam */}
              <path 
                d="M65 53L70 58" 
                stroke="#6ee7b7" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeDasharray="1 1"
              />
            </g>

            {/* Left Balance Stabilizer Wing */}
            <path 
              d="M17 38L10 44L14 47" 
              stroke="#059669" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              opacity="0.8" 
            />

            {/* Gradients */}
            <defs>
              <linearGradient id="aiBodyGrad" x1="20" y1="18" x2="52" y2="54" gradientUnits="userSpaceOnUse">
                <stop stopColor="#062e1e" />
                <stop offset="0.5" stopColor="#041d13" />
                <stop offset="1" stopColor="#02100a" />
              </linearGradient>
              <linearGradient id="aiRingGrad" x1="4" y1="36" x2="68" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="0.5" stopColor="#34d399" stopOpacity="0.9" />
                <stop offset="1" stopColor="#059669" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="aiRingGrad2" x1="12" y1="36" x2="60" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34d399" stopOpacity="0.1" />
                <stop offset="0.5" stopColor="#6ee7b7" stopOpacity="0.8" />
                <stop offset="1" stopColor="#059669" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Embedded CSS Keyframes for AI Float & Pointer Gesture */}
      <style>{`
        @keyframes aiFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(1.5deg);
          }
        }
        @keyframes aiPointerGesture {
          0%, 100% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(10deg) translateY(2px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};
