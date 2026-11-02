/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, Zap, Lock, ArrowRight } from 'lucide-react';
import Rotating3DMbttcCoin from './common/Rotating3DMbttcCoin';

export const AUDIO_SRC = '/assets/welcome.mp3';

export interface ApkWelcomeSplashProps {
  onEnter?: () => void;
  className?: string;
  soundEnabled?: boolean;
}

/**
 * Lightweight Sci-Fi Blockchain Constellation Canvas (Mali-GPU Safe)
 */
const SciFiConstellationCanvas: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let displayWidth = window.innerWidth;
    let displayHeight = window.innerHeight;

    const resize = () => {
      if (!canvas) return;
      displayWidth = window.innerWidth;
      displayHeight = window.innerHeight;
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const count = 22;
    const particles = Array.from({ length: count }, (_, i) => {
      const isUpper = i % 2 === 0;
      return {
        x: Math.random() * displayWidth,
        y: isUpper ? Math.random() * (displayHeight * 0.55) : Math.random() * displayHeight,
        z: Math.random() * 0.9 + 0.35,
        vx: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.25),
        vy: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.25),
        radius: Math.random() * 1.4 + 0.8,
        color:
          Math.random() > 0.6
            ? '6, 182, 212'
            : Math.random() > 0.3
            ? '16, 185, 129'
            : '251, 191, 36',
        alpha: Math.random() * 0.5 + 0.25,
        pulse: Math.random() * 0.012 + 0.006,
      };
    });

    let lastFrameTime = performance.now();
    const frameInterval = 1000 / 60;

    const render = (currentTime: number) => {
      animId = requestAnimationFrame(render);

      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) return;
      lastFrameTime = currentTime - (elapsed % frameInterval);

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const maxDistSq = 120 * 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const lineAlpha = (1 - distSq / maxDistSq) * 0.16 * particles[i].z;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha * p.z})`;
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
    };

    animId = requestAnimationFrame(render);

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
        transform: 'translateZ(0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    />
  );
};

export default function ApkWelcomeSplash({
  onEnter,
  className = '',
  soundEnabled = true,
}: ApkWelcomeSplashProps) {
  const [stage, setStage] = useState<'loading' | 'prompt' | 'playing'>('loading');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isTextVisible, setIsTextVisible] = useState<boolean>(false);
  const [isEntering, setIsEntering] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Strict 2.0s Cold Start -> Age Modal Open
  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setStage('prompt');
    }, 2000);
    return () => clearTimeout(loaderTimer);
  }, []);

  // 2. Reduced Motion Check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // 3. Audio Cleanup on Unmount
  useEffect(() => {
    return () => {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      } catch (_) {}
    };
  }, []);

  // 4. Exact Click Timing Handler
  const handleConfirmAge = useCallback(() => {
    setStage('playing');

    if (soundEnabled) {
      try {
        const audioPath =
          typeof window !== 'undefined' && window.location.protocol === 'capacitor:'
            ? `${window.location.origin}/assets/welcome.mp3`
            : '/assets/welcome.mp3';

        const audio = new Audio(audioPath);
        audioRef.current = audio;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } catch (_) {}
    }

    // Exactly 3.5s: "Welcome to MDeFi" reveal
    setTimeout(() => {
      setIsTextVisible(true);
    }, 3500);

    // Exactly 8.0s: ENTER button unlock
    setTimeout(() => {
      setIsUnlocked(true);
    }, 8000);
  }, [soundEnabled]);

  const handleRejectAge = useCallback(() => {
    alert('You must be 18 or older to access MDeFi Protocol.');
  }, []);

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

  return (
    <div
      className={`fixed inset-0 z-[999999] w-screen h-[100dvh] max-h-[100dvh] overflow-hidden touch-none select-none bg-[#020708] text-white flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200 ${className}`}
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)',
      }}
    >
      {/* AGE VERIFICATION MODAL */}
      {stage !== 'playing' && (
        <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-[#010408]/95 px-4 select-none">
          {stage === 'loading' ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
              <span
                className="text-xs font-mono tracking-widest text-cyan-300 animate-pulse"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                INITIALIZING ENVIRONMENT...
              </span>
            </div>
          ) : (
            <div className="relative w-full max-w-sm rounded-2xl border border-cyan-500/40 bg-[#02181b]/95 p-6 shadow-[0_0_35px_rgba(6,182,212,0.25)] flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>

              <h3
                className="text-lg font-bold text-white tracking-wide mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                AGE VERIFICATION
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-6 font-mono">
                Are you 18 years of age or older to enter MDeFi Protocol?
              </p>

              <div className="flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={handleRejectAge}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-900/60 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                  NO
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAge}
                  className="flex-1 py-2.5 rounded-xl border border-emerald-400/60 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-xs font-bold text-emerald-200 hover:border-cyan-300 shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  YES
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 pointer-events-none z-0 bg-[#010408]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 35%, #051a1e 0%, #020d12 45%, #010609 75%, #010408 100%)',
        }}
      />

      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[110vw] max-w-[800px] h-[55vh] rounded-full pointer-events-none z-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(6, 182, 212, 0.45) 0%, rgba(16, 185, 129, 0.18) 45%, transparent 75%)',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full pointer-events-none z-0 border border-cyan-500/20"
        style={{
          boxShadow: '0 0 50px rgba(6, 182, 212, 0.15), inset 0 0 40px rgba(16, 185, 129, 0.1)',
        }}
      />

      <div
        className="absolute -bottom-2 left-0 right-0 h-60 pointer-events-none z-0 overflow-hidden opacity-75"
        style={{ perspective: '380px', transform: 'translateZ(0)', contain: 'strict' }}
      >
        <div
          className="w-full h-[240%] origin-bottom"
          style={{
            transform: 'rotateX(75deg) translateZ(0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
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

      <SciFiConstellationCanvas reducedMotion={reducedMotion} />

      {/* TOP STATUS BAR */}
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

      {/* MAIN CONTENT */}
      <main className="relative z-10 w-full px-4 flex flex-col items-center justify-center flex-1 my-auto">
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
          {/* HERO TEXT: HARD LOCKED VERDANA */}
          <div
            className={`w-full text-center flex flex-col items-center justify-center mb-10 sm:mb-12 transition-opacity duration-700 ease-out select-none ${
              isTextVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-1 pointer-events-none'
            }`}
            style={{
              transform: 'translateZ(0)',
              willChange: 'opacity, transform',
              WebkitTextSizeAdjust: '100%',
              textSizeAdjust: '100%',
            }}
          >
            <h1
              className="locked-verdana font-extrabold tracking-wide text-2xl sm:text-3xl md:text-4xl leading-tight mb-1"
              style={{
                fontFamily: "Verdana, Geneva, 'DejaVu Sans', sans-serif",
                fontSynthesis: 'none',
                WebkitFontSmoothing: 'antialiased',
                background: 'linear-gradient(135deg, #ffffff 0%, #d8f5f0 55%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(52, 211, 153, 0.45)',
              }}
            >
              Welcome to <span style={{ background: 'linear-gradient(135deg, #34d399 0%, #22d3ee 50%, #fde047 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MDeFi</span>
            </h1>

            <h2
              className="locked-verdana font-extrabold tracking-wide text-xl sm:text-2xl md:text-3xl leading-tight"
              style={{
                fontFamily: "Verdana, Geneva, 'DejaVu Sans', sans-serif",
                fontSynthesis: 'none',
                WebkitFontSmoothing: 'antialiased',
                background: 'linear-gradient(135deg, #22d3ee 0%, #38bdf8 50%, #fde047 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(34, 211, 238, 0.45)',
              }}
            >
              Protocol & Networks
            </h2>
          </div>

          {/* 3D COIN & ORBITAL RINGS */}
          <div className="flex flex-col items-center justify-center relative" style={{ width: 'clamp(200px, 48vw, 255px)', height: 'clamp(200px, 48vw, 255px)' }}>
            <div
              className="absolute inset-[-14%] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.45) 0%, rgba(245, 158, 11, 0.28) 30%, rgba(16, 185, 129, 0.2) 55%, transparent 72%)',
                filter: 'blur(20px)',
                transform: 'translateZ(0)',
                willChange: 'transform, opacity',
                animation: 'aura-pulse 5s ease-in-out infinite alternate',
              }}
            />

            <div
              className="absolute inset-[-16%] rounded-full border border-cyan-400/40 border-dashed pointer-events-none"
              style={{
                transform: 'translateZ(0) rotateX(24deg)',
                willChange: 'transform',
                animation: 'cyber-orbit-ccw 30s linear infinite',
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[2px] h-4 bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[2px] h-4 bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
            </div>

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

            <div
              className="absolute inset-[-3%] rounded-full border border-amber-400/35 border-dotted pointer-events-none"
              style={{
                animation: 'cyber-orbit-ccw 36s linear infinite',
              }}
            >
              <div className="absolute top-1/3 right-0 translate-x-1/2 w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_10px_#fef08a]" />
            </div>

            <div className="relative z-10 flex items-center justify-center drop-shadow-[0_0_35px_rgba(245,158,11,0.65)]" style={{ animation: 'majestic-float 6s ease-in-out infinite' }}>
              <Rotating3DMbttcCoin size={170} />
            </div>
          </div>

          {/* GATED ENTER BUTTON */}
          <div className="w-full flex justify-center mt-8 sm:mt-10">
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
                transform: 'translateZ(0)',
                willChange: 'transform, opacity',
                boxShadow: !isUnlocked
                  ? 'none'
                  : isEntering
                  ? '0 0 28px rgba(52, 211, 153, 0.8), inset 0 0 12px rgba(52, 211, 153, 0.4)'
                  : '0 0 20px rgba(52, 211, 153, 0.4), inset 0 0 10px rgba(52, 211, 153, 0.2)',
              }}
            >
              {isUnlocked && (
                <span
                  className="absolute inset-0 rounded-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity overflow-hidden"
                  style={{
                    transform: 'translateZ(0)',
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(52, 211, 153, 0.5) 50%, transparent 100%)',
                    animation: reducedMotion ? 'none' : 'sheen-sweep 3s ease-in-out infinite',
                  }}
                />
              )}

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
                    <span>SYNCING PROTOCOL...</span>
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

      {/* FOOTER */}
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

      {/* HARDWARE-ACCELERATED STYLES */}
      <style>{`
        .locked-verdana {
          font-family: Verdana, Geneva, 'DejaVu Sans', sans-serif !important;
          font-style: normal !important;
        }

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