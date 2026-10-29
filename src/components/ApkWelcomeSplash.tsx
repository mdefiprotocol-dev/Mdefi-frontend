/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Volume2, VolumeX, ShieldCheck, Zap, Lock, Sparkles, ArrowRight } from 'lucide-react';
import Rotating3DMbttcCoin from './common/Rotating3DMbttcCoin';

/**
 * Single audio asset for the splash sequence (8-second narration).
 * 0.0s – 3.9s: Ambient sci-fi intro music & whoosh (Hero text 100% hidden)
 * 4.0s – 7.8s: Voiceover "Welcome to MDeFi Protocol & Networks" (Letter-by-letter kinetic sync)
 * 8.0s: Audio ends -> Compact ENTER button unlocks
 */
export const AUDIO_SRC = '/assets/welcome.mp3';

export interface ApkWelcomeSplashProps {
  /** Optional callback invoked when the user taps the ENTER button */
  onEnter?: () => void;
  /** Optional custom class name for the root container */
  className?: string;
  /** Default audio enabled state */
  soundEnabled?: boolean;
}

/**
 * Letter-by-letter timing mapping for "Welcome to MDeFi" (Line 1) and "Protocol & Networks" (Line 2)
 * Distributed across 4.0s to 7.8s to match the exact voice cadence.
 */
interface TimedLetter {
  char: string;
  time: number;
}

interface TimedWord {
  word: string;
  letters: TimedLetter[];
  isHighlight?: boolean;
}

function buildLetterTimeline(): { line1: TimedWord[]; line2: TimedWord[] } {
  // Line 1: "Welcome to MDeFi" (4.00s - 5.70s)
  // "Welcome": 4.00s - 4.55s
  // "to": 4.60s - 4.95s
  // "MDeFi": 5.00s - 5.70s
  const line1Defs = [
    { word: 'Welcome', start: 4.0, end: 4.55 },
    { word: 'to', start: 4.6, end: 4.95 },
    { word: 'MDeFi', start: 5.0, end: 5.7, isHighlight: true },
  ];

  // Line 2: "Protocol & Networks" (5.75s - 7.80s)
  // "Protocol": 5.75s - 6.45s
  // "&": 6.50s - 6.75s
  // "Networks": 6.85s - 7.80s
  const line2Defs = [
    { word: 'Protocol', start: 5.75, end: 6.45, isHighlight: true },
    { word: '&', start: 6.5, end: 6.78 },
    { word: 'Networks', start: 6.85, end: 7.8, isHighlight: true },
  ];

  const mapWords = (defs: { word: string; start: number; end: number; isHighlight?: boolean }[]): TimedWord[] => {
    return defs.map((def) => {
      const chars = Array.from(def.word);
      const span = (def.end - def.start) / Math.max(1, chars.length);
      const letters: TimedLetter[] = chars.map((char, i) => ({
        char,
        time: def.start + i * span,
      }));
      return {
        word: def.word,
        letters,
        isHighlight: def.isHighlight,
      };
    });
  };

  return {
    line1: mapWords(line1Defs),
    line2: mapWords(line2Defs),
  };
}

const TIMELINE_DATA = buildLetterTimeline();

/**
 * High-DPI Crystal-Clear Sci-Fi Blockchain Constellation & Embers Canvas
 * Fills the upper, middle, and lower areas with glowing nodes, dynamic lines, and floating embers.
 * Eliminates flat black void patches entirely.
 */
const SciFiConstellationCanvas: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let displayWidth = window.innerWidth;
    let displayHeight = window.innerHeight;

    const resize = () => {
      if (!canvas) return;
      displayWidth = window.innerWidth;
      displayHeight = window.innerHeight;
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Particle nodes distributed evenly across the screen with 3D depth layering
    const count = Math.min(68, Math.floor((displayWidth * displayHeight) / 11000));
    const particles = Array.from({ length: count }, (_, i) => {
      const isUpper = i % 2 === 0;
      return {
        x: Math.random() * displayWidth,
        y: isUpper ? Math.random() * (displayHeight * 0.55) : Math.random() * displayHeight,
        z: Math.random() * 0.9 + 0.35,
        vx: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.28),
        vy: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.28),
        radius: Math.random() * 1.5 + 0.8,
        color:
          Math.random() > 0.6
            ? '6, 182, 212' // Cyan
            : Math.random() > 0.3
            ? '16, 185, 129' // Emerald
            : '251, 191, 36', // Golden amber ember
        alpha: Math.random() * 0.5 + 0.25,
        pulse: Math.random() * 0.012 + 0.006,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Razor-sharp connecting cyber-lines across space
      const maxDist = 125;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.22 * particles[i].z;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      // Draw floating luminous cyber-particles & embers
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha * p.z})`;
        ctx.shadowColor = p.color.includes('251') ? '#fbbf24' : '#06b6d4';
        ctx.shadowBlur = 6 * p.z;
        ctx.fill();

        if (!reducedMotion) {
          p.x += p.vx * p.z;
          p.y += p.vy * p.z;
          p.alpha += p.pulse;
          if (p.alpha > 0.85 || p.alpha < 0.2) p.pulse = -p.pulse;

          if (p.x < -10) p.x = displayWidth + 10;
          if (p.x > displayWidth + 10) p.x = -10;
          if (p.y < -10) p.y = displayHeight + 10;
          if (p.y > displayHeight + 10) p.y = -10;
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[2]"
      style={{
        width: '100%',
        height: '100%',
        opacity: 0.95,
      }}
    />
  );
};

/**
 * 3D Metallic-Gold MBTTC Coin with Actively Rotating Concentric Cyber-Rings & Backlight Aura
 */
interface MbttcCoinProps {
  reducedMotion: boolean;
  activeFace: 'mbttc' | 'monogram';
  onFlip: () => void;
  isUnlocked: boolean;
}

const MajesticMbttcCoin: React.FC<MbttcCoinProps> = ({
  reducedMotion,
  activeFace,
  onFlip,
  isUnlocked,
}) => {
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({
      x: Math.max(-10, Math.min(10, -dy * 10)),
      y: Math.max(-12, Math.min(12, dx * 12)),
    });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onFlip}
      role="button"
      tabIndex={0}
      aria-label="3D MBTTC Coin - Tap to view alternate face"
      className="relative flex items-center justify-center cursor-pointer select-none group touch-manipulation focus:outline-none"
      style={{
        width: 'clamp(200px, 48vw, 255px)',
        height: 'clamp(200px, 48vw, 255px)',
        perspective: '1200px',
      }}
    >
      {/* 1. Breathing Golden-Cyan Backlight Aura Radiating Behind the Coin */}
      <div
        className="absolute inset-[-14%] rounded-full pointer-events-none transition-all duration-1000"
        style={{
          background:
            'radial-gradient(circle, rgba(6, 182, 212, 0.36) 0%, rgba(245, 158, 11, 0.2) 30%, rgba(16, 185, 129, 0.16) 55%, transparent 72%)',
          filter: 'blur(28px)',
          transform: isUnlocked ? 'scale(1.12)' : 'scale(1)',
          animation: reducedMotion ? 'none' : 'aura-pulse 5s ease-in-out infinite alternate',
        }}
      />

      {/* 2. Outer Segmented Tech Cyber-Ring (Counter-Clockwise 3D Rotation with Tilt) */}
      <div
        className="absolute inset-[-16%] rounded-full border border-cyan-400/25 border-dashed pointer-events-none"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(24deg)',
          animation: reducedMotion ? 'none' : 'cyber-orbit-ccw 30s linear infinite',
        }}
      >
        {/* Tech Corner Tick Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[1.5px] bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[1.5px] bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[1.5px] h-4 bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[1.5px] h-4 bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
      </div>

      {/* 3. Concentric Middle Orbital Ring with Micro Glowing Nodes (Clockwise Rotation) */}
      <div
        className="absolute inset-[-9%] rounded-full border border-emerald-400/30 pointer-events-none"
        style={{
          boxShadow: '0 0 16px rgba(16, 185, 129, 0.15), inset 0 0 12px rgba(6, 182, 212, 0.12)',
          animation: reducedMotion ? 'none' : 'cyber-orbit-cw 22s linear infinite',
        }}
      >
        {/* Micro Glowing Satellite Node 1 (Cyan with light trail) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
        {/* Micro Glowing Satellite Node 2 (Emerald) */}
        <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
        {/* Micro Glowing Satellite Node 3 (Amber) */}
        <div className="absolute bottom-1/5 left-1 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#fde047]" />
      </div>

      {/* 4. Inner Fine Tech Ring (Counter-Clockwise Rotation) */}
      <div
        className="absolute inset-[-3%] rounded-full border border-amber-400/25 border-dotted pointer-events-none"
        style={{
          animation: reducedMotion ? 'none' : 'cyber-orbit-ccw 36s linear infinite',
        }}
      >
        <div className="absolute top-1/3 right-0 translate-x-1/2 w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_8px_#fef08a]" />
      </div>

      {/* 5. Physical 3D Coin Body with Floating Hover Effect */}
      <div
        className="relative w-full h-full rounded-full transition-transform duration-500 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          animation: reducedMotion ? 'none' : 'majestic-float 6s ease-in-out infinite',
        }}
      >
        {/* Ambient Drop Shadow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              '0 25px 50px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(245, 158, 11, 0.28), 0 0 55px rgba(6, 182, 212, 0.2)',
          }}
        />

        {/* 3D Coin Foundation Layer */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'linear-gradient(135deg, #78350f 0%, #92400e 25%, #451a03 50%, #b45309 75%, #78350f 100%)',
            transform: 'translateZ(-12px)',
          }}
        />

        {/* Stepped Metallic Edge */}
        <div
          className="absolute inset-[2px] rounded-full"
          style={{
            background:
              'linear-gradient(225deg, #d97706 0%, #fbbf24 30%, #78350f 60%, #fef08a 85%, #92400e 100%)',
            transform: 'translateZ(-6px)',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.6)',
          }}
        />

        {/* Outer Coin Bevel Rim (Stepped Coin Teeth Pattern) */}
        <div
          className="absolute inset-0 rounded-full p-[3px] sm:p-1"
          style={{
            background:
              'conic-gradient(from 45deg, #fef08a 0deg, #d97706 45deg, #451a03 90deg, #fef08a 140deg, #b45309 180deg, #fef9c3 225deg, #78350f 270deg, #fde047 315deg, #fef08a 360deg)',
            boxShadow:
              '0 0 16px rgba(251, 191, 36, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.85), inset 0 -3px 6px rgba(0, 0, 0, 0.85)',
          }}
        >
          {/* Inner Recessed Face with Radial Gold Sheen */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden flex flex-col items-center justify-center"
            style={{
              background:
                'radial-gradient(circle at 45% 35%, #fef08a 0%, #f59e0b 28%, #d97706 52%, #92400e 74%, #451a03 100%)',
              boxShadow:
                'inset 0 4px 12px rgba(0, 0, 0, 0.75), inset 0 0 24px rgba(120, 53, 15, 0.95), 0 0 18px rgba(251, 191, 36, 0.28)',
            }}
          >
            {/* Concentric Grooves & Beaded Rings */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 300 300"
              fill="none"
            >
              <circle
                cx="150"
                cy="150"
                r="138"
                stroke="#fef08a"
                strokeWidth="2.2"
                strokeDasharray="4 3"
                strokeOpacity="0.85"
              />
              <circle
                cx="150"
                cy="150"
                r="132"
                stroke="#78350f"
                strokeWidth="1.5"
                strokeOpacity="0.9"
              />
              <circle
                cx="150"
                cy="150"
                r="124"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeDasharray="1.5 6.8"
                strokeLinecap="round"
                strokeOpacity="0.9"
                style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }}
              />
              <circle
                cx="150"
                cy="150"
                r="116"
                stroke="#fef08a"
                strokeWidth="1.2"
                strokeOpacity="0.6"
              />
              <circle
                cx="150"
                cy="150"
                r="104"
                stroke="#78350f"
                strokeWidth="2.5"
                strokeOpacity="0.8"
              />
              <circle
                cx="150"
                cy="150"
                r="102"
                stroke="#fef9c3"
                strokeWidth="1"
                strokeOpacity="0.75"
              />
            </svg>

            {/* Specular Diagonal Sheen Sweep */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(115deg, rgba(255,255,255,0) 25%, rgba(255,255,255,0.48) 48%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0.1) 53%, rgba(255,255,255,0) 70%)',
                mixBlendMode: 'overlay',
                animation: reducedMotion ? 'none' : 'sheen-sweep 6s ease-in-out infinite',
              }}
            />

            {/* Coin Center Motif */}
            {activeFace === 'mbttc' ? (
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200 fill-amber-200 animate-pulse drop-shadow-[0_0_6px_#fef08a]" />
                  <Sparkles className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-100 fill-amber-100 drop-shadow-[0_0_8px_#ffffff]" />
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200 fill-amber-200 animate-pulse drop-shadow-[0_0_6px_#fef08a]" />
                </div>

                <span
                  className="font-extrabold tracking-wider text-3xl sm:text-4xl md:text-5xl select-none"
                  style={{
                    fontFamily: "'Cinzel', serif, system-ui",
                    background:
                      'linear-gradient(180deg, #ffffff 0%, #fef08a 35%, #f59e0b 70%, #78350f 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter:
                      'drop-shadow(0 2px 1px rgba(0,0,0,0.9)) drop-shadow(0 -1px 1px rgba(255,255,255,0.8))',
                  }}
                >
                  MBTTC
                </span>

                <span
                  className="font-bold tracking-[0.25em] text-xs sm:text-sm mt-0.5 sm:mt-1 select-none"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: '#fef08a',
                    textShadow:
                      '0 1px 2px rgba(0, 0, 0, 0.95), 0 -1px 1px rgba(255, 255, 255, 0.5), 0 0 10px rgba(245, 158, 11, 0.6)',
                  }}
                >
                  ON-CHAIN
                </span>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                <svg
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)]"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="mRibbonLeftPrecision" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#fef08a" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <linearGradient id="mRibbonRightPrecision" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="60%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                    <linearGradient id="mRibbonCenterPrecision" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="40%" stopColor="#fef9c3" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                  </defs>
                  <path d="M20 74 L20 28 L38 52 L38 74 Z" fill="url(#mRibbonLeftPrecision)" />
                  <path d="M80 74 L80 28 L62 52 L62 74 Z" fill="url(#mRibbonRightPrecision)" />
                  <path d="M38 52 L50 36 L62 52 L50 68 Z" fill="url(#mRibbonCenterPrecision)" />
                  <circle cx="20" cy="24" r="3" fill="#ffffff" filter="drop-shadow(0 0 4px #fef08a)" />
                  <circle cx="50" cy="30" r="3.5" fill="#ffffff" filter="drop-shadow(0 0 5px #fef08a)" />
                  <circle cx="80" cy="24" r="3" fill="#ffffff" filter="drop-shadow(0 0 4px #fef08a)" />
                </svg>

                <span
                  className="font-bold tracking-[0.2em] text-[10px] sm:text-xs mt-1 text-amber-100"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 8px rgba(251,191,36,0.6)',
                  }}
                >
                  MAGNET BITCOIN
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Standalone ApkWelcomeSplash Component
 */
export default function ApkWelcomeSplash({
  onEnter,
  className = '',
  soundEnabled = true,
}: ApkWelcomeSplashProps) {
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [audioAllowed, setAudioAllowed] = useState<boolean>(soundEnabled);
  const [audioNeedsInteraction, setAudioNeedsInteraction] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [activeFace, setActiveFace] = useState<'mbttc' | 'monogram'>('mbttc');
  const [isEntering, setIsEntering] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check user OS preference for reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // 8-Second Direct Instant Autoplay & Lag-Free Sync Engine
  useEffect(() => {
    const audio = new Audio('/assets/welcome.mp3');
    audio.preload = 'auto';
    audio.autoplay = true;
    audioRef.current = audio;

    // Instant play on mount (Native APK & Modern Web)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback for browsers with strict policy on first install
        const resumeAudio = () => {
          audio.play().catch(() => {});
          ['touchstart', 'click', 'keydown'].forEach(e => window.removeEventListener(e, resumeAudio));
        };
        ['touchstart', 'click', 'keydown'].forEach(e => window.addEventListener(e, resumeAudio, { once: true }));
      });
    }

    const onTimeUpdate = () => {
      setPlaybackTime(audio.currentTime);
      if (audio.currentTime >= 7.8) {
        setIsUnlocked(true);
      }
    };

    const onEnded = () => {
      setPlaybackTime(8.0);
      setIsUnlocked(true);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    // Guaranteed unlock timer so app never gets stuck
    const unlockTimer = setTimeout(() => {
      setIsUnlocked(true);
    }, 8000);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      clearTimeout(unlockTimer);
    };
  }, []);

  // Unlock audio on first user touch if blocked by browser policy
  const handleUserInteract = () => {
    if (audioNeedsInteraction && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setAudioNeedsInteraction(false);
          setAudioAllowed(true);
        })
        .catch(() => {});
    }
  };

  // Toggle Sound On/Off
  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioAllowed) {
      audioRef.current?.pause();
      setAudioAllowed(false);
      setAudioNeedsInteraction(false);
    } else {
      setAudioAllowed(true);
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setAudioNeedsInteraction(false))
          .catch(() => setAudioNeedsInteraction(true));
      }
    }
  };

  // ENTER Button Tap Handler
  const handleEnterTap = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isUnlocked || isEntering) return;
      setIsEntering(true);

      const timer = setTimeout(() => {
        if (onEnter) {
          onEnter();
        } else {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('mdefi:apk_entered'));
          }
        }
      }, 350);

      return () => clearTimeout(timer);
    },
    [isUnlocked, isEntering, onEnter]
  );

  // Strict 4.0-second visibility gate for the Hero Text (Audio Cadence Sync)
  const isHeroTextVisible = playbackTime >= 3.0;

  return (
    <div
      onClick={handleUserInteract}
      className={`fixed inset-0 z-[999999] w-screen h-[100dvh] max-h-[100dvh] overflow-hidden touch-none select-none bg-[#020708] text-white flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200 ${className}`}
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)',
      }}
    >
      {/* =========================================================================
          SECTION 4: ULTRA-CLEAR SCI-FI & BLOCKCHAIN VOID BACKGROUND
         ========================================================================= */}
      {/* 1. True Obsidian Deep-Space Foundation (Flat Green Completely Gone) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 bg-[#010408]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 35%, #051a1e 0%, #020d12 45%, #010609 75%, #010408 100%)',
        }}
      />

      {/* 2. Top-Center High-Tech Sci-Fi Refraction Lights */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[110vw] max-w-[800px] h-[55vh] rounded-full pointer-events-none z-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(6, 182, 212, 0.6) 0%, rgba(16, 185, 129, 0.25) 45%, transparent 75%)',
          filter: 'blur(50px)',
          animation: reducedMotion ? 'none' : 'refraction-sway 10s ease-in-out infinite alternate',
        }}
      />

      {/* 3. Concentric High-Tech 3D Ambient Ring in Background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full pointer-events-none z-0 border border-cyan-500/20"
        style={{
          boxShadow: '0 0 50px rgba(6, 182, 212, 0.15), inset 0 0 40px rgba(16, 185, 129, 0.1)',
        }}
      />

      {/* 4. Vivid 3D Cyber-Grid Horizon Matrix */}
      <div
        className="absolute -bottom-2 left-0 right-0 h-60 pointer-events-none z-0 overflow-hidden opacity-75"
        style={{ perspective: '380px' }}
      >
        <div
          className="w-full h-[240%] origin-bottom"
          style={{
            transform: 'rotateX(75deg)',
            backgroundImage:
              'linear-gradient(to right, rgba(6, 182, 212, 0.65) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(16, 185, 129, 0.5) 1.5px, transparent 1.5px)',
            backgroundSize: '36px 36px',
            animation: reducedMotion ? 'none' : 'grid-move-forward 3.2s linear infinite',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)',
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 1) 50%, transparent 100%)',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.9), 0 0 45px rgba(16, 185, 129, 0.7)',
          }}
        />
      </div>

      {/* 5. High-DPI Floating Constellation Lines & Luminous Dust Canvas */}
      <SciFiConstellationCanvas reducedMotion={reducedMotion} />

      {/* =========================================================================
          TOP MINIMAL STATUS BAR (Clean Sci-Fi Look - No Buttons)
         ========================================================================= */}
      <header className="relative z-20 w-full px-5 sm:px-8 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/25 bg-[#02181b]/70 backdrop-blur-md shadow-[0_0_12px_rgba(6,182,212,0.12)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </span>
          <span
            className="text-[10px] font-semibold tracking-widest uppercase text-emerald-300"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            CORE ONLINE
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-cyan-500/20 bg-[#02181b]/50 text-[10px] font-mono text-cyan-400/80">
          <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>SYNC ACTIVE</span>
        </div>
      </header>

      {/* =========================================================================
          SECTION 1: BALANCED VERTICAL ALIGNMENT & SCREEN COMPOSITION
          - Unified Centerpiece: Hero Text -> 18px gap -> Coin -> 20px gap -> ENTER
          - Zero excessive gaps, cohesive centered framing on 100dvh
         ========================================================================= */}
      <main className="relative z-10 w-full px-4 flex flex-col items-center justify-center flex-1 my-auto">
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
          {/* =========================================================================
              SECTION 2: 4-SECOND AUDIO TIMING & ULTRA-SMOOTH TEXT FADE
              - 0.0s – 3.8s: Invisible
              - Exactly 3.9s: Smooth cinematic neon reveal (Zero Stutter / Zero Lag)
             ========================================================================= */}
          <div
            className={`w-full text-center flex flex-col items-center justify-center mb-4 sm:mb-5 transition-all duration-1000 ease-out select-none ${
              isHeroTextVisible
                ? 'opacity-100 scale-100 translate-y-0 filter-none'
                : 'opacity-0 scale-95 -translate-y-3 blur-md pointer-events-none'
            }`}
            style={{ willChange: 'opacity, transform, filter' }}
          >
            {/* Line 1: Welcome to MDeFi */}
            <h1
              className="font-extrabold tracking-wide text-2xl sm:text-3xl md:text-4xl leading-tight mb-1"
              style={{
                fontFamily: 'Verdana, sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #d8f5f0 55%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 16px rgba(52, 211, 153, 0.55))',
              }}
            >
              Welcome to <span style={{ background: 'linear-gradient(135deg, #34d399 0%, #22d3ee 50%, #fde047 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MDeFi</span>
            </h1>

            {/* Line 2: Protocol & Networks */}
            <h2
              className="font-extrabold tracking-wide text-xl sm:text-2xl md:text-3xl leading-tight"
              style={{
                fontFamily: 'Verdana, sans-serif',
                background: 'linear-gradient(135deg, #22d3ee 0%, #38bdf8 50%, #fde047 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 16px rgba(34, 211, 238, 0.55))',
              }}
            >
              Protocol & Networks
            </h2>
          </div>

          {/* =========================================================================
              SECTION 3: ROTATING ORBITAL RINGS AROUND THE MBTTC COIN
             ========================================================================= */}
          <div className="flex flex-col items-center justify-center relative" style={{ width: 'clamp(200px, 48vw, 255px)', height: 'clamp(200px, 48vw, 255px)' }}>
            {/* 1. Breathing Golden-Cyan Backlight Aura */}
            <div
              className="absolute inset-[-14%] rounded-full pointer-events-none transition-all duration-1000"
              style={{
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.45) 0%, rgba(245, 158, 11, 0.28) 30%, rgba(16, 185, 129, 0.2) 55%, transparent 72%)',
                filter: 'blur(30px)',
                animation: 'aura-pulse 5s ease-in-out infinite alternate',
              }}
            />

            {/* 2. Outer Segmented Tech Cyber-Ring (Counter-Clockwise) */}
            <div
              className="absolute inset-[-16%] rounded-full border border-cyan-400/40 border-dashed pointer-events-none"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(24deg)',
                animation: 'cyber-orbit-ccw 30s linear infinite',
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[2px] h-4 bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[2px] h-4 bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
            </div>

            {/* 3. Concentric Middle Orbital Ring with Glowing Nodes */}
            <div
              className="absolute inset-[-9%] rounded-full border border-emerald-400/45 pointer-events-none"
              style={{
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.25), inset 0 0 14px rgba(6, 182, 212, 0.2)',
                animation: 'cyber-orbit-cw 22s linear infinite',
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee]" />
              <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              <div className="absolute bottom-1/5 left-1 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047]" />
            </div>

            {/* 4. Inner Tech Ring */}
            <div
              className="absolute inset-[-3%] rounded-full border border-amber-400/35 border-dotted pointer-events-none"
              style={{
                animation: 'cyber-orbit-ccw 36s linear infinite',
              }}
            >
              <div className="absolute top-1/3 right-0 translate-x-1/2 w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_10px_#fef08a]" />
            </div>

            {/* 5. Real 3D Rotating Coin Inside Rings */}
            <div className="relative z-10 flex items-center justify-center drop-shadow-[0_0_35px_rgba(245,158,11,0.65)]" style={{ animation: 'majestic-float 6s ease-in-out infinite' }}>
              <Rotating3DMbttcCoin size={170} />
            </div>
          </div>

          {/* =========================================================================
              SECTION 5: GATED COMPACT "ENTER" BUTTON
              - Balanced 18px–22px margin below the coin orbital rings
              - Locked/dormant during playback -> smoothly unlocks at 8.0s
             ========================================================================= */}
          <div className="w-full flex justify-center mt-4 sm:mt-5">
            <button
              type="button"
              onClick={handleEnterTap}
              disabled={!isUnlocked || isEntering}
              aria-label="Enter MDeFi Protocol Application"
              className={`group relative flex items-center justify-center w-[190px] h-[46px] rounded-full border transition-all duration-300 select-none focus:outline-none backdrop-blur-md ${
                !isUnlocked
                  ? 'opacity-40 cursor-not-allowed border-slate-700/50 bg-[#031518]/50 shadow-none'
                  : isEntering
                  ? 'opacity-95 scale-[0.96] border-amber-300 bg-amber-500/25 shadow-[0_0_24px_rgba(251,191,36,0.6)]'
                  : 'opacity-100 cursor-pointer hover:scale-[1.03] active:scale-[0.96] border-emerald-400/70 hover:border-cyan-300 bg-gradient-to-r from-[#032024]/80 via-[#063339]/85 to-[#032024]/80'
              }`}
              style={{
                willChange: 'transform, opacity, box-shadow',
                boxShadow: !isUnlocked
                  ? 'none'
                  : isEntering
                  ? '0 0 28px rgba(52, 211, 153, 0.8), inset 0 0 12px rgba(52, 211, 153, 0.4)'
                  : '0 0 18px rgba(52, 211, 153, 0.35), 0 0 26px rgba(6, 182, 212, 0.2), inset 0 0 10px rgba(52, 211, 153, 0.2)',
                animation:
                  isUnlocked && !reducedMotion
                    ? 'compact-enter-glow 3s ease-in-out infinite'
                    : 'none',
              }}
            >
              {/* Animated Hairline Emerald-to-Cyan Gradient Border Sweep */}
              {isUnlocked && (
                <span
                  className="absolute inset-0 rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(52, 211, 153, 0.6) 50%, transparent 100%)',
                    animation: reducedMotion ? 'none' : 'sheen-sweep 2.8s ease-in-out infinite',
                  }}
                />
              )}

              {/* Compact Button Content */}
              <div
                className={`relative z-10 flex items-center justify-center gap-1.5 font-bold uppercase transition-colors ${
                  !isUnlocked
                    ? 'text-slate-400 text-[11px] tracking-wider'
                    : 'text-emerald-200 group-hover:text-emerald-100 text-xs sm:text-sm tracking-[0.2em]'
                }`}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  textShadow: isUnlocked
                    ? '0 0 10px rgba(52, 211, 153, 0.7)'
                    : 'none',
                }}
              >
                {!isUnlocked ? (
                  <>
                    <Lock className="w-3 h-3 text-slate-500 animate-pulse" />
                    <span>SYNC {Math.max(0, 8 - Math.floor(playbackTime))}S</span>
                  </>
                ) : isEntering ? (
                  <>
                    <span className="inline-block animate-spin mr-0.5 text-xs">✦</span>
                    <span>OPENING...</span>
                  </>
                ) : (
                  <>
                    <span>ENTER</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* =========================================================================
          FOOTER STATUS & SAFE-AREA DOCK
         ========================================================================= */}
      <footer className="relative z-20 w-full px-5 sm:px-8 flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-1.5 text-emerald-400/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span
            className="text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase text-emerald-300/80"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SECURE CLIENT ENVIRONMENT • BEP-20
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-cyan-400/80 font-mono">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>v2.4.1</span>
        </div>
      </footer>

      {/* Hardware-Accelerated Sci-Fi Animations */}
      <style>{`
        @keyframes cyber-orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cyber-orbit-ccw {
          from { transform: rotateX(24deg) rotate(360deg); }
          to { transform: rotateX(24deg) rotate(0deg); }
        }
        @keyframes majestic-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes sheen-sweep {
          0% { transform: translateX(-150%) rotate(25deg); opacity: 0; }
          40% { opacity: 0.85; }
          60% { opacity: 0.85; }
          100% { transform: translateX(250%) rotate(25deg); opacity: 0; }
        }
        @keyframes compact-enter-glow {
          0%, 100% {
            box-shadow: 0 0 16px rgba(52, 211, 153, 0.35), 0 0 22px rgba(6, 182, 212, 0.15), inset 0 0 8px rgba(52, 211, 153, 0.18);
          }
          50% {
            box-shadow: 0 0 26px rgba(52, 211, 153, 0.6), 0 0 34px rgba(6, 182, 212, 0.35), inset 0 0 14px rgba(52, 211, 153, 0.28);
          }
        }
        @keyframes refraction-sway {
          0% { transform: translate(-50%, 0%) scale(1); opacity: 0.4; }
          100% { transform: translate(-50%, 4%) scale(1.06); opacity: 0.55; }
        }
        @keyframes aura-pulse {
          0% { transform: scale(1); opacity: 0.75; }
          100% { transform: scale(1.08); opacity: 0.95; }
        }
        @keyframes grid-move-forward {
          0% { background-position: 0 0; }
          100% { background-position: 0 32px; }
        }
      `}</style>
    </div>
  );
}
